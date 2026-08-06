import { Router } from 'express';
import { register, login, getCurrentUser, googleAuth, googleCallback, verifyGoogleToken } from '../controllers/auth.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import rateLimit from 'express-rate-limit';

const router = Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per windowMs
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again later'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Public routes
router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);

// Google OAuth routes
router.get('/google', googleAuth);
router.get('/google/callback', googleCallback);
router.post('/google/verify', verifyGoogleToken);

// Protected routes
router.get('/me', authenticate, getCurrentUser);

export default router;