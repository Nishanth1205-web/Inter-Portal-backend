import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware';
export declare class QuestionController {
    createQuestion(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    generateQuestions(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    getQuestions(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    getQuestionById(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    updateQuestion(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    deleteQuestion(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    duplicateQuestion(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
}
export declare const questionController: QuestionController;
//# sourceMappingURL=question.controller.d.ts.map