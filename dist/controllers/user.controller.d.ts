import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware';
export declare class UserController {
    createUser(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    getUsers(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    getUserById(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    updateUser(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    deleteUser(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    getDepartments(_req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    createDepartment(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    updateDepartment(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    deleteDepartment(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    getBatches(_req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    createBatch(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    updateBatch(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    deleteBatch(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    getSubjects(_req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    createSubject(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    updateSubject(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    getSkills(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    createSkill(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    getTopics(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    createTopic(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
}
export declare const userController: UserController;
//# sourceMappingURL=user.controller.d.ts.map