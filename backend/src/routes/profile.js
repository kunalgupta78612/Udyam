import express from 'express';
import {
  createOrUpdateProfile,
  getProfile
} from '../controllers/profileController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All profile endpoints are protected
router.use(protect);

router.route('/')
  .get(getProfile)
  .post(createOrUpdateProfile)
  .put(createOrUpdateProfile);

export default router;
