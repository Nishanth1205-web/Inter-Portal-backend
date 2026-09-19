import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware';
import { prisma } from '../config';
import { sendSuccess, sendPaginated } from '../utils';

export class AuditLogController {
  async getLogs(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { page = 1, limit = 20, action, entity, userId } = req.query as any;
      const skip = (Number(page) - 1) * Number(limit);

      const where: any = {};
      if (action) where.action = action;
      if (entity) where.entity = entity;
      if (userId) where.userId = userId;

      const [logs, total] = await Promise.all([
        prisma.auditLog.findMany({
          where,
          skip,
          take: Number(limit),
          orderBy: { createdAt: 'desc' },
          include: {
            user: { select: { firstName: true, lastName: true, email: true, role: true } },
          },
        }),
        prisma.auditLog.count({ where }),
      ]);

      sendPaginated(res, logs, total, Number(page), Number(limit));
    } catch (error) { next(error); }
  }
}

export const auditLogController = new AuditLogController();

export class NotificationController {
  async getNotifications(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const notifications = await prisma.notification.findMany({
        where: { userId: req.user!.id },
        orderBy: { createdAt: 'desc' },
        take: 50,
      });
      const unreadCount = await prisma.notification.count({
        where: { userId: req.user!.id, isRead: false },
      });
      sendSuccess(res, { notifications, unreadCount });
    } catch (error) { next(error); }
  }

  async markAsRead(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (req.params.id === 'all') {
        await prisma.notification.updateMany({
          where: { userId: req.user!.id, isRead: false },
          data: { isRead: true },
        });
      } else {
        await prisma.notification.update({
          where: { id: req.params.id as string },
          data: { isRead: true },
        });
      }
      sendSuccess(res, null, 'Notifications marked as read');
    } catch (error) { next(error); }
  }
}

export const notificationController = new NotificationController();
