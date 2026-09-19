"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationController = exports.NotificationController = exports.auditLogController = exports.AuditLogController = void 0;
const config_1 = require("../config");
const utils_1 = require("../utils");
class AuditLogController {
    async getLogs(req, res, next) {
        try {
            const { page = 1, limit = 20, action, entity, userId } = req.query;
            const skip = (Number(page) - 1) * Number(limit);
            const where = {};
            if (action)
                where.action = action;
            if (entity)
                where.entity = entity;
            if (userId)
                where.userId = userId;
            const [logs, total] = await Promise.all([
                config_1.prisma.auditLog.findMany({
                    where,
                    skip,
                    take: Number(limit),
                    orderBy: { createdAt: 'desc' },
                    include: {
                        user: { select: { firstName: true, lastName: true, email: true, role: true } },
                    },
                }),
                config_1.prisma.auditLog.count({ where }),
            ]);
            (0, utils_1.sendPaginated)(res, logs, total, Number(page), Number(limit));
        }
        catch (error) {
            next(error);
        }
    }
}
exports.AuditLogController = AuditLogController;
exports.auditLogController = new AuditLogController();
class NotificationController {
    async getNotifications(req, res, next) {
        try {
            const notifications = await config_1.prisma.notification.findMany({
                where: { userId: req.user.id },
                orderBy: { createdAt: 'desc' },
                take: 50,
            });
            const unreadCount = await config_1.prisma.notification.count({
                where: { userId: req.user.id, isRead: false },
            });
            (0, utils_1.sendSuccess)(res, { notifications, unreadCount });
        }
        catch (error) {
            next(error);
        }
    }
    async markAsRead(req, res, next) {
        try {
            if (req.params.id === 'all') {
                await config_1.prisma.notification.updateMany({
                    where: { userId: req.user.id, isRead: false },
                    data: { isRead: true },
                });
            }
            else {
                await config_1.prisma.notification.update({
                    where: { id: req.params.id },
                    data: { isRead: true },
                });
            }
            (0, utils_1.sendSuccess)(res, null, 'Notifications marked as read');
        }
        catch (error) {
            next(error);
        }
    }
}
exports.NotificationController = NotificationController;
exports.notificationController = new NotificationController();
//# sourceMappingURL=system.controller.js.map