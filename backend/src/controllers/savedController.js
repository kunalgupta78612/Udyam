import mongoose from 'mongoose';
import SavedScheme from '../models/SavedScheme.js';
import Scheme from '../models/Scheme.js';

/**
 * @desc    Bookmark / Save a scheme for the logged-in user
 * @route   POST /api/saved
 * @access  Private
 */
export const saveScheme = async (req, res, next) => {
  try {
    const { schemeId, status = 'Saved', notes = '' } = req.body;

    if (!schemeId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid schemeId.'
      });
    }

    if (!mongoose.Types.ObjectId.isValid(schemeId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid schemeId format.'
      });
    }

    // Verify the scheme exists
    const schemeExists = await Scheme.findById(schemeId);
    if (!schemeExists) {
      return res.status(404).json({
        success: false,
        message: 'Scheme not found.'
      });
    }

    // Check if already saved
    const existing = await SavedScheme.findOne({
      user: req.user._id,
      scheme: schemeId
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Scheme is already in your saved tracker.'
      });
    }

    // Create saved scheme entry
    const saved = await SavedScheme.create({
      user: req.user._id,
      scheme: schemeId,
      status: ['Saved', 'Applied', 'Approved', 'Pending'].includes(status) ? status : 'Saved',
      notes,
      appliedAt: status === 'Applied' ? new Date() : null,
      updatedStatusAt: new Date()
    });

    const populated = await SavedScheme.findById(saved._id).populate('scheme');

    res.status(201).json({
      success: true,
      message: 'Scheme bookmarked successfully.',
      saved: populated
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all saved schemes for the logged-in user
 * @route   GET /api/saved
 * @access  Private
 */
export const getSavedSchemes = async (req, res, next) => {
  try {
    const { status } = req.query;

    const query = { user: req.user._id };
    if (status) {
      query.status = status;
    }

    const saved = await SavedScheme.find(query)
      .populate('scheme')
      .sort({ updatedAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      count: saved.length,
      saved
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update tracker status or notes for a saved scheme
 * @route   PUT /api/saved/:id
 * @access  Private
 */
export const updateSavedStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid ID format.'
      });
    }

    // Validate status if provided
    if (status && !['Saved', 'Applied', 'Approved', 'Pending'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Allowed values: Saved, Applied, Approved, Pending.'
      });
    }

    // Search by SavedScheme._id or scheme ObjectId, strictly owned by current user
    const saved = await SavedScheme.findOne({
      $or: [{ _id: id }, { scheme: id }],
      user: req.user._id
    });

    if (!saved) {
      return res.status(404).json({
        success: false,
        message: 'Saved scheme not found in your tracker.'
      });
    }

    // Apply updates
    if (status) {
      saved.status = status;
      saved.updatedStatusAt = new Date();
      if (status === 'Applied' && !saved.appliedAt) {
        saved.appliedAt = new Date();
      }
    }

    if (notes !== undefined) {
      saved.notes = notes;
    }

    await saved.save();

    const populated = await SavedScheme.findById(saved._id).populate('scheme');

    res.status(200).json({
      success: true,
      message: 'Tracker status updated successfully.',
      saved: populated
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Remove a saved scheme from user's tracker
 * @route   DELETE /api/saved/:id
 * @access  Private
 */
export const removeSavedScheme = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid ID format.'
      });
    }

    // Find and delete strictly owned by current user
    const deleted = await SavedScheme.findOneAndDelete({
      $or: [{ _id: id }, { scheme: id }],
      user: req.user._id
    });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Saved scheme not found in your tracker.'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Scheme removed from your saved tracker.'
    });
  } catch (error) {
    next(error);
  }
};
