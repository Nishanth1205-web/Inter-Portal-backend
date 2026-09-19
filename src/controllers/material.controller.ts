import { Response, NextFunction } from 'express';
import { AuthRequest, getStudentId } from '../middleware';
import { materialService } from '../services';
import { sendSuccess, sendCreated, sendPaginated } from '../utils';

export class MaterialController {
  async generateMaterial(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const material = await materialService.generateMaterial(req.body, req.user!.id);
      sendCreated(res, material, 'Material generated successfully');
    } catch (error) { next(error); }
  }

  async createMaterial(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const material = await materialService.createMaterial(req.body, req.user!.id);
      sendCreated(res, material, 'Material created successfully');
    } catch (error) { next(error); }
  }

  async getMaterials(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { materials, total, page, limit } = await materialService.getMaterials(req.query as any);
      sendPaginated(res, materials, total, page, limit);
    } catch (error) { next(error); }
  }

  async getMaterialById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const material = await materialService.getMaterialById(req.params.id as string);
      sendSuccess(res, material);
    } catch (error) { next(error); }
  }

  async updateMaterial(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const material = await materialService.updateMaterial(req.params.id as string, req.body, req.user!.id);
      sendSuccess(res, material, 'Material updated');
    } catch (error) { next(error); }
  }

  async deleteMaterial(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const result = await materialService.deleteMaterial(req.params.id as string, req.user!.id);
      sendSuccess(res, result);
    } catch (error) { next(error); }
  }

  async mapMaterial(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const result = await materialService.mapMaterial(req.params.id as string, req.body, req.user!.id);
      sendSuccess(res, result, 'Material mapped successfully');
    } catch (error) { next(error); }
  }

  // Student endpoints
  async getStudentMaterials(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const studentId = await getStudentId(req);
      const materials = await materialService.getStudentMaterials(studentId);
      sendSuccess(res, materials);
    } catch (error) { next(error); }
  }

  async getStudentMaterialById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const studentId = await getStudentId(req);
      const material = await materialService.getStudentMaterialById(req.params.id as string, studentId);
      sendSuccess(res, material);
    } catch (error) { next(error); }
  }

  async recordActivity(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const studentId = await getStudentId(req);
      const activity = await materialService.recordActivity(req.params.id as string, studentId, req.body);
      sendSuccess(res, activity, 'Activity recorded');
    } catch (error) { next(error); }
  }
}

export const materialController = new MaterialController();
