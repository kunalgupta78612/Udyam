import UserProfile from '../models/UserProfile.js';
import Scheme from '../models/Scheme.js';
import { matchAllSchemes } from '../services/ruleEngine.js';

/**
 * @desc    Run deterministic rule engine to match entrepreneur profile against active government schemes
 * @route   GET /api/match
 * @access  Private
 */
export const getMatchedSchemes = async (req, res, next) => {
  try {
    // 1. Retrieve the authenticated user's profile
    const profile = await UserProfile.findOne({ user: req.user._id }).lean();

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found. Please complete your intake profile before matching schemes.'
      });
    }

    // 2. Retrieve all active schemes
    const schemes = await Scheme.find({ isActive: true }).lean();

    // 3. Evaluate schemes using deterministic rule engine (Zero AI)
    const rankedResults = matchAllSchemes(profile, schemes);

    // Grouping summaries
    const eligibleCount = rankedResults.filter((s) => s.matchStatus === 'eligible').length;
    const nearMissCount = rankedResults.filter((s) => s.matchStatus === 'near_miss').length;
    const ineligibleCount = rankedResults.filter((s) => s.matchStatus === 'ineligible').length;

    res.status(200).json({
      success: true,
      summary: {
        totalEvaluated: schemes.length,
        eligibleCount,
        nearMissCount,
        ineligibleCount
      },
      results: rankedResults
    });
  } catch (error) {
    next(error);
  }
};
