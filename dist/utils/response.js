"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendSuccess = sendSuccess;
exports.sendError = sendError;
exports.sendCreated = sendCreated;
exports.sendPaginated = sendPaginated;
function sendSuccess(res, data, message = 'Request successful', statusCode = 200, meta) {
    const response = {
        success: true,
        message,
        data,
    };
    if (meta)
        response.meta = meta;
    return res.status(statusCode).json(response);
}
function sendError(res, message, statusCode = 500, errors) {
    const response = {
        success: false,
        message,
    };
    if (errors)
        response.errors = errors;
    return res.status(statusCode).json(response);
}
function sendCreated(res, data, message = 'Created successfully') {
    return sendSuccess(res, data, message, 201);
}
function sendPaginated(res, data, total, page, limit, message = 'Request successful') {
    return sendSuccess(res, data, message, 200, {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
    });
}
//# sourceMappingURL=response.js.map