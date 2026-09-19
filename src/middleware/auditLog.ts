import { prisma } from '../config';
import { AuthRequest } from './auth';
import { Response, NextFunction } from 'express';

export async function auditLog(action: string, entity: string, entityId?: string) {
  return (req: AuthRequest, _res: Response, next: NextFunction) => {
    // Fire and forget — don't block the response
    const userId = req.user?.id;
    const ipAddress = req.ip || req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'];

    prisma.auditLog.create({
      data: {
        userId,
        action,
        entity,
        entityId,
        ipAddress,
        userAgent,
        details: req.body ? JSON.stringify({ body: req.body }) : undefined,
      },
    }).catch((err) => {
      console.error('Audit log error:', err);
    });

    next();
  };
}

export async function createAuditLog(
  userId: string | undefined,
  action: string,
  entity: string,
  entityId?: string,
  details?: any,
  ipAddress?: string,
  userAgent?: string
) {
  try {
    await prisma.auditLog.create({
      data: {
        userId,
        action,
        entity,
        entityId,
        details: details ? (typeof details === 'string' ? details : JSON.stringify(details)) : undefined,
        ipAddress,
        userAgent,
      },
    });
  } catch (err) {
    console.error('Audit log error:', err);
  }
}
