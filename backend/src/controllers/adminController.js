import mongoose from 'mongoose';
import Scheme from '../models/Scheme.js';
import SchemeVersionHistory from '../models/SchemeVersionHistory.js';

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
