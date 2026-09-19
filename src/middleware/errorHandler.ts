import { Request, Response, NextFunction } from 'express';
import { AppError, sendError, logger } from '../utils';
import { env } from '../config';
import { Prisma } from '@prisma/client';

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction) {
  logger.error(err.message, {
    stack: env.NODE_ENV === 'development' ? err.stack : undefined,
    name: err.name,
  });

  // Custom application errors
  if (err instanceof AppError) {
    return sendError(res, err.message, err.statusCode, err.errors);
  }

  // Prisma errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case 'P2002':
        return sendError(res, 'A record with this value already exists', 409);
      case 'P2025':
        return sendError(res, 'Record not found', 404);
      case 'P2003':
        return sendError(res, 'Related record not found', 400);
      default:
        return sendError(res, 'Database error', 500);
    }
  }

  if (err instanceof Prisma.PrismaClientValidationError) {
    console.error('Prisma Validation Error:', err.message);
    return sendError(res, `Invalid data provided: ${err.message}`, 400);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return sendError(res, 'Invalid token', 401);
  }
  if (err.name === 'TokenExpiredError') {
    return sendError(res, 'Token expired', 401);
  }

  // Default error
  const message = env.NODE_ENV === 'production' ? 'Internal server error' : err.message;
  return sendError(res, message, 500);
}
