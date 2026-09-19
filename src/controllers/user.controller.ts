import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware';
import { userService } from '../services';
import { sendSuccess, sendCreated, sendPaginated } from '../utils';

export class UserController {
  async createUser(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const user = await userService.createUser(req.body, req.user!.id);
      sendCreated(res, user, 'User created successfully');
    } catch (error) { next(error); }
  }

  async getUsers(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { users, total, page, limit } = await userService.getUsers(req.query as any);
      sendPaginated(res, users, total, page, limit);
    } catch (error) { next(error); }
  }

  async getUserById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const user = await userService.getUserById(req.params.id as string);
      sendSuccess(res, user);
    } catch (error) { next(error); }
  }

  async updateUser(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const user = await userService.updateUser(req.params.id as string, req.body, req.user!.id);
      sendSuccess(res, user, 'User updated successfully');
    } catch (error) { next(error); }
  }

  async deleteUser(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const result = await userService.deleteUser(req.params.id as string, req.user!.id);
      sendSuccess(res, result);
    } catch (error) { next(error); }
  }

  // Departments
  async getDepartments(_req: AuthRequest, res: Response, next: NextFunction) {
    try { sendSuccess(res, await userService.getDepartments()); } catch (error) { next(error); }
  }
  async createDepartment(req: AuthRequest, res: Response, next: NextFunction) {
    try { sendCreated(res, await userService.createDepartment(req.body)); } catch (error) { next(error); }
  }
  async updateDepartment(req: AuthRequest, res: Response, next: NextFunction) {
    try { sendSuccess(res, await userService.updateDepartment(req.params.id as string, req.body)); } catch (error) { next(error); }
  }
  async deleteDepartment(req: AuthRequest, res: Response, next: NextFunction) {
    try { sendSuccess(res, await userService.deleteDepartment(req.params.id as string)); } catch (error) { next(error); }
  }

  // Batches
  async getBatches(_req: AuthRequest, res: Response, next: NextFunction) {
    try { sendSuccess(res, await userService.getBatches()); } catch (error) { next(error); }
  }
  async createBatch(req: AuthRequest, res: Response, next: NextFunction) {
    try { sendCreated(res, await userService.createBatch(req.body)); } catch (error) { next(error); }
  }
  async updateBatch(req: AuthRequest, res: Response, next: NextFunction) {
    try { sendSuccess(res, await userService.updateBatch(req.params.id as string, req.body)); } catch (error) { next(error); }
  }
  async deleteBatch(req: AuthRequest, res: Response, next: NextFunction) {
    try { sendSuccess(res, await userService.deleteBatch(req.params.id as string)); } catch (error) { next(error); }
  }

  // Subjects
  async getSubjects(_req: AuthRequest, res: Response, next: NextFunction) {
    try { sendSuccess(res, await userService.getSubjects()); } catch (error) { next(error); }
  }
  async createSubject(req: AuthRequest, res: Response, next: NextFunction) {
    try { sendCreated(res, await userService.createSubject(req.body)); } catch (error) { next(error); }
  }
  async updateSubject(req: AuthRequest, res: Response, next: NextFunction) {
    try { sendSuccess(res, await userService.updateSubject(req.params.id as string, req.body)); } catch (error) { next(error); }
  }

  // Skills
  async getSkills(req: AuthRequest, res: Response, next: NextFunction) {
    try { sendSuccess(res, await userService.getSkills(req.query.subjectId as string)); } catch (error) { next(error); }
  }
  async createSkill(req: AuthRequest, res: Response, next: NextFunction) {
    try { sendCreated(res, await userService.createSkill(req.body)); } catch (error) { next(error); }
  }

  // Topics
  async getTopics(req: AuthRequest, res: Response, next: NextFunction) {
    try { sendSuccess(res, await userService.getTopics(req.query.skillId as string)); } catch (error) { next(error); }
  }
  async createTopic(req: AuthRequest, res: Response, next: NextFunction) {
    try { sendCreated(res, await userService.createTopic(req.body)); } catch (error) { next(error); }
  }
}

export const userController = new UserController();
