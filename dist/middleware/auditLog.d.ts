import { AuthRequest } from './auth';
import { Response, NextFunction } from 'express';
export declare function auditLog(action: string, entity: string, entityId?: string): Promise<(req: AuthRequest, _res: Response, next: NextFunction) => void>;
export declare function createAuditLog(userId: string | undefined, action: string, entity: string, entityId?: string, details?: any, ipAddress?: string, userAgent?: string): Promise<void>;
//# sourceMappingURL=auditLog.d.ts.map