import type { Request, Response } from 'express';
import { prisma } from '../config/database.js';
import {
  createInvoiceSchema,
  updateInvoiceSchema,
  updateInvoiceStatusSchema,
  addItemSchema,
  updateItemSchema,
  listInvoicesSchema,
  sendInvoiceSchema
} from '../utils/validation.schema.js';
import {
  calculateInvoiceTotals,
  validateInvoiceItem,
  generateInvoicePDF,
  generateInvoiceNumber
} from '../utils/invoice.utils.js';

// Create Invoice
export const createInvoice = async (req: Request, res: Response) => {
  try {
    const validatedData = createInvoiceSchema.parse(req.body);

    // Validate all item calculations
    validatedData.items.forEach(validateInvoiceItem);

    // Verify client belongs to user
    const client = await prisma.client.findFirst({
      where: {
        id: validatedData.client_id,
        user_id: req.user!.userId
      }
    });

    if (!client) {
      return res.status(404).json({
        success: false,
        message: 'Client not found or does not belong to you'
      });
    }

    // Calculate totals
    const { subtotal, tax_amount, total } = calculateInvoiceTotals(
      validatedData.items,
      validatedData.tax_rate
    );

    // Create invoice with items
    const invoice = await prisma.invoice.create({
      data: {
        user_id: req.user!.userId,
        client_id: validatedData.client_id,
        invoice_number: validatedData.invoice_number,
        title: validatedData.title || null,
        notes: validatedData.notes || null,
        status: validatedData.status,
        issue_date: validatedData.issue_date,
        due_date: validatedData.due_date,
        subtotal,
        tax_rate: validatedData.tax_rate,
        tax_amount,
        total,
        items: {
          create: validatedData.items
        }
      },
      include: {
        items: {
          orderBy: { sort_order: 'asc' }
        },
        client: true
      }
    });

    res.status(201).json({
      success: true,
      message: 'Invoice created successfully',
      data: { invoice }
    });

  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: error.errors
      });
    }
    if (error.message === 'Item total mismatch') {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
    console.error('Invoice creation error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while creating invoice'
    });
  }
};

// List Invoices (with advanced filtering)
export const listInvoices = async (req: Request, res: Response) => {
  try {
    const {
      page,
      limit,
      client_id,
      status,
      search,
      from_date,
      to_date,
      sortBy = 'created_at',
      order = 'desc'
    } = listInvoicesSchema.parse(req.query);

    const skip = (page - 1) * limit;

    const where: any = {
      user_id: req.user!.userId,
      ...(client_id && { client_id }),
      ...(status && { status }),
      ...(from_date && { issue_date: { gte: from_date } }),
      ...(to_date && { issue_date: { lte: to_date } }),
      ...(search && {
        OR: [
          { invoice_number: { contains: search, mode: 'insensitive' as const } },
          { title: { contains: search, mode: 'insensitive' as const } },
          { client: { name: { contains: search, mode: 'insensitive' as const } } }
        ]
      })
    };

    const [invoices, total] = await Promise.all([
      prisma.invoice.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: order },
        include: {
          client: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          items: {
            orderBy: { sort_order: 'asc' }
          },
          payments: {
            orderBy: { created_at: 'desc' }
          }
        }
      }),
      prisma.invoice.count({ where })
    ]);

    // Calculate summary statistics
    const summary = await prisma.invoice.aggregate({
      where: {
        user_id: req.user!.userId,
        ...(!client_id && !status && !from_date && !to_date ? {} : where)
      },
      _sum: {
        total: true,
        subtotal: true
      },
      _count: {
        id: true
      }
    });

    res.json({
      success: true,
      data: {
        invoices,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1
        },
        summary: {
          totalInvoices: summary._count.id,
          totalRevenue: summary._sum.total || 0,
          averageInvoiceValue: summary._count.id > 0
            ? (summary._sum.total || 0) / summary._count.id
            : 0
        }
      }
    });

  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: error.errors
      });
    }
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching invoices'
    });
  }
};

