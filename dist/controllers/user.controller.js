"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userController = exports.UserController = void 0;
const services_1 = require("../services");
const utils_1 = require("../utils");
class UserController {
    async createUser(req, res, next) {
        try {
            const user = await services_1.userService.createUser(req.body, req.user.id);
            (0, utils_1.sendCreated)(res, user, 'User created successfully');
        }
        catch (error) {
            next(error);
        }
    }
    async getUsers(req, res, next) {
        try {
            const { users, total, page, limit } = await services_1.userService.getUsers(req.query);
            (0, utils_1.sendPaginated)(res, users, total, page, limit);
        }
        catch (error) {
            next(error);
        }
    }
    async getUserById(req, res, next) {
        try {
            const user = await services_1.userService.getUserById(req.params.id);
            (0, utils_1.sendSuccess)(res, user);
        }
        catch (error) {
            next(error);
        }
    }
    async updateUser(req, res, next) {
        try {
            const user = await services_1.userService.updateUser(req.params.id, req.body, req.user.id);
            (0, utils_1.sendSuccess)(res, user, 'User updated successfully');
        }
        catch (error) {
            next(error);
        }
    }
    async deleteUser(req, res, next) {
        try {
            const result = await services_1.userService.deleteUser(req.params.id, req.user.id);
            (0, utils_1.sendSuccess)(res, result);
        }
        catch (error) {
            next(error);
        }
    }
    // Departments
    async getDepartments(_req, res, next) {
        try {
            (0, utils_1.sendSuccess)(res, await services_1.userService.getDepartments());
        }
        catch (error) {
            next(error);
        }
    }
    async createDepartment(req, res, next) {
        try {
            (0, utils_1.sendCreated)(res, await services_1.userService.createDepartment(req.body));
        }
        catch (error) {
            next(error);
        }
    }
    async updateDepartment(req, res, next) {
        try {
            (0, utils_1.sendSuccess)(res, await services_1.userService.updateDepartment(req.params.id, req.body));
        }
        catch (error) {
            next(error);
        }
    }
    async deleteDepartment(req, res, next) {
        try {
            (0, utils_1.sendSuccess)(res, await services_1.userService.deleteDepartment(req.params.id));
        }
        catch (error) {
            next(error);
        }
    }
    // Batches
    async getBatches(_req, res, next) {
        try {
            (0, utils_1.sendSuccess)(res, await services_1.userService.getBatches());
        }
        catch (error) {
            next(error);
        }
    }
    async createBatch(req, res, next) {
        try {
            (0, utils_1.sendCreated)(res, await services_1.userService.createBatch(req.body));
        }
        catch (error) {
            next(error);
        }
    }
    async updateBatch(req, res, next) {
        try {
            (0, utils_1.sendSuccess)(res, await services_1.userService.updateBatch(req.params.id, req.body));
        }
        catch (error) {
            next(error);
        }
    }
    async deleteBatch(req, res, next) {
        try {
            (0, utils_1.sendSuccess)(res, await services_1.userService.deleteBatch(req.params.id));
        }
        catch (error) {
            next(error);
        }
    }
    // Subjects
    async getSubjects(_req, res, next) {
        try {
            (0, utils_1.sendSuccess)(res, await services_1.userService.getSubjects());
        }
        catch (error) {
            next(error);
        }
    }
    async createSubject(req, res, next) {
        try {
            (0, utils_1.sendCreated)(res, await services_1.userService.createSubject(req.body));
        }
        catch (error) {
            next(error);
        }
    }
    async updateSubject(req, res, next) {
        try {
            (0, utils_1.sendSuccess)(res, await services_1.userService.updateSubject(req.params.id, req.body));
        }
        catch (error) {
            next(error);
        }
    }
    // Skills
    async getSkills(req, res, next) {
        try {
            (0, utils_1.sendSuccess)(res, await services_1.userService.getSkills(req.query.subjectId));
        }
        catch (error) {
            next(error);
        }
    }
    async createSkill(req, res, next) {
        try {
            (0, utils_1.sendCreated)(res, await services_1.userService.createSkill(req.body));
        }
        catch (error) {
            next(error);
        }
    }
    // Topics
    async getTopics(req, res, next) {
        try {
            (0, utils_1.sendSuccess)(res, await services_1.userService.getTopics(req.query.skillId));
        }
        catch (error) {
            next(error);
        }
    }
    async createTopic(req, res, next) {
        try {
            (0, utils_1.sendCreated)(res, await services_1.userService.createTopic(req.body));
        }
        catch (error) {
            next(error);
        }
    }
}
exports.UserController = UserController;
exports.userController = new UserController();
//# sourceMappingURL=user.controller.js.map