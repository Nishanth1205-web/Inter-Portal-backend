import { Response, NextFunction } from 'express';
import { AuthRequest, getStudentId } from '../middleware';
import { questionService } from '../services';
import { createAIQuestionGenerator } from '../providers';
import { env } from '../config';
import { sendSuccess, sendCreated, sendPaginated } from '../utils';

export class QuestionController {
  async createQuestion(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const question = await questionService.createQuestion(req.body, req.user!.id);
      sendCreated(res, question, 'Question created successfully');
    } catch (error) { next(error); }
  }

  async generateQuestions(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const generator = createAIQuestionGenerator(env.AI_PROVIDER);
      const generated = await generator.generate(req.body);
      sendSuccess(res, generated, 'Questions generated successfully');
    } catch (error) { next(error); }
  }

  async getQuestions(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { questions, total, page, limit } = await questionService.getQuestions(req.query as any);
      sendPaginated(res, questions, total, page, limit);
    } catch (error) { next(error); }
  }

  async getQuestionById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const question = await questionService.getQuestionById(req.params.id as string);
      sendSuccess(res, question);
    } catch (error) { next(error); }
  }

  async updateQuestion(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const question = await questionService.updateQuestion(req.params.id as string, req.body, req.user!.id);
      sendSuccess(res, question, 'Question updated successfully');
    } catch (error) { next(error); }
  }

  async deleteQuestion(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const result = await questionService.deleteQuestion(req.params.id as string, req.user!.id);
      sendSuccess(res, result);
    } catch (error) { next(error); }
  }

  async duplicateQuestion(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const question = await questionService.duplicateQuestion(req.params.id as string, req.user!.id);
      sendCreated(res, question, 'Question duplicated successfully');
    } catch (error) { next(error); }
  }
}

export const questionController = new QuestionController();
