import UserProfile from '../models/UserProfile.js';

/**
 * @desc    Create or update user profile
 * @route   POST /api/profile
 * @route   PUT /api/profile
 * @access  Private
 */
export const createOrUpdateProfile = async (req, res, next) => {
  try {
    const {
      category,
      gender,
      age,
      annualIncome,
      businessStage,
      sector,
      state,
      ruralOrUrban,
      isPwD,
      isTransgender,
      hasCollateral,
      qualification
    } = req.body;

    const profileFields = {
      user: req.user._id,
      category,
      gender,
      age,
      annualIncome,
      businessStage,
      sector,
      state,
      ruralOrUrban,
      isPwD: isPwD ?? false,
      isTransgender: isTransgender ?? false,
      hasCollateral: hasCollateral ?? false,
      qualification: qualification || null
    };

    // Upsert (create if not exists, update if exists)
    const profile = await UserProfile.findOneAndUpdate(
      { user: req.user._id },
      { $set: profileFields },
      {
        returnDocument: 'after',
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true
      }
    ).populate('user', 'name email role');

    res.status(200).json({
      success: true,
      message: 'Profile saved successfully.',
      profile
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get current user's profile
 * @route   GET /api/profile
 * @access  Private
 */
export const getProfile = async (req, res, next) => {
  try {
    const profile = await UserProfile.findOne({ user: req.user._id }).populate(
      'user',
      'name email role'
    );

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found. Please create your profile.'
      });
    }

    res.status(200).json({
      success: true,
      profile
    });
  } catch (error) {
    next(error);
  }
};
