import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware';
export declare class AuthController {
    login(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    logout(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    refresh(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    forgotPassword(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    resetPassword(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    getProfile(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    impersonate(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    registerStudent(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
}
export declare const authController: AuthController;
//# sourceMappingURL=auth.controller.d.ts.map