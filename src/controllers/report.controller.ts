import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware';
import { reportService } from '../services';
import { sendSuccess, sendPaginated } from '../utils';
import { createAuditLog } from '../middleware';

export class ReportController {
  async getStudentReport(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { report, total, page, limit } = await reportService.getStudentReport(req.query as any);
      sendPaginated(res, report, total, page, limit);
    } catch (error) { next(error); }
  }

  async getTestReport(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { report, total, page, limit } = await reportService.getTestReport(req.query as any);
      sendPaginated(res, report, total, page, limit);
    } catch (error) { next(error); }
  }

  async exportReport(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const type = ((req.params.type || req.query.type || 'student') as string).toLowerCase();
      const format = ((req.params.format || req.query.format || 'csv') as string).toLowerCase();
      const params = { ...req.query, ...req.params };
      
      let reportData: any[];
      let headers: string[];

      if (type.startsWith('student')) {
        const { report } = await reportService.getStudentReport({ ...params, limit: 10000 });
        reportData = report;
        headers = ['Name', 'Email', 'EnrollmentNo', 'Department', 'Batch', 'TestsAssigned', 'TestsCompleted', 'TestsPending', 'AverageScore', 'MaterialsAssigned', 'MaterialsAccessed', 'MaterialsCompleted'];
      } else {
        const { report } = await reportService.getTestReport({ ...params, limit: 10000 });
        reportData = report;
        headers = ['TestName', 'Subject', 'Status', 'TotalMarks', 'AssignedStudents', 'AttemptedStudents', 'SubmittedStudents', 'PendingStudents', 'AverageScore', 'CompletionPercentage'];
      }

      await createAuditLog(req.user!.id, 'REPORT_EXPORTED', 'Report', undefined, { type, format });

      switch (format) {
        case 'csv': {
          const csv = await reportService.exportCSV(reportData, headers);
          res.setHeader('Content-Type', 'text/csv');
          res.setHeader('Content-Disposition', `attachment; filename="${type}_report.csv"`);
          return res.send(csv);
        }
        case 'excel': {
          const buffer = await reportService.exportExcel(reportData, headers, `${type} Report`);
          res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
          res.setHeader('Content-Disposition', `attachment; filename="${type}_report.xlsx"`);
          return res.send(buffer);
        }
        case 'pdf': {
          const buffer = await reportService.exportPDF(reportData, headers, `${type} Report`);
          res.setHeader('Content-Type', 'application/pdf');
          res.setHeader('Content-Disposition', `attachment; filename="${type}_report.pdf"`);
          return res.send(buffer);
        }
        default:
          return sendSuccess(res, reportData, 'Report data');
      }
    } catch (error) { next(error); }
  }
}

export const reportController = new ReportController();
