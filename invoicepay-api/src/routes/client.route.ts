import { Router } from 'express';
import {
  createClient,
  listClients,
  getClient,
  updateClient,
  deleteClient,
  getClientInvoices
} from '../controllers/client.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();

// All client routes require authentication
router.use(authenticate);

router.post('/', createClient);
router.get('/', listClients);
router.get('/:id', getClient);
router.put('/:id', updateClient);
router.delete('/:id', deleteClient);
router.get('/:id/invoices', getClientInvoices);

export default router;