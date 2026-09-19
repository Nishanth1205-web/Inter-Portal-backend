import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware';
export declare class MaterialController {
    generateMaterial(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    createMaterial(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    getMaterials(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    getMaterialById(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    updateMaterial(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    deleteMaterial(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    mapMaterial(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    getStudentMaterials(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    getStudentMaterialById(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    recordActivity(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
}
export declare const materialController: MaterialController;
//# sourceMappingURL=material.controller.d.ts.map