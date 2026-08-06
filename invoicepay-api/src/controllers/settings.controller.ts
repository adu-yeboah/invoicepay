import type { Request, Response } from 'express';
import { prisma } from '#config/database.js';
import { updateProfileSchema, updateIntegrationsSchema, updateNotificationsPrefsSchema } from '#utils/validation.schema.js';

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const validatedData = updateProfileSchema.parse(req.body);

    const user = await prisma.user.update({
      where: { id: req.user!.userId },
      data: validatedData,
      select: {
        id: true,
        email: true,
        name: true,
        business_name: true,
        business_logo: true,
        phone: true,
        address: true,
      }
    });

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: { user }
    });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ success: false, message: 'Validation failed', errors: error.errors });
    }
    res.status(500).json({ success: false, message: 'An error occurred while updating profile' });
  }
};

export const updateIntegrations = async (req: Request, res: Response) => {
  try {
    const validatedData = updateIntegrationsSchema.parse(req.body);

    const user = await prisma.user.update({
      where: { id: req.user!.userId },
      data: validatedData,
      select: {
        id: true,
        paystack_test_mode: true,
        // We omit returning the actual secret key for security reasons
      }
    });

    res.json({
      success: true,
      message: 'Integrations updated successfully',
      data: { user }
    });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ success: false, message: 'Validation failed', errors: error.errors });
    }
    res.status(500).json({ success: false, message: 'An error occurred while updating integrations' });
  }
};

export const updateNotificationPrefs = async (req: Request, res: Response) => {
  try {
    const validatedData = updateNotificationsPrefsSchema.parse(req.body);

    const user = await prisma.user.update({
      where: { id: req.user!.userId },
      data: validatedData,
      select: {
        id: true,
        email_notifications: true,
        payment_alerts: true,
        invoice_reminders: true,
        marketing_emails: true
      }
    });

    res.json({
      success: true,
      message: 'Notification preferences updated successfully',
      data: { user }
    });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ success: false, message: 'Validation failed', errors: error.errors });
    }
    res.status(500).json({ success: false, message: 'An error occurred while updating notification preferences' });
  }
};
