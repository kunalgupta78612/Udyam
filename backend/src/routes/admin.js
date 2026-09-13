import express from 'express';
import {
  getAllSchemes,
  createScheme,
  updateScheme,
  toggleSchemeActive,
  getSchemeHistory,
  fetchUrl,
  getPendingSchemes,
  getPendingSchemeById,
  updatePendingScheme,
  approvePendingScheme,
  deletePendingScheme
} from '../controllers/adminController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// Guard all admin routes with authentication and admin role verification
router.use(protect, adminOnly);

// Scraper / Ingestion pipeline endpoint
router.post('/fetch-url', fetchUrl);

// Pending scheme review queue routes
router.route('/pending')
  .get(getPendingSchemes);

router.route('/pending/:id')
  .get(getPendingSchemeById)
  .put(updatePendingScheme)
  .delete(deletePendingScheme);

router.post('/pending/:id/approve', approvePendingScheme);

// Scheme management routes
router.route('/schemes')
  .get(getAllSchemes)
  .post(createScheme);

router.route('/schemes/:id')
  .put(updateScheme);

router.patch('/schemes/:id/toggle', toggleSchemeActive);
router.get('/schemes/:id/history', getSchemeHistory);

export default router;

