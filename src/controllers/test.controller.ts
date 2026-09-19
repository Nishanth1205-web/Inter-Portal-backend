import { Response, NextFunction } from 'express';
import { AuthRequest, getStudentId } from '../middleware';
import { testService } from '../services';
import { sendSuccess, sendCreated, sendPaginated } from '../utils';

export class TestController {
  async createTest(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const test = await testService.createTest(req.body, req.user!.id);
      sendCreated(res, test, 'Test created successfully');
    } catch (error) { next(error); }
  }

  async getTests(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { tests, total, page, limit } = await testService.getTests(req.query as any);
      sendPaginated(res, tests, total, page, limit);
    } catch (error) { next(error); }
  }

  async getTestById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const test = await testService.getTestById(req.params.id as string);
      sendSuccess(res, test);
    } catch (error) { next(error); }
  }

  async updateTest(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const test = await testService.updateTest(req.params.id as string, req.body, req.user!.id);
      sendSuccess(res, test, 'Test updated successfully');
    } catch (error) { next(error); }
  }

  async publishTest(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const test = await testService.publishTest(req.params.id as string, req.user!.id);
      sendSuccess(res, test, 'Test published successfully');
    } catch (error) { next(error); }
  }

  async assignTest(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const result = await testService.assignTest(req.params.id as string, req.body, req.user!.id);
      sendSuccess(res, result, 'Test assigned successfully');
    } catch (error) { next(error); }
  }

  async getAssignments(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { assignments, total, page, limit } = await testService.getAssignments(req.query as any);
      sendPaginated(res, assignments, total, page, limit);
    } catch (error) { next(error); }
  }

  // Student endpoints
  async getStudentAssignments(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const studentId = await getStudentId(req);
      const assignments = await testService.getStudentAssignments(studentId);
      sendSuccess(res, assignments);
    } catch (error) { next(error); }
  }

  async startTest(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const studentId = await getStudentId(req);
      const result = await testService.startTest(req.params.id as string, studentId);
      sendSuccess(res, result);
    } catch (error) { next(error); }
  }

  async saveAnswer(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const studentId = await getStudentId(req);
      const answer = await testService.saveAnswer(req.params.id as string, studentId, req.body);
      sendSuccess(res, answer, 'Answer saved');
    } catch (error) { next(error); }
  }

  async submitTest(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const studentId = await getStudentId(req);
      const result = await testService.submitTest(req.params.id as string, studentId);
      sendSuccess(res, result, 'Test submitted successfully');
    } catch (error) { next(error); }
  }

  async getTestResult(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      let studentId: string | undefined;
      if (req.user!.role === 'STUDENT') {
        studentId = await getStudentId(req);
      }
      const result = await testService.getTestResult(req.params.id as string, studentId);
      sendSuccess(res, result);
    } catch (error) { next(error); }
  }

  async evaluateAnswer(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const result = await testService.evaluateAnswer(req.params.id as string, req.body, req.user!.id);
      sendSuccess(res, result);
    } catch (error) { next(error); }
  }
}

export const testController = new TestController();
