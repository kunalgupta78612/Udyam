import express from 'express';
import { getMatchedSchemes } from '../controllers/matchController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Protected match route
router.get('/', protect, getMatchedSchemes);

export default router;
