import type { Request, Response } from 'express';
import { prisma } from '#config/database.js';

export const listNotifications = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const [notifications, total, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        where: { user_id: req.user!.userId },
        orderBy: { created_at: 'desc' },
        skip,
        take: limit,
      }),
      prisma.notification.count({
        where: { user_id: req.user!.userId },
      }),
      prisma.notification.count({
        where: { user_id: req.user!.userId, is_read: false },
      })
    ]);

    res.json({
      success: true,
      data: {
        notifications,
        unreadCount,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'An error occurred while fetching notifications' });
  }
};

export const markAsRead = async (req: Request, res: Response) => {
  try {
    const notificationId = req.params.id as string;
    
    // Verify ownership
    const notification = await prisma.notification.findFirst({
      where: {
        id: notificationId,
        user_id: req.user!.userId
      }
    });

    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    const updated = await prisma.notification.update({
      where: { id: notificationId },
      data: { is_read: true }
    });

    res.json({ success: true, data: { notification: updated } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'An error occurred while marking notification as read' });
  }
};

export const markAllAsRead = async (req: Request, res: Response) => {
  try {
    await prisma.notification.updateMany({
      where: { user_id: req.user!.userId, is_read: false },
      data: { is_read: true }
    });

    res.json({ success: true, message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'An error occurred while marking notifications as read' });
  }
};
