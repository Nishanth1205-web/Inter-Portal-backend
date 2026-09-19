"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.auditLog = auditLog;
exports.createAuditLog = createAuditLog;
const config_1 = require("../config");
async function auditLog(action, entity, entityId) {
    return (req, _res, next) => {
        // Fire and forget — don't block the response
        const userId = req.user?.id;
        const ipAddress = req.ip || req.socket.remoteAddress;
        const userAgent = req.headers['user-agent'];
        config_1.prisma.auditLog.create({
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
async function createAuditLog(userId, action, entity, entityId, details, ipAddress, userAgent) {
    try {
        await config_1.prisma.auditLog.create({
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
    }
    catch (err) {
        console.error('Audit log error:', err);
    }
}
//# sourceMappingURL=auditLog.js.map