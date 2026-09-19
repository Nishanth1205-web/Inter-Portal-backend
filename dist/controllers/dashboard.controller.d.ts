import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware';
export declare class DashboardController {
    getSuperAdminDashboard(_req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    getAdminDashboard(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    getStudentDashboard(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    getLiveStats(_req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
}
export declare const dashboardController: DashboardController;
//# sourceMappingURL=dashboard.controller.d.ts.map