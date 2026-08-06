import type { Request, Response } from 'express';
import { prisma } from '#config/database.js';

export const listPayments = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const [payments, total] = await Promise.all([
      prisma.payment.findMany({
        where: { invoice: { user_id: req.user!.userId } },
        include: { invoice: { select: { invoice_number: true, client: { select: { name: true } } } } },
        orderBy: { created_at: 'desc' },
        skip,
        take: limit,
      }),
      prisma.payment.count({
        where: { invoice: { user_id: req.user!.userId } },
      })
    ]);

    res.json({
      success: true,
      data: {
        payments,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'An error occurred while fetching payments' });
  }
};

export const initializePayment = async (req: Request, res: Response) => {
  try {
    const invoiceId = req.params.invoiceId as string;
    
    const invoice = await prisma.invoice.findFirst({
      where: { id: invoiceId },
      include: { user: true, client: true }
    });

    if (!invoice) {
      return res.status(404).json({ success: false, message: 'Invoice not found' });
    }

    if (invoice.status === 'paid') {
      return res.status(400).json({ success: false, message: 'Invoice is already paid' });
    }

    const paystackSecretKey = invoice.user.paystack_secret_key;
    if (!paystackSecretKey) {
      return res.status(400).json({ success: false, message: 'Payment gateway not configured by the merchant' });
    }

    // Call Paystack API
    const response = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${paystackSecretKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: invoice.client.email,
        amount: Math.round(invoice.total * 100), // Paystack expects amount in minor units
        currency: 'GHS',
        reference: `INV_${invoice.id}_${Date.now()}`,
        metadata: {
          invoice_id: invoice.id,
          client_id: invoice.client.id,
        }
      })
    });

    const result = await response.json();

    if (!result.status) {
      return res.status(400).json({ success: false, message: 'Failed to initialize payment with gateway', error: result.message });
    }

    // Create pending payment record
    const payment = await prisma.payment.create({
      data: {
        invoice_id: invoice.id,
        paystack_reference: result.data.reference,
        amount: invoice.total,
        currency: 'GHS',
        status: 'pending'
      }
    });

    res.json({
      success: true,
      message: 'Payment initialized',
      data: {
        authorization_url: result.data.authorization_url,
        reference: result.data.reference,
        payment
      }
    });

  } catch (error) {
    console.error('Payment initialization error:', error);
    res.status(500).json({ success: false, message: 'An error occurred while initializing payment' });
  }
};

export const paystackWebhook = async (req: Request, res: Response) => {
  try {
    const event = req.body;

    // Acknowledge receipt quickly to Paystack
    res.status(200).send('Webhook received');

    if (event.event === 'charge.success') {
      const reference = event.data.reference;
      
      const payment = await prisma.payment.findUnique({
        where: { paystack_reference: reference },
        include: { invoice: { include: { user: true } } }
      });

      if (!payment || payment.status === 'success') return;

      const userSecret = payment.invoice.user.paystack_secret_key;
      
      if (userSecret) {
         // Verify transaction with Paystack using the user's secret key
         const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
           headers: { Authorization: `Bearer ${userSecret}` }
         });
         const verifyResult = await response.json();
         
         if (verifyResult.data.status === 'success') {
            await prisma.$transaction(async (tx) => {
              // Update payment
              await tx.payment.update({
                where: { id: payment.id },
                data: { status: 'success', paid_at: new Date(), payment_method: verifyResult.data.channel }
              });

              // Update invoice
              await tx.invoice.update({
                where: { id: payment.invoice_id },
                data: { status: 'paid', paid_at: new Date() }
              });

              // Create notification
              if (payment.invoice.user.payment_alerts) {
                await tx.notification.create({
                  data: {
                    user_id: payment.invoice.user_id,
                    title: 'Payment Received',
                    message: `Payment of GHS ${payment.amount} received for invoice ${payment.invoice.invoice_number}`,
                    type: 'success',
                    action_url: `/invoices/${payment.invoice_id}`
                  }
                });
              }
            });
         }
      }
    }
  } catch (error) {
    console.error('Webhook error:', error);
  }
};
