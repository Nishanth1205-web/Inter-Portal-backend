"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = exports.AuthController = void 0;
const auth_service_1 = require("../services/auth.service");
const utils_1 = require("../utils");
class AuthController {
    async login(req, res, next) {
        try {
            const { email, password } = req.body;
            const result = await auth_service_1.authService.login(email, password, req.ip, req.headers['user-agent']);
            (0, utils_1.sendSuccess)(res, result, 'Login successful');
        }
        catch (error) {
            next(error);
        }
    }
    async logout(req, res, next) {
        try {
            const { refreshToken } = req.body;
            await auth_service_1.authService.logout(req.user.id, refreshToken, req.ip, req.headers['user-agent']);
            (0, utils_1.sendSuccess)(res, null, 'Logout successful');
        }
        catch (error) {
            next(error);
        }
    }
    async refresh(req, res, next) {
        try {
            const { refreshToken } = req.body;
            const result = await auth_service_1.authService.refreshAccessToken(refreshToken);
            (0, utils_1.sendSuccess)(res, result, 'Token refreshed');
        }
        catch (error) {
            next(error);
        }
    }
    async forgotPassword(req, res, next) {
        try {
            const { email } = req.body;
            const result = await auth_service_1.authService.forgotPassword(email);
            (0, utils_1.sendSuccess)(res, result);
        }
        catch (error) {
            next(error);
        }
    }
    async resetPassword(req, res, next) {
        try {
            const { token, password } = req.body;
            const result = await auth_service_1.authService.resetPassword(token, password);
            (0, utils_1.sendSuccess)(res, result);
        }
        catch (error) {
            next(error);
        }
    }
    async getProfile(req, res, next) {
        try {
            const user = await auth_service_1.authService.getProfile(req.user.id);
            (0, utils_1.sendSuccess)(res, user, 'Profile retrieved');
        }
        catch (error) {
            next(error);
        }
    }
    async impersonate(req, res, next) {
        try {
            const { role } = req.body;
            const result = await auth_service_1.authService.impersonate(role, req.user.id, req.ip, req.headers['user-agent']);
            (0, utils_1.sendSuccess)(res, result, `Impersonated ${role} successfully`);
        }
        catch (error) {
            next(error);
        }
    }
    async registerStudent(req, res, next) {
        try {
            const result = await auth_service_1.authService.registerStudent(req.body, req.ip, req.headers['user-agent']);
            (0, utils_1.sendSuccess)(res, result, 'Student registered successfully', 201);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.AuthController = AuthController;
exports.authController = new AuthController();
//# sourceMappingURL=auth.controller.js.map