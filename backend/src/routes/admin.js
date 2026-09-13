import express from 'express';
import {
  getAllSchemes,
  createScheme,
  updateScheme,
  toggleSchemeActive,
  getSchemeHistory
} from '../controllers/adminController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// Guard all admin routes with authentication and admin role verification
router.use(protect, adminOnly);

// Scheme management routes
router.route('/schemes')
  .get(getAllSchemes)
  .post(createScheme);

router.route('/schemes/:id')
  .put(updateScheme);

router.patch('/schemes/:id/toggle', toggleSchemeActive);
router.get('/schemes/:id/history', getSchemeHistory);

export default router;
