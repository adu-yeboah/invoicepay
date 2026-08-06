import { z } from 'zod';

// Registration schema
export const registerSchema = z.object({
  email: z.string().email('Invalid email address').min(5).max(100).toLowerCase().trim(),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  name: z.string().min(2).max(100).optional(),
  business_name: z.string().min(2).max(100).optional(),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number').optional()
});

// Login schema
export const loginSchema = z.object({
  email: z.string().email('Invalid email address').toLowerCase().trim(),
  password: z.string().min(1, 'Password is required')
});

// Types
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;



// Client management schemas
export const createClientSchema = z.object({
  name: z.string().min(2, 'Client name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number').optional(),
  address: z.string().max(500, 'Address must be less than 500 characters').optional()
});

export const updateClientSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  email: z.string().email().optional(),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/).optional(),
  address: z.string().max(500).optional()
});

export const listClientsSchema = z.object({
  page: z.string().optional().transform(val => val ? parseInt(val) : 1),
  limit: z.string().optional().transform(val => val ? parseInt(val) : 10),
  search: z.string().optional(),
  sortBy: z.enum(['name', 'email', 'created_at']).optional(),
  order: z.enum(['asc', 'desc']).optional()
});

// Types
export type CreateClientInput = z.infer<typeof createClientSchema>;
export type UpdateClientInput = z.infer<typeof updateClientSchema>;
export type ListClientsInput = z.infer<typeof listClientsSchema>;

// Invoice management schemas

export const createInvoiceSchema = z.object({
  client_id: z.string().uuid('Invalid client ID'),
  invoice_number: z.string().min(1, 'Invoice number is required').max(50),
  title: z.string().max(200).optional(),
  notes: z.string().max(1000).optional(),
  status: z.enum(['draft', 'sent', 'paid', 'overdue', 'cancelled']).default('draft'),
  issue_date: z.coerce.date().default(() => new Date()),
  due_date: z.coerce.date(),
  items: z.array(z.object({
    description: z.string().min(1, 'Description is required'),
    quantity: z.number().int().positive('Quantity must be positive'),
    unit_price: z.number().positive('Unit price must be positive'),
    total: z.number().positive('Total must be positive'),
    sort_order: z.number().int().default(0)
  })).min(1, 'At least one item is required'),
  tax_rate: z.number().min(0).max(100).default(0)
});

export const updateInvoiceSchema = z.object({
  client_id: z.string().uuid().optional(),
  invoice_number: z.string().min(1).max(50).optional(),
  title: z.string().max(200).optional(),
  notes: z.string().max(1000).optional(),
  status: z.enum(['draft', 'sent', 'paid', 'overdue', 'cancelled']).optional(),
  issue_date: z.coerce.date().optional(),
  due_date: z.coerce.date().optional(),
  tax_rate: z.number().min(0).max(100).optional()
});

export const updateInvoiceStatusSchema = z.object({
  status: z.enum(['draft', 'sent', 'paid', 'overdue', 'cancelled'])
});

export const addItemSchema = z.object({
  description: z.string().min(1, 'Description is required'),
  quantity: z.number().int().positive('Quantity must be positive'),
  unit_price: z.number().positive('Unit price must be positive'),
  total: z.number().positive('Total must be positive'),
  sort_order: z.number().int().default(0)
});

export const updateItemSchema = z.object({
  description: z.string().min(1).optional(),
  quantity: z.number().int().positive().optional(),
  unit_price: z.number().positive().optional(),
  total: z.number().positive().optional(),
  sort_order: z.number().int().optional()
});

export const listInvoicesSchema = z.object({
  page: z.string().optional().transform(val => val ? parseInt(val) : 1),
  limit: z.string().optional().transform(val => val ? parseInt(val) : 10),
  client_id: z.string().uuid().optional(),
  status: z.enum(['draft', 'sent', 'paid', 'overdue', 'cancelled']).optional(),
  search: z.string().optional(),
  from_date: z.coerce.date().optional(),
  to_date: z.coerce.date().optional(),
  sortBy: z.enum(['created_at', 'issue_date', 'due_date', 'total', 'invoice_number']).optional(),
  order: z.enum(['asc', 'desc']).optional()
});

export const sendInvoiceSchema = z.object({
  message: z.string().max(500).optional()
});

// Types
export type CreateInvoiceInput = z.infer<typeof createInvoiceSchema>;
export type UpdateInvoiceInput = z.infer<typeof updateInvoiceSchema>;
export type AddItemInput = z.infer<typeof addItemSchema>;
export type UpdateItemInput = z.infer<typeof updateItemSchema>;
export type ListInvoicesInput = z.infer<typeof listInvoicesSchema>;
export type SendInvoiceInput = z.infer<typeof sendInvoiceSchema>;
