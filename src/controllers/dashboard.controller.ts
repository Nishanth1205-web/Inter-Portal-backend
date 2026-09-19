import { Response, NextFunction } from 'express';
import { AuthRequest, getStudentId } from '../middleware';
import { dashboardService } from '../services';
import { sendSuccess } from '../utils';

export class DashboardController {
  async getSuperAdminDashboard(_req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = await dashboardService.getSuperAdminDashboard();
      sendSuccess(res, data);
    } catch (error) { next(error); }
  }

  async getAdminDashboard(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = await dashboardService.getAdminDashboard(req.user!.id);
      sendSuccess(res, data);
    } catch (error) { next(error); }
  }

  async getStudentDashboard(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const studentId = await getStudentId(req);
      const data = await dashboardService.getStudentDashboard(studentId);
      sendSuccess(res, data);
    } catch (error) { next(error); }
  }

  async getLiveStats(_req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = await dashboardService.getLiveStats();
      sendSuccess(res, data);
    } catch (error) { next(error); }
  }
}

export const dashboardController = new DashboardController();
