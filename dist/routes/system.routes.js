"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dashboard_controller_1 = require("../controllers/dashboard.controller");
const report_controller_1 = require("../controllers/report.controller");
const system_controller_1 = require("../controllers/system.controller");
const middleware_1 = require("../middleware");
const router = (0, express_1.Router)();
router.use(middleware_1.authenticate);
// Dashboards
router.get('/dashboard/super-admin', (0, middleware_1.authorize)('SUPER_ADMIN'), (req, res, next) => dashboard_controller_1.dashboardController.getSuperAdminDashboard(req, res, next));
router.get('/dashboard/admin', (0, middleware_1.authorize)('ADMIN'), (req, res, next) => dashboard_controller_1.dashboardController.getAdminDashboard(req, res, next));
router.get('/dashboard/student', (0, middleware_1.authorize)('STUDENT'), (req, res, next) => dashboard_controller_1.dashboardController.getStudentDashboard(req, res, next));
router.get('/dashboard/live-stats', (0, middleware_1.authorize)('SUPER_ADMIN', 'ADMIN'), (req, res, next) => dashboard_controller_1.dashboardController.getLiveStats(req, res, next));
// Reports (supports singular and plural)
router.get('/reports/students', (0, middleware_1.authorize)('SUPER_ADMIN', 'ADMIN'), (req, res, next) => report_controller_1.reportController.getStudentReport(req, res, next));
router.get('/reports/student', (0, middleware_1.authorize)('SUPER_ADMIN', 'ADMIN'), (req, res, next) => report_controller_1.reportController.getStudentReport(req, res, next));
router.get('/reports/tests', (0, middleware_1.authorize)('SUPER_ADMIN', 'ADMIN'), (req, res, next) => report_controller_1.reportController.getTestReport(req, res, next));
router.get('/reports/test', (0, middleware_1.authorize)('SUPER_ADMIN', 'ADMIN'), (req, res, next) => report_controller_1.reportController.getTestReport(req, res, next));
router.get('/reports/export', (0, middleware_1.authorize)('SUPER_ADMIN', 'ADMIN'), (req, res, next) => report_controller_1.reportController.exportReport(req, res, next));
router.get('/reports/export/:type/:format', (0, middleware_1.authorize)('SUPER_ADMIN', 'ADMIN'), (req, res, next) => report_controller_1.reportController.exportReport(req, res, next));
// Audit Logs
router.get('/audit-logs', (0, middleware_1.authorize)('SUPER_ADMIN'), (req, res, next) => system_controller_1.auditLogController.getLogs(req, res, next));
// Notifications
router.get('/notifications', (req, res, next) => system_controller_1.notificationController.getNotifications(req, res, next));
router.put('/notifications/:id/read', (req, res, next) => system_controller_1.notificationController.markAsRead(req, res, next));
exports.default = router;
//# sourceMappingURL=system.routes.js.map