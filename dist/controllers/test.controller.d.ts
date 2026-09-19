import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware';
export declare class TestController {
    createTest(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    getTests(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    getTestById(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    updateTest(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    publishTest(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    assignTest(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    getAssignments(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    getStudentAssignments(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    startTest(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    saveAnswer(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    submitTest(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    getTestResult(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    evaluateAnswer(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
}
export declare const testController: TestController;
//# sourceMappingURL=test.controller.d.ts.map