// Get Single Invoice
export const getInvoice = async (req: Request, res: Response) => {
  try {
    const invoiceId = req.params.id as string;
    const invoice = await prisma.invoice.findFirst({
      where: {
        id: invoiceId,
        user_id: req.user!.userId
      },
      include: {
        client: true,
        items: {
          orderBy: { sort_order: 'asc' }
        },
        payments: {
          orderBy: { created_at: 'desc' }
        }
      }
    });

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found'
      });
    }

    res.json({
      success: true,
      data: { invoice }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching invoice'
    });
  }
};

// Update Invoice
export const updateInvoice = async (req: Request, res: Response) => {
  try {
    const validatedData = updateInvoiceSchema.parse(req.body);
    const invoiceId = req.params.id as string;

    const invoice = await prisma.invoice.findFirst({
      where: {
        id: invoiceId,
        user_id: req.user!.userId
      },
      include: {
        items: true
      }
    });

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found'
      });
    }

    // Don't allow updating paid invoices
    if (invoice.status === 'paid') {
      return res.status(400).json({
        success: false,
        message: 'Cannot update paid invoices'
      });
    }

    // If changing client, verify ownership
    if (validatedData.client_id) {
      const client = await prisma.client.findFirst({
        where: {
          id: validatedData.client_id,
          user_id: req.user!.userId
        }
      });

      if (!client) {
        return res.status(404).json({
          success: false,
          message: 'Client not found or does not belong to you'
        });
      }
    }

    // Recalculate totals if tax_rate changed
    let updateData: any = {
      ...(validatedData.client_id && { client_id: validatedData.client_id }),
      ...(validatedData.invoice_number && { invoice_number: validatedData.invoice_number }),
      ...(validatedData.title !== undefined && { title: validatedData.title }),
      ...(validatedData.notes !== undefined && { notes: validatedData.notes }),
      ...(validatedData.status && { status: validatedData.status }),
      ...(validatedData.issue_date && { issue_date: validatedData.issue_date }),
      ...(validatedData.due_date && { due_date: validatedData.due_date })
    };

    if (validatedData.tax_rate !== undefined) {
      const items = await prisma.invoiceItem.findMany({
        where: { invoice_id: invoiceId }
      });

      const calculations = calculateInvoiceTotals(items, validatedData.tax_rate);
      updateData.subtotal = calculations.subtotal;
      updateData.tax_amount = calculations.tax_amount;
      updateData.total = calculations.total;
      updateData.tax_rate = validatedData.tax_rate;
    }

    const updatedInvoice = await prisma.invoice.update({
      where: { id: invoiceId },
      data: updateData,
      include: {
        client: true,
        items: {
          orderBy: { sort_order: 'asc' }
        }
      }
    });

    res.json({
      success: true,
      message: 'Invoice updated successfully',
      data: { invoice: updatedInvoice }
    });

  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: error.errors
      });
    }
    res.status(500).json({
      success: false,
      message: 'An error occurred while updating invoice'
    });
  }
};

// Update Invoice Status
export const updateInvoiceStatus = async (req: Request, res: Response) => {
  try {
    const { status } = updateInvoiceStatusSchema.parse(req.body);
    const invoiceId = req.params.id as string;

    const invoice = await prisma.invoice.findFirst({
      where: {
        id: invoiceId,
        user_id: req.user!.userId
      }
    });

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found'
      });
    }

    // Business logic validation
    if (invoice.status === 'paid' && status !== 'paid') {
      return res.status(400).json({
        success: false,
        message: 'Cannot change status from paid'
      });
    }

    if (status === 'paid' && !invoice.paid_at) {
      return res.status(400).json({
        success: false,
        message: 'Cannot mark as paid without payment. Use payment endpoint instead.'
      });
    }

    const updatedInvoice = await prisma.invoice.update({
      where: { id: invoiceId },
      data: { status },
      include: {
        client: true,
        items: {
          orderBy: { sort_order: 'asc' }
        }
      }
    });

    res.json({
      success: true,
      message: 'Invoice status updated successfully',
      data: { invoice: updatedInvoice }
    });

  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: error.errors
      });
    }
    res.status(500).json({
      success: false,
      message: 'An error occurred while updating invoice status'
    });
  }
};

