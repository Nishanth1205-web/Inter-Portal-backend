"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = authenticate;
exports.authorize = authorize;
exports.getStudentId = getStudentId;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
const utils_1 = require("../utils");
function authenticate(req, _res, next) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new utils_1.UnauthorizedError('Access token is required');
        }
        const token = authHeader.split(' ')[1];
        const decoded = jsonwebtoken_1.default.verify(token, config_1.env.JWT_SECRET);
        req.user = {
            id: decoded.userId,
            email: decoded.email,
            role: decoded.role,
            firstName: decoded.firstName,
            lastName: decoded.lastName,
        };
        next();
    }
    catch (error) {
        if (error instanceof utils_1.UnauthorizedError) {
            next(error);
        }
        else {
            next(new utils_1.UnauthorizedError('Invalid or expired token'));
        }
    }
}
function authorize(...roles) {
    return (req, _res, next) => {
        if (!req.user) {
            return next(new utils_1.UnauthorizedError('Authentication required'));
        }
        if (!roles.includes(req.user.role)) {
            return next(new utils_1.ForbiddenError('You do not have permission to access this resource'));
        }
        next();
    };
}
async function getStudentId(req) {
    if (!req.user)
        throw new utils_1.UnauthorizedError();
    const student = await config_1.prisma.student.findUnique({
        where: { userId: req.user.id },
    });
    if (!student)
        throw new utils_1.ForbiddenError('Student profile not found');
    return student.id;
}
//# sourceMappingURL=auth.js.map