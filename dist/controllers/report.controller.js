"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reportController = exports.ReportController = void 0;
const services_1 = require("../services");
const utils_1 = require("../utils");
const middleware_1 = require("../middleware");
class ReportController {
    async getStudentReport(req, res, next) {
        try {
            const { report, total, page, limit } = await services_1.reportService.getStudentReport(req.query);
            (0, utils_1.sendPaginated)(res, report, total, page, limit);
        }
        catch (error) {
            next(error);
        }
    }
    async getTestReport(req, res, next) {
        try {
            const { report, total, page, limit } = await services_1.reportService.getTestReport(req.query);
            (0, utils_1.sendPaginated)(res, report, total, page, limit);
        }
        catch (error) {
            next(error);
        }
    }
    async exportReport(req, res, next) {
        try {
            const type = (req.params.type || req.query.type || 'student').toLowerCase();
            const format = (req.params.format || req.query.format || 'csv').toLowerCase();
            const params = { ...req.query, ...req.params };
            let reportData;
            let headers;
            if (type.startsWith('student')) {
                const { report } = await services_1.reportService.getStudentReport({ ...params, limit: 10000 });
                reportData = report;
                headers = ['Name', 'Email', 'EnrollmentNo', 'Department', 'Batch', 'TestsAssigned', 'TestsCompleted', 'TestsPending', 'AverageScore', 'MaterialsAssigned', 'MaterialsAccessed', 'MaterialsCompleted'];
            }
            else {
                const { report } = await services_1.reportService.getTestReport({ ...params, limit: 10000 });
                reportData = report;
                headers = ['TestName', 'Subject', 'Status', 'TotalMarks', 'AssignedStudents', 'AttemptedStudents', 'SubmittedStudents', 'PendingStudents', 'AverageScore', 'CompletionPercentage'];
            }
            await (0, middleware_1.createAuditLog)(req.user.id, 'REPORT_EXPORTED', 'Report', undefined, { type, format });
            switch (format) {
                case 'csv': {
                    const csv = await services_1.reportService.exportCSV(reportData, headers);
                    res.setHeader('Content-Type', 'text/csv');
                    res.setHeader('Content-Disposition', `attachment; filename="${type}_report.csv"`);
                    return res.send(csv);
                }
                case 'excel': {
                    const buffer = await services_1.reportService.exportExcel(reportData, headers, `${type} Report`);
                    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                    res.setHeader('Content-Disposition', `attachment; filename="${type}_report.xlsx"`);
                    return res.send(buffer);
                }
                case 'pdf': {
                    const buffer = await services_1.reportService.exportPDF(reportData, headers, `${type} Report`);
                    res.setHeader('Content-Type', 'application/pdf');
                    res.setHeader('Content-Disposition', `attachment; filename="${type}_report.pdf"`);
                    return res.send(buffer);
                }
                default:
                    return (0, utils_1.sendSuccess)(res, reportData, 'Report data');
            }
        }
        catch (error) {
            next(error);
        }
    }
}
exports.ReportController = ReportController;
exports.reportController = new ReportController();
//# sourceMappingURL=report.controller.js.map