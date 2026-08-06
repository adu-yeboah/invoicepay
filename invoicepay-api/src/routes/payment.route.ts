import { Router } from 'express';
import { listPayments, initializePayment, paystackWebhook } from '../controllers/payment.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();

// Webhook is public (verification is done internally with paystack)
router.post('/webhook', paystackWebhook);

// Protected routes
router.use(authenticate);
router.get('/', listPayments);
router.post('/:invoiceId/initialize', initializePayment);

export default router;
