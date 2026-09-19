import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware';
export declare class ReportController {
    getStudentReport(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    getTestReport(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    exportReport(req: AuthRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
}
export declare const reportController: ReportController;
//# sourceMappingURL=report.controller.d.ts.map