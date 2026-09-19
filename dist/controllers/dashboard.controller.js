"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dashboardController = exports.DashboardController = void 0;
const middleware_1 = require("../middleware");
const services_1 = require("../services");
const utils_1 = require("../utils");
class DashboardController {
    async getSuperAdminDashboard(_req, res, next) {
        try {
            const data = await services_1.dashboardService.getSuperAdminDashboard();
            (0, utils_1.sendSuccess)(res, data);
        }
        catch (error) {
            next(error);
        }
    }
    async getAdminDashboard(req, res, next) {
        try {
            const data = await services_1.dashboardService.getAdminDashboard(req.user.id);
            (0, utils_1.sendSuccess)(res, data);
        }
        catch (error) {
            next(error);
        }
    }
    async getStudentDashboard(req, res, next) {
        try {
            const studentId = await (0, middleware_1.getStudentId)(req);
            const data = await services_1.dashboardService.getStudentDashboard(studentId);
            (0, utils_1.sendSuccess)(res, data);
        }
        catch (error) {
            next(error);
        }
    }
    async getLiveStats(_req, res, next) {
        try {
            const data = await services_1.dashboardService.getLiveStats();
            (0, utils_1.sendSuccess)(res, data);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.DashboardController = DashboardController;
exports.dashboardController = new DashboardController();
//# sourceMappingURL=dashboard.controller.js.map