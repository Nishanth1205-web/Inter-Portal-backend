"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
const utils_1 = require("../utils");
const config_1 = require("../config");
const client_1 = require("@prisma/client");
function errorHandler(err, _req, res, _next) {
    utils_1.logger.error(err.message, {
        stack: config_1.env.NODE_ENV === 'development' ? err.stack : undefined,
        name: err.name,
    });
    // Custom application errors
    if (err instanceof utils_1.AppError) {
        return (0, utils_1.sendError)(res, err.message, err.statusCode, err.errors);
    }
    // Prisma errors
    if (err instanceof client_1.Prisma.PrismaClientKnownRequestError) {
        switch (err.code) {
            case 'P2002':
                return (0, utils_1.sendError)(res, 'A record with this value already exists', 409);
            case 'P2025':
                return (0, utils_1.sendError)(res, 'Record not found', 404);
            case 'P2003':
                return (0, utils_1.sendError)(res, 'Related record not found', 400);
            default:
                return (0, utils_1.sendError)(res, 'Database error', 500);
        }
    }
    if (err instanceof client_1.Prisma.PrismaClientValidationError) {
        console.error('Prisma Validation Error:', err.message);
        return (0, utils_1.sendError)(res, `Invalid data provided: ${err.message}`, 400);
    }
    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        return (0, utils_1.sendError)(res, 'Invalid token', 401);
    }
    if (err.name === 'TokenExpiredError') {
        return (0, utils_1.sendError)(res, 'Token expired', 401);
    }
    // Default error
    const message = config_1.env.NODE_ENV === 'production' ? 'Internal server error' : err.message;
    return (0, utils_1.sendError)(res, message, 500);
}
//# sourceMappingURL=errorHandler.js.map