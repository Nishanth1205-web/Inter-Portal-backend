import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware';
export declare class AuditLogController {
    getLogs(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
}
export declare const auditLogController: AuditLogController;
export declare class NotificationController {
    getNotifications(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    markAsRead(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
}
export declare const notificationController: NotificationController;
//# sourceMappingURL=system.controller.d.ts.map