// Delete Invoice
export const deleteInvoice = async (req: Request, res: Response) => {
  try {
    const invoiceId = req.params.id as string;
    const invoice = await prisma.invoice.findFirst({
      where: {
        id: invoiceId,
        user_id: req.user!.userId
      },
      include: {
        _count: {
          select: { payments: true }
        }
      }
    });

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found'
      });
    }

    // Don't allow deleting invoices with payments
    const invoiceWithPayments = await prisma.invoice.findFirst({
      where: { id: invoiceId },
      include: { _count: { select: { payments: true } } }
    });

    if (invoiceWithPayments && invoiceWithPayments._count.payments > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete invoices with existing payments. Cancel them instead.'
      });
    }

    // Don't allow deleting sent invoices
    if (invoice.status === 'sent') {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete sent invoices. Cancel them first.'
      });
    }

    await prisma.invoice.delete({
      where: { id: invoiceId }
    });

    res.json({
      success: true,
      message: 'Invoice deleted successfully'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'An error occurred while deleting invoice'
    });
  }
};

// Add Item to Invoice
export const addItem = async (req: Request, res: Response) => {
  try {
    const validatedData = addItemSchema.parse(req.body);
    validateInvoiceItem(validatedData);
    const invoiceId = req.params.id as string;

    const invoice = await prisma.invoice.findFirst({
      where: {
        id: invoiceId,
        user_id: req.user!.userId
      }
    });

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found'
      });
    }

    if (invoice.status !== 'draft') {
      return res.status(400).json({
        success: false,
        message: 'Can only add items to draft invoices'
      });
    }

    // Add item and recalculate totals
    const item = await prisma.invoiceItem.create({
      data: {
        invoice_id: invoiceId,
        ...validatedData
      }
    });

    // Recalculate invoice totals
    const items = await prisma.invoiceItem.findMany({
      where: { invoice_id: invoiceId }
    });

    const { subtotal, tax_amount, total } = calculateInvoiceTotals(items, invoice.tax_rate);

    await prisma.invoice.update({
      where: { id: invoiceId },
      data: { subtotal, tax_amount, total }
    });

    res.status(201).json({
      success: true,
      message: 'Item added successfully',
      data: { item }
    });

  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: error.errors
      });
    }
    if (error.message === 'Item total mismatch') {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
    res.status(500).json({
      success: false,
      message: 'An error occurred while adding item'
    });
  }
};

// Update Invoice Item
export const updateItem = async (req: Request, res: Response) => {
  try {
    const validatedData = updateItemSchema.parse(req.body);
    const invoiceId = req.params.id as string;
    const itemId = req.params.itemId as string;

    if (validatedData.quantity && validatedData.unit_price) {
      validateInvoiceItem({
        ...validatedData,
        total: validatedData.quantity * validatedData.unit_price
      });
    }

    const invoice = await prisma.invoice.findFirst({
      where: {
        id: invoiceId,
        user_id: req.user!.userId
      }
    });

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found'
      });
    }

    if (invoice.status !== 'draft') {
      return res.status(400).json({
        success: false,
        message: 'Can only update items in draft invoices'
      });
    }

    // Update item
    const updateData: any = {};
    if (validatedData.description !== undefined) updateData.description = validatedData.description;
    if (validatedData.quantity !== undefined) updateData.quantity = validatedData.quantity;
    if (validatedData.unit_price !== undefined) updateData.unit_price = validatedData.unit_price;
    if (validatedData.total !== undefined) updateData.total = validatedData.total;
    if (validatedData.sort_order !== undefined) updateData.sort_order = validatedData.sort_order;

    const item = await prisma.invoiceItem.update({
      where: { id: itemId },
      data: updateData
    });

    // Recalculate invoice totals
    const items = await prisma.invoiceItem.findMany({
      where: { invoice_id: invoiceId }
    });

    const { subtotal, tax_amount, total } = calculateInvoiceTotals(items, invoice.tax_rate);

    await prisma.invoice.update({
      where: { id: invoiceId },
      data: { subtotal, tax_amount, total }
    });

    res.json({
      success: true,
      message: 'Item updated successfully',
      data: { item }
    });

  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: error.errors
      });
    }
    res.status(500).json({
      success: false,
      message: 'An error occurred while updating item'
    });
  }
};

