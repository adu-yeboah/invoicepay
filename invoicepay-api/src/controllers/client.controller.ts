import type { Request, Response } from 'express';
import { prisma } from '../config/database.js';
import { createClientSchema, updateClientSchema, listClientsSchema } from '../utils/validation.schema.js';

// Create Client
export const createClient = async (req: Request, res: Response) => {
  try {
    const validatedData = createClientSchema.parse(req.body);

    // Check if client with email already exists for this user
    const existingClient = await prisma.client.findFirst({
      where: {
        email: validatedData.email,
        user_id: req.user!.userId
      }
    });

    if (existingClient) {
      return res.status(409).json({
        success: false,
        message: 'A client with this email already exists'
      });
    }

    const client = await prisma.client.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        phone: validatedData.phone || null,
        address: validatedData.address || null,
        user_id: req.user!.userId
      }
    });

    res.status(201).json({
      success: true,
      message: 'Client created successfully',
      data: { client }
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
      message: 'An error occurred while creating client'
    });
  }
};

// List Clients (with pagination & search)
export const listClients = async (req: Request, res: Response) => {
  try {
    const { page, limit, search, sortBy = 'created_at', order = 'desc' } =
      listClientsSchema.parse(req.query);

    const skip = (page - 1) * limit;

    const where = {
      user_id: req.user!.userId,
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' as const } },
          { email: { contains: search, mode: 'insensitive' as const } }
        ]
      })
    };

    const [clients, total] = await Promise.all([
      prisma.client.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: order },
        include: {
          _count: {
            select: { invoices: true }
          }
        }
      }),
      prisma.client.count({ where })
    ]);

    res.json({
      success: true,
      data: {
        clients,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1
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
      message: 'An error occurred while fetching clients'
    });
  }
};

// Get Single Client
export const getClient = async (req: Request, res: Response) => {
  try {
    const clientId = req.params.id as string;
    const client = await prisma.client.findFirst({
      where: {
        id: clientId,
        user_id: req.user!.userId
      },
      include: {
        invoices: {
          orderBy: { created_at: 'desc' },
          take: 5,
          select: {
            id: true,
            invoice_number: true,
            total: true,
            status: true,
            issue_date: true,
            due_date: true
          }
        },
        _count: {
          select: { invoices: true }
        }
      }
    });

    if (!client) {
      return res.status(404).json({
        success: false,
        message: 'Client not found'
      });
    }

    res.json({
      success: true,
      data: { client }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching client'
    });
  }
};

// Update Client
export const updateClient = async (req: Request, res: Response) => {
  try {
    const validatedData = updateClientSchema.parse(req.body);
    const clientId = req.params.id as string;

    const client = await prisma.client.findFirst({
      where: {
        id: clientId,
        user_id: req.user!.userId
      }
    });

    if (!client) {
      return res.status(404).json({
        success: false,
        message: 'Client not found'
      });
    }

    // Check if email conflict
    if (validatedData.email && validatedData.email !== client.email) {
      const existingClient = await prisma.client.findFirst({
        where: {
          email: validatedData.email,
          user_id: req.user!.userId,
          id: { not: clientId }
        }
      });

      if (existingClient) {
        return res.status(409).json({
          success: false,
          message: 'A client with this email already exists'
        });
      }
    }

    const updatedClient = await prisma.client.update({
      where: { id: clientId },
      data: {
        name: validatedData.name || client.name,
        email: validatedData.email || client.email,
        phone: validatedData.phone !== undefined ? validatedData.phone : client.phone,
        address: validatedData.address !== undefined ? validatedData.address : client.address
      }
    });

    res.json({
      success: true,
      message: 'Client updated successfully',
      data: { client: updatedClient }
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
      message: 'An error occurred while updating client'
    });
  }
};

// Delete Client
export const deleteClient = async (req: Request, res: Response) => {
  try {
    const clientId = req.params.id as string;
    const client = await prisma.client.findFirst({
      where: {
        id: clientId,
        user_id: req. user!.userId
      },
      include: {
        _count: { select: { invoices: true } }
      }
    });

    if (!client) {
      return res.status(404).json({
        success: false,
        message: 'Client not found'
      });
    }

    // Check if client has invoices
    const clientWithInvoices = await prisma.client.findFirst({
      where: { id: clientId },
      include: { _count: { select: { invoices: true } } }
    });

    if (clientWithInvoices && clientWithInvoices._count.invoices > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete client with existing invoices. Delete invoices first or archive them.'
      });
    }

    await prisma.client.delete({
      where: { id: clientId }
    });

    res.json({
      success: true,
      message: 'Client deleted successfully'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'An error occurred while deleting client'
    });
  }
};

// Get Client's Invoices
export const getClientInvoices = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const clientId = req.params.id as string;

    const skip = (Number(page) - 1) * Number(limit);

    const where = {
      client_id: clientId,
      user_id: req.user!.userId,
      ...(status && { status: status as string })
    };

    const [invoices, total] = await Promise.all([
      prisma.invoice.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: { created_at: 'desc' },
        include: {
          client: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          items: true,
          payments: {
            orderBy: { created_at: 'desc' }
          }
        }
      }),
      prisma.invoice.count({ where })
    ]);

    res.json({
      success: true,
      data: {
        invoices,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          totalPages: Math.ceil(total / Number(limit))
        }
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching client invoices'
    });
  }
};