import express from 'express';
import {
  saveScheme,
  getSavedSchemes,
  updateSavedStatus,
  removeSavedScheme
} from '../controllers/savedController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All saved scheme routes are private to the authenticated user
router.use(protect);

router.route('/')
  .post(saveScheme)
  .get(getSavedSchemes);

router.route('/:id')
  .put(updateSavedStatus)
  .delete(removeSavedScheme);

export default router;