// Delete Invoice Item
export const deleteItem = async (req: Request, res: Response) => {
  try {
    const invoiceId = req.params.id as string;
    const itemId = req.params.itemId as string;

    const invoice = await prisma.invoice.findFirst({
      where: {
        id: invoiceId,
        user_id: req.user!.userId
      },
      include: {
        items: true
      }
    });

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found'
      });
    }

    if (invoice.status !== 'draft') {
      return res.status(400).json({
        success: false,
        message: 'Can only delete items from draft invoices'
      });
    }

    if (invoice.items.length <= 1) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete the last item. At least one item is required.'
      });
    }

    await prisma.invoiceItem.delete({
      where: { id: itemId }
    });

    // Recalculate invoice totals
    const items = await prisma.invoiceItem.findMany({
      where: { invoice_id: invoiceId }
    });

    const { subtotal, tax_amount, total } = calculateInvoiceTotals(items, invoice.tax_rate);

    await prisma.invoice.update({
      where: { id: invoiceId },
      data: { subtotal, tax_amount, total }
    });

    res.json({
      success: true,
      message: 'Item deleted successfully'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'An error occurred while deleting item'
    });
  }
};

// Send Invoice to Client
export const sendInvoice = async (req: Request, res: Response) => {
  try {
    const { message } = sendInvoiceSchema.parse(req.body);
    const invoiceId = req.params.id as string;

    const invoice = await prisma.invoice.findFirst({
      where: {
        id: invoiceId,
        user_id: req.user!.userId
      },
      include: {
        client: true
      }
    });

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found'
      });
    }

    if (invoice.status !== 'draft') {
      return res.status(400).json({
        success: false,
        message: 'Can only send draft invoices'
      });
    }

    // Update status to sent
    const updatedInvoice = await prisma.invoice.update({
      where: { id: invoiceId },
      data: { status: 'sent' },
      include: {
        client: true,
        items: {
          orderBy: { sort_order: 'asc' }
        }
      }
    });

    // TODO: Send email (you'd implement this with your email service)
    // await sendInvoiceEmail(updatedInvoice.client.email, updatedInvoice, message);

    res.json({
      success: true,
      message: 'Invoice sent successfully',
      data: { invoice: updatedInvoice }
    });

  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: error.errors
      });
    }
    res.status(500).json({
      success: false,
      message: 'An error occurred while sending invoice'
    });
  }
};

// View Public Invoice
export const getPublicInvoice = async (req: Request, res: Response) => {
  try {
    const token = req.params.token as string;
    const invoice = await prisma.invoice.findUnique({
      where: {
        public_token: token
      },
      include: {
        user: {
          select: {
            name: true,
            business_name: true,
            business_logo: true,
            email: true,
            phone: true,
            address: true
          }
        },
        client: true,
        items: {
          orderBy: { sort_order: 'asc' }
        },
        payments: {
          orderBy: { created_at: 'desc' }
        }
      }
    });

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found'
      });
    }

    res.json({
      success: true,
      data: { invoice }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching invoice'
    });
  }
};

// Generate PDF
export const generatePDF = async (req: Request, res: Response) => {
  try {
    const invoiceId = req.params.id as string;
    const invoice = await prisma.invoice.findFirst({
      where: {
        id: invoiceId,
        user_id: req.user!.userId
      },
      include: {
        client: true,
        items: {
          orderBy: { sort_order: 'asc' }
        },
        user: {
          select: {
            name: true,
            business_name: true,
            business_logo: true,
            email: true,
            phone: true,
            address: true
          }
        }
      }
    });

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found'
      });
    }

    const pdfBuffer = await generateInvoicePDF(invoice, invoice.client, invoice.items, invoice.user!);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="invoice-${invoice.invoice_number}.pdf"`);
    res.send(pdfBuffer);

  } catch (error) {
    console.error('PDF generation error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while generating PDF'
    });
  }
};

// Auto-generate invoice number
export const autoGenerateInvoiceNumber = async (req: Request, res: Response) => {
  try {
    const invoiceNumber = await generateInvoiceNumber(req.user!.userId);

    res.json({
      success: true,
      data: { invoiceNumber }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'An error occurred while generating invoice number'
    });
  }
};