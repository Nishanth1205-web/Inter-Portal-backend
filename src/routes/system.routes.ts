import { Router } from 'express';
import { dashboardController } from '../controllers/dashboard.controller';
import { reportController } from '../controllers/report.controller';
import { auditLogController, notificationController } from '../controllers/system.controller';
import { authenticate, authorize } from '../middleware';

const router = Router();
router.use(authenticate);

// Dashboards
router.get('/dashboard/super-admin', authorize('SUPER_ADMIN'), (req, res, next) => dashboardController.getSuperAdminDashboard(req, res, next));
router.get('/dashboard/admin', authorize('ADMIN'), (req, res, next) => dashboardController.getAdminDashboard(req, res, next));
router.get('/dashboard/student', authorize('STUDENT'), (req, res, next) => dashboardController.getStudentDashboard(req, res, next));
router.get('/dashboard/live-stats', authorize('SUPER_ADMIN', 'ADMIN'), (req, res, next) => dashboardController.getLiveStats(req, res, next));

// Reports (supports singular and plural)
router.get('/reports/students', authorize('SUPER_ADMIN', 'ADMIN'), (req, res, next) => reportController.getStudentReport(req, res, next));
router.get('/reports/student', authorize('SUPER_ADMIN', 'ADMIN'), (req, res, next) => reportController.getStudentReport(req, res, next));
router.get('/reports/tests', authorize('SUPER_ADMIN', 'ADMIN'), (req, res, next) => reportController.getTestReport(req, res, next));
router.get('/reports/test', authorize('SUPER_ADMIN', 'ADMIN'), (req, res, next) => reportController.getTestReport(req, res, next));
router.get('/reports/export', authorize('SUPER_ADMIN', 'ADMIN'), (req, res, next) => reportController.exportReport(req, res, next));
router.get('/reports/export/:type/:format', authorize('SUPER_ADMIN', 'ADMIN'), (req, res, next) => reportController.exportReport(req, res, next));

// Audit Logs
router.get('/audit-logs', authorize('SUPER_ADMIN'), (req, res, next) => auditLogController.getLogs(req, res, next));

// Notifications
router.get('/notifications', (req, res, next) => notificationController.getNotifications(req, res, next));
router.put('/notifications/:id/read', (req, res, next) => notificationController.markAsRead(req, res, next));

export default router;
