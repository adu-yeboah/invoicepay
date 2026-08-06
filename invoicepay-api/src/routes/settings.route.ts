import { Router } from 'express';
import { updateProfile, updateIntegrations, updateNotificationPrefs } from '../controllers/settings.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();

router.use(authenticate);

router.put('/profile', updateProfile);
router.put('/integrations', updateIntegrations);
router.put('/notifications', updateNotificationPrefs);

export default router;
