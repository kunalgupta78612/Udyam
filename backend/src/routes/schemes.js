import express from 'express';
import { getSchemes, getSchemeById } from '../controllers/schemeController.js';

const router = express.Router();

// Public routes
router.get('/', getSchemes);
router.get('/:id', getSchemeById);

export default router;
