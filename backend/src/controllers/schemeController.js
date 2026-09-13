import mongoose from 'mongoose';
import Scheme from '../models/Scheme.js';

/**
 * @desc    Get all active government schemes with optional filtering & search
 * @route   GET /api/schemes
 * @access  Public
 */
export const getSchemes = async (req, res, next) => {
  try {
    const { level, state, search, page = 1, limit = 50 } = req.query;

    // Filter only active schemes
    const query = { isActive: true };

    // Filter by Central / State level
    if (level && ['central', 'state'].includes(level.toLowerCase())) {
      query.level = level.toLowerCase();
    }

    // Filter by specific state
    if (state) {
      query.$or = [{ state: new RegExp(`^${state}$`, 'i') }, { level: 'central' }];
    }

    // Keyword search in name, description, sponsoringBody
    if (search) {
      query.$text = { $search: search };
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 50));
    const skip = (pageNum - 1) * limitNum;

    const [schemes, total] = await Promise.all([
      Scheme.find(query)
        .sort({ createdAt: -1 })
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
 * @desc    Get single scheme details by ID or Slug
 * @route   GET /api/schemes/:id
 * @access  Public
 */
export const getSchemeById = async (req, res, next) => {
  try {
    const { id } = req.params;

    let scheme = null;

    // Search by ObjectId if valid MongoDB ID
    if (mongoose.Types.ObjectId.isValid(id)) {
      scheme = await Scheme.findOne({ _id: id, isActive: true }).lean();
    }

    // Fallback: search by URL-friendly slug
    if (!scheme) {
      scheme = await Scheme.findOne({ slug: id.toLowerCase(), isActive: true }).lean();
    }

    if (!scheme) {
      return res.status(404).json({
        success: false,
        message: `Scheme not found with identifier '${id}'.`
      });
    }

    res.status(200).json({
      success: true,
      scheme
    });
  } catch (error) {
    next(error);
  }
};
