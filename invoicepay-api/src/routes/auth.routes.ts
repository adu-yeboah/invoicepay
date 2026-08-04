import { getCurrentUser, login, register } from "#controller/auth.controllers.js";
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