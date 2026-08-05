import { Router } from 'express';
import {
  createInvoice,
  listInvoices,
  getInvoice,
  updateInvoice,
  updateInvoiceStatus,
  deleteInvoice,
  addItem,
  updateItem,
  deleteItem,
  sendInvoice,
  getPublicInvoice,
  generatePDF,
  autoGenerateInvoiceNumber
} from '../controllers/invoice.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();

// All invoice routes require authentication except public view
router.use(authenticate);

// Invoice CRUD
router.post('/', createInvoice);
router.get('/', listInvoices);
router.get('/auto-number', autoGenerateInvoiceNumber);
router.get('/:id', getInvoice);
router.put('/:id', updateInvoice);
router.put('/:id/status', updateInvoiceStatus);
router.delete('/:id', deleteInvoice);

// Invoice Items
router.post('/:id/items', addItem);
router.put('/:id/items/:itemId', updateItem);
router.delete('/:id/items/:itemId', deleteItem);

// Invoice Actions
router.post('/:id/send', sendInvoice);
router.get('/:id/pdf', generatePDF);

// Public route (no auth required) - exported separately
export const publicRouter = Router();
publicRouter.get('/public/:token', getPublicInvoice);

export default router;