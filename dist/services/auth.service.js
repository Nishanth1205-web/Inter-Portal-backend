"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = exports.AuthService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const uuid_1 = require("uuid");
const config_1 = require("../config");
const utils_1 = require("../utils");
const middleware_1 = require("../middleware");
class AuthService {
    async login(email, password, ipAddress, userAgent) {
        const user = await config_1.prisma.user.findUnique({ where: { email } });
        if (!user || !user.isActive) {
            throw new utils_1.UnauthorizedError('Invalid email or password');
        }
        const isPasswordValid = await bcryptjs_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            throw new utils_1.UnauthorizedError('Invalid email or password');
        }
        const accessToken = this.generateAccessToken(user);
        const refreshToken = await this.generateRefreshToken(user.id);
        // Update last login
        await config_1.prisma.user.update({
            where: { id: user.id },
            data: { lastLoginAt: new Date() },
        });
        await (0, middleware_1.createAuditLog)(user.id, 'LOGIN', 'User', user.id, undefined, ipAddress, userAgent);
        utils_1.logger.info(`User logged in: ${user.email}`);
        return {
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
                avatar: user.avatar,
            },
            accessToken,
            refreshToken,
        };
    }
    async logout(userId, refreshToken, ipAddress, userAgent) {
        if (refreshToken) {
            await config_1.prisma.refreshToken.deleteMany({
                where: { token: refreshToken },
            });
        }
        else {
            await config_1.prisma.refreshToken.deleteMany({
                where: { userId },
            });
        }
        await (0, middleware_1.createAuditLog)(userId, 'LOGOUT', 'User', userId, undefined, ipAddress, userAgent);
        utils_1.logger.info(`User logged out: ${userId}`);
    }
    async refreshAccessToken(refreshTokenStr) {
        const tokenRecord = await config_1.prisma.refreshToken.findUnique({
            where: { token: refreshTokenStr },
            include: { user: true },
        });
        if (!tokenRecord) {
            throw new utils_1.UnauthorizedError('Invalid refresh token');
        }
        if (tokenRecord.expiresAt < new Date()) {
            await config_1.prisma.refreshToken.delete({ where: { id: tokenRecord.id } });
            throw new utils_1.UnauthorizedError('Refresh token expired');
        }
        if (!tokenRecord.user.isActive) {
            throw new utils_1.UnauthorizedError('Account is deactivated');
        }
        // Rotate refresh token
        await config_1.prisma.refreshToken.delete({ where: { id: tokenRecord.id } });
        const newRefreshToken = await this.generateRefreshToken(tokenRecord.userId);
        const accessToken = this.generateAccessToken(tokenRecord.user);
        return {
            accessToken,
            refreshToken: newRefreshToken,
        };
    }
    async forgotPassword(email) {
        const user = await config_1.prisma.user.findUnique({ where: { email } });
        if (!user) {
            // Don't reveal whether email exists
            return { message: 'If your email is registered, you will receive a password reset link.' };
        }
        const resetToken = (0, uuid_1.v4)();
        // In production, send email. For dev, log the token.
        utils_1.logger.info(`Password reset token for ${email}: ${resetToken}`);
        // Store the token temporarily (using refresh token table for simplicity)
        await config_1.prisma.refreshToken.create({
            data: {
                token: `reset_${resetToken}`,
                userId: user.id,
                expiresAt: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes
            },
        });
        return { message: 'If your email is registered, you will receive a password reset link.', resetToken };
    }
    async resetPassword(token, newPassword) {
        const tokenRecord = await config_1.prisma.refreshToken.findUnique({
            where: { token: `reset_${token}` },
        });
        if (!tokenRecord || tokenRecord.expiresAt < new Date()) {
            throw new utils_1.BadRequestError('Invalid or expired reset token');
        }
        const hashedPassword = await bcryptjs_1.default.hash(newPassword, 12);
        await config_1.prisma.$transaction([
            config_1.prisma.user.update({
                where: { id: tokenRecord.userId },
                data: { password: hashedPassword },
            }),
            config_1.prisma.refreshToken.delete({
                where: { id: tokenRecord.id },
            }),
            // Invalidate all existing refresh tokens for this user
            config_1.prisma.refreshToken.deleteMany({
                where: { userId: tokenRecord.userId },
            }),
        ]);
        await (0, middleware_1.createAuditLog)(tokenRecord.userId, 'PASSWORD_RESET', 'User', tokenRecord.userId);
        return { message: 'Password has been reset successfully' };
    }
    async registerStudent(data, ipAddress, userAgent) {
        const existingUser = await config_1.prisma.user.findUnique({
            where: { email: data.email },
        });
        if (existingUser) {
            throw new utils_1.BadRequestError('Email is already registered');
        }
        const hashedPassword = await bcryptjs_1.default.hash(data.password, 12);
        const user = await config_1.prisma.$transaction(async (tx) => {
            const newUser = await tx.user.create({
                data: {
                    email: data.email,
                    password: hashedPassword,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    role: 'STUDENT',
                },
            });
            await tx.student.create({
                data: {
                    userId: newUser.id,
                    enrollmentNo: data.enrollmentNo,
                    departmentId: data.departmentId,
                    batchId: data.batchId,
                },
            });
            return newUser;
        });
        await (0, middleware_1.createAuditLog)(user.id, 'REGISTER', 'User', user.id, undefined, ipAddress, userAgent);
        utils_1.logger.info(`New student registered: ${user.email}`);
        // Automatically log them in
        const accessToken = this.generateAccessToken(user);
        const refreshToken = await this.generateRefreshToken(user.id);
        await config_1.prisma.user.update({
            where: { id: user.id },
            data: { lastLoginAt: new Date() },
        });
        return {
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
                avatar: user.avatar,
            },
            accessToken,
            refreshToken,
        };
    }
    async getProfile(userId) {
        const user = await config_1.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true,
                avatar: true,
                phone: true,
                lastLoginAt: true,
                createdAt: true,
                student: {
                    include: {
                        department: true,
                        batch: true,
                    },
                },
                admin: true,
            },
        });
        if (!user)
            throw new utils_1.NotFoundError('User not found');
        return user;
    }
    async impersonate(targetRole, impersonatorId, ipAddress, userAgent) {
        const user = await config_1.prisma.user.findFirst({
            where: {
                role: targetRole,
                isActive: true
            },
            orderBy: { createdAt: 'asc' }
        });
        if (!user) {
            throw new utils_1.NotFoundError(`No active user found with role ${targetRole}`);
        }
        const accessToken = this.generateAccessToken(user);
        const refreshToken = await this.generateRefreshToken(user.id);
        await (0, middleware_1.createAuditLog)(impersonatorId, 'IMPERSONATE', 'User', user.id, undefined, ipAddress, userAgent);
        utils_1.logger.info(`Super Admin impersonated user: ${user.email}`);
        return {
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
                avatar: user.avatar,
            },
            accessToken,
            refreshToken,
        };
    }
    generateAccessToken(user) {
        return jsonwebtoken_1.default.sign({
            userId: user.id,
            email: user.email,
            role: user.role,
            firstName: user.firstName,
            lastName: user.lastName,
        }, config_1.env.JWT_SECRET, { expiresIn: config_1.env.JWT_EXPIRY });
    }
    async generateRefreshToken(userId) {
        const token = (0, uuid_1.v4)();
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);
        await config_1.prisma.refreshToken.create({
            data: {
                token,
                userId,
                expiresAt,
            },
        });
        return token;
    }
}
exports.AuthService = AuthService;
exports.authService = new AuthService();
//# sourceMappingURL=auth.service.js.map