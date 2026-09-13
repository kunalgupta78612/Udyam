import mongoose from 'mongoose';
import Scheme from '../models/Scheme.js';
import SchemeVersionHistory from '../models/SchemeVersionHistory.js';
import PendingScheme from '../models/PendingScheme.js';
import {
  scrapeSchemeUrl,
  batchScrape,
  isValidUrl
} from '../services/schemeScraper.js';
import { parseSchemeWithGemini } from '../services/schemeParser.js';

/**
 * @desc    Get all schemes (including inactive) with admin filters
 * @route   GET /api/admin/schemes
 * @access  Private (Admin only)
 */
export const getAllSchemes = async (req, res, next) => {
  try {
    const { isActive, level, state, search, page = 1, limit = 50 } = req.query;

    const query = {};

    // Filter by active status if explicitly passed
    if (isActive !== undefined) {
      query.isActive = isActive === 'true' || isActive === true;
    }

    // Filter by level
    if (level && ['central', 'state'].includes(level.toLowerCase())) {
      query.level = level.toLowerCase();
    }

    // Filter by state
    if (state) {
      query.state = new RegExp(`^${state}$`, 'i');
    }

    // Text search
    if (search) {
      query.$text = { $search: search };
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 50));
    const skip = (pageNum - 1) * limitNum;

    const [schemes, total] = await Promise.all([
      Scheme.find(query)
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Scheme.countDocuments(query)
    ]);

    res.status(200).json({
      success: true,
      count: schemes.length,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum) || 1,
      schemes
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new scheme manually
 * @route   POST /api/admin/schemes
 * @access  Private (Admin only)
 */
export const createScheme = async (req, res, next) => {
  try {
    const {
      name,
      nameHi,
      sponsoringBody,
      level,
      state,
      description,
      descriptionHi,
      eligibilityRules,
      benefits,
      documentsRequired,
      applicationLink,
      sourceUrl,
      isActive
    } = req.body;

    const scheme = await Scheme.create({
      name,
      nameHi,
      sponsoringBody,
      level,
      state: level === 'central' ? null : state,
      description,
      descriptionHi,
      eligibilityRules: eligibilityRules || [],
      benefits,
      documentsRequired: documentsRequired || [],
      applicationLink,
      sourceUrl,
      isActive: isActive !== undefined ? isActive : true,
      version: 1
    });

    res.status(201).json({
      success: true,
      message: 'Scheme created successfully.',
      scheme
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Edit a scheme and record version history snapshot
 * @route   PUT /api/admin/schemes/:id
 * @access  Private (Admin only)
 */
export const updateScheme = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { changeReason, ...updates } = req.body;

    let scheme = null;

    if (mongoose.Types.ObjectId.isValid(id)) {
      scheme = await Scheme.findById(id);
    }

    if (!scheme) {
      scheme = await Scheme.findOne({ slug: id.toLowerCase() });
    }

    if (!scheme) {
      return res.status(404).json({
        success: false,
        message: `Scheme not found with identifier '${id}'.`
      });
    }

    // 1. Create a snapshot of the current state before applying updates
    await SchemeVersionHistory.create({
      scheme: scheme._id,
      version: scheme.version,
      snapshot: scheme.toObject(),
      changedBy: req.user._id,
      changeReason:
        changeReason ||
        `Scheme updated from version ${scheme.version} to ${scheme.version + 1}`
    });

    // 2. Increment scheme version
    scheme.version += 1;

    // 3. Apply updated fields
    const allowedFields = [
      'name',
      'nameHi',
      'slug',
      'sponsoringBody',
      'level',
      'state',
      'description',
      'descriptionHi',
      'eligibilityRules',
      'benefits',
      'documentsRequired',
      'applicationLink',
      'sourceUrl',
      'isActive'
    ];

    allowedFields.forEach((field) => {
      if (updates[field] !== undefined) {
        scheme[field] = updates[field];
      }
    });

    if (scheme.level === 'central') {
      scheme.state = null;
    }

    await scheme.save();

    res.status(200).json({
      success: true,
      message: `Scheme updated successfully to version ${scheme.version}.`,
      scheme,
      previousVersion: scheme.version - 1
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Toggle active/inactive status for a scheme
 * @route   PATCH /api/admin/schemes/:id/toggle
 * @access  Private (Admin only)
 */
export const toggleSchemeActive = async (req, res, next) => {
  try {
    const { id } = req.params;

    let scheme = null;

    if (mongoose.Types.ObjectId.isValid(id)) {
      scheme = await Scheme.findById(id);
    }

    if (!scheme) {
      scheme = await Scheme.findOne({ slug: id.toLowerCase() });
    }

    if (!scheme) {
      return res.status(404).json({
        success: false,
        message: `Scheme not found with identifier '${id}'.`
      });
    }

    scheme.isActive = !scheme.isActive;
    await scheme.save();

    res.status(200).json({
      success: true,
      message: `Scheme is now ${scheme.isActive ? 'active' : 'inactive'}.`,
      scheme
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get version history for a specific scheme
 * @route   GET /api/admin/schemes/:id/history
 * @access  Private (Admin only)
 */
export const getSchemeHistory = async (req, res, next) => {
  try {
    const { id } = req.params;

    let schemeId = id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      const scheme = await Scheme.findOne({ slug: id.toLowerCase() }).select('_id');
      if (!scheme) {
        return res.status(404).json({
          success: false,
          message: 'Scheme not found.'
        });
      }
      schemeId = scheme._id;
    }

    const history = await SchemeVersionHistory.find({ scheme: schemeId })
      .populate('changedBy', 'name email role')
      .sort({ version: -1 })
      .lean();

    res.status(200).json({
      success: true,
      count: history.length,
      history
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Fetch, parse, and queue scheme for review (Scrape -> Gemini Parse -> PendingScheme)
 * @route   POST /api/admin/fetch-url
 * @access  Private (Admin only)
 */
export const fetchUrl = async (req, res, next) => {
  try {
    const { url, urls, autoQueue = true } = req.body;

    // Batch mode
    if (Array.isArray(urls) && urls.length > 0) {
      const batchResults = await batchScrape(urls);
      return res.status(200).json({
        success: true,
        message: `Scraped ${batchResults.length} URLs.`,
        data: batchResults
      });
    }

    // Single URL mode
    if (!url) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a target url in the request body.'
      });
    }

    if (!isValidUrl(url)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid URL format. Must start with http:// or https://.'
      });
    }

    // 1. Scrape raw content
    const scrapedData = await scrapeSchemeUrl(url);

    // 2. Parse using Gemini AI (with fallback if key not set or during tests)
    let parsedScheme = null;
    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey && apiKey !== 'your_gemini_api_key_here') {
      try {
        parsedScheme = await parseSchemeWithGemini(scrapedData);
      } catch (aiError) {
        console.warn('Gemini extraction notice:', aiError.message);
      }
    }

    // Fallback basic structural extraction if Gemini key not set
    if (!parsedScheme) {
      parsedScheme = {
        name: scrapedData.title || 'Government Scheme',
        nameHi: null,
        sponsoringBody: 'Government of India',
        level: 'central',
        state: null,
        description:
          scrapedData.metaDescription ||
          scrapedData.cleanText.substring(0, 300) ||
          'Government scheme overview.',
        descriptionHi: null,
        eligibilityRules: [],
        benefits: {
          type: 'composite',
          description: 'Financial assistance and support under the scheme.'
        },
        documentsRequired: [],
        applicationLink:
          scrapedData.meta?.externalLinks?.[0]?.url || null,
        sourceUrl: url
      };
    }

    // 3. Save into PendingScheme review queue
    let pendingScheme = null;
    if (autoQueue) {
      pendingScheme = await PendingScheme.create({
        ...parsedScheme,
        status: 'pending',
        rawScrapedContent: {
          title: scrapedData.title,
          cleanText: scrapedData.cleanText.substring(0, 5000),
          scrapedAt: scrapedData.scrapedAt
        }
      });
    }

    res.status(200).json({
      success: true,
      message: 'Scheme content fetched, parsed, and added to pending review queue.',
      scrapedData,
      parsedScheme,
      pendingScheme
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Get all pending schemes in the review queue
 * @route   GET /api/admin/pending
 * @access  Private (Admin only)
 */
export const getPendingSchemes = async (req, res, next) => {
  try {
    const { status = 'pending' } = req.query;

    const query = {};
    if (status !== 'all') {
      query.status = status;
    }

    const pendingSchemes = await PendingScheme.find(query)
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      count: pendingSchemes.length,
      pendingSchemes
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get a single pending scheme by ID
 * @route   GET /api/admin/pending/:id
 * @access  Private (Admin only)
 */
export const getPendingSchemeById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid pending scheme ID format.'
      });
    }

    const pendingScheme = await PendingScheme.findById(id).lean();

    if (!pendingScheme) {
      return res.status(404).json({
        success: false,
        message: 'Pending scheme not found.'
      });
    }

    res.status(200).json({
      success: true,
      pendingScheme
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update/edit a pending scheme during admin review
 * @route   PUT /api/admin/pending/:id
 * @access  Private (Admin only)
 */
export const updatePendingScheme = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid pending scheme ID format.'
      });
    }

    const pendingScheme = await PendingScheme.findById(id);

    if (!pendingScheme) {
      return res.status(404).json({
        success: false,
        message: 'Pending scheme not found.'
      });
    }

    const allowedUpdates = [
      'name',
      'nameHi',
      'sponsoringBody',
      'level',
      'state',
      'description',
      'descriptionHi',
      'eligibilityRules',
      'benefits',
      'documentsRequired',
      'applicationLink',
      'sourceUrl',
      'reviewNotes'
    ];

    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined) {
        pendingScheme[field] = req.body[field];
      }
    });

    if (pendingScheme.level === 'central') {
      pendingScheme.state = null;
    }

    await pendingScheme.save();

    res.status(200).json({
      success: true,
      message: 'Pending scheme updated successfully.',
      pendingScheme
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Approve a pending scheme -> publishes to active Scheme collection
 * @route   POST /api/admin/pending/:id/approve
 * @access  Private (Admin only)
 */
export const approvePendingScheme = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid pending scheme ID format.'
      });
    }

    const pendingScheme = await PendingScheme.findById(id);

    if (!pendingScheme) {
      return res.status(404).json({
        success: false,
        message: 'Pending scheme not found.'
      });
    }

    if (pendingScheme.status === 'approved') {
      return res.status(400).json({
        success: false,
        message: 'This pending scheme has already been approved.'
      });
    }

    // 1. Create the active verified scheme
    const scheme = await Scheme.create({
      name: pendingScheme.name,
      nameHi: pendingScheme.nameHi,
      sponsoringBody: pendingScheme.sponsoringBody,
      level: pendingScheme.level,
      state: pendingScheme.level === 'central' ? null : pendingScheme.state,
      description: pendingScheme.description,
      descriptionHi: pendingScheme.descriptionHi,
      eligibilityRules: pendingScheme.eligibilityRules,
      benefits: pendingScheme.benefits,
      documentsRequired: pendingScheme.documentsRequired,
      applicationLink: pendingScheme.applicationLink,
      sourceUrl: pendingScheme.sourceUrl,
      isActive: true,
      version: 1
    });

    // 2. Update pending scheme record
    pendingScheme.status = 'approved';
    pendingScheme.approvedScheme = scheme._id;
    pendingScheme.reviewedBy = req.user ? req.user._id : null;
    pendingScheme.reviewedAt = new Date();
    await pendingScheme.save();

    res.status(201).json({
      success: true,
      message: 'Scheme approved and published to active corpus.',
      scheme,
      pendingScheme
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Reject or delete a pending scheme
 * @route   DELETE /api/admin/pending/:id
 * @access  Private (Admin only)
 */
export const deletePendingScheme = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid pending scheme ID format.'
      });
    }

    const deleted = await PendingScheme.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Pending scheme not found.'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Pending scheme discarded.'
    });
  } catch (error) {
    next(error);
  }
};
