import express from 'express';
import { register, login, getMe } from '../controllers/authController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/me', protect, getMe);

// Admin-only route
router.get('/admin-check', protect, adminOnly, (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Admin access granted.',
    user: req.user
  });
});

export default router;
