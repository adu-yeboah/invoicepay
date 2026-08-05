import { getCurrentUser, googleAuth, googleCallback, login, register, verifyGoogleToken } from "../controllers/auth.controller.js";
import { authenticate } from "#middleware/auth.middleware.js";
import { Router } from "express";
import rateLimit from "express-rate-limit";

const router = Router()

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 5,
    message: {
        success: false,
        message: 'Too many authentication attempts, please try again later'
    }
})
router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.get('/me', authenticate, getCurrentUser);

router.get('/google', googleAuth);
router.get('google/callback', googleCallback);
router.post('/google/verify', verifyGoogleToken);