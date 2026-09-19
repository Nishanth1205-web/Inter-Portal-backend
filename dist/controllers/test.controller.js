"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testController = exports.TestController = void 0;
const middleware_1 = require("../middleware");
const services_1 = require("../services");
const utils_1 = require("../utils");
class TestController {
    async createTest(req, res, next) {
        try {
            const test = await services_1.testService.createTest(req.body, req.user.id);
            (0, utils_1.sendCreated)(res, test, 'Test created successfully');
        }
        catch (error) {
            next(error);
        }
    }
    async getTests(req, res, next) {
        try {
            const { tests, total, page, limit } = await services_1.testService.getTests(req.query);
            (0, utils_1.sendPaginated)(res, tests, total, page, limit);
        }
        catch (error) {
            next(error);
        }
    }
    async getTestById(req, res, next) {
        try {
            const test = await services_1.testService.getTestById(req.params.id);
            (0, utils_1.sendSuccess)(res, test);
        }
        catch (error) {
            next(error);
        }
    }
    async updateTest(req, res, next) {
        try {
            const test = await services_1.testService.updateTest(req.params.id, req.body, req.user.id);
            (0, utils_1.sendSuccess)(res, test, 'Test updated successfully');
        }
        catch (error) {
            next(error);
        }
    }
    async publishTest(req, res, next) {
        try {
            const test = await services_1.testService.publishTest(req.params.id, req.user.id);
            (0, utils_1.sendSuccess)(res, test, 'Test published successfully');
        }
        catch (error) {
            next(error);
        }
    }
    async assignTest(req, res, next) {
        try {
            const result = await services_1.testService.assignTest(req.params.id, req.body, req.user.id);
            (0, utils_1.sendSuccess)(res, result, 'Test assigned successfully');
        }
        catch (error) {
            next(error);
        }
    }
    async getAssignments(req, res, next) {
        try {
            const { assignments, total, page, limit } = await services_1.testService.getAssignments(req.query);
            (0, utils_1.sendPaginated)(res, assignments, total, page, limit);
        }
        catch (error) {
            next(error);
        }
    }
    // Student endpoints
    async getStudentAssignments(req, res, next) {
        try {
            const studentId = await (0, middleware_1.getStudentId)(req);
            const assignments = await services_1.testService.getStudentAssignments(studentId);
            (0, utils_1.sendSuccess)(res, assignments);
        }
        catch (error) {
            next(error);
        }
    }
    async startTest(req, res, next) {
        try {
            const studentId = await (0, middleware_1.getStudentId)(req);
            const result = await services_1.testService.startTest(req.params.id, studentId);
            (0, utils_1.sendSuccess)(res, result);
        }
        catch (error) {
            next(error);
        }
    }
    async saveAnswer(req, res, next) {
        try {
            const studentId = await (0, middleware_1.getStudentId)(req);
            const answer = await services_1.testService.saveAnswer(req.params.id, studentId, req.body);
            (0, utils_1.sendSuccess)(res, answer, 'Answer saved');
        }
        catch (error) {
            next(error);
        }
    }
    async submitTest(req, res, next) {
        try {
            const studentId = await (0, middleware_1.getStudentId)(req);
            const result = await services_1.testService.submitTest(req.params.id, studentId);
            (0, utils_1.sendSuccess)(res, result, 'Test submitted successfully');
        }
        catch (error) {
            next(error);
        }
    }
    async getTestResult(req, res, next) {
        try {
            let studentId;
            if (req.user.role === 'STUDENT') {
                studentId = await (0, middleware_1.getStudentId)(req);
            }
            const result = await services_1.testService.getTestResult(req.params.id, studentId);
            (0, utils_1.sendSuccess)(res, result);
        }
        catch (error) {
            next(error);
        }
    }
    async evaluateAnswer(req, res, next) {
        try {
            const result = await services_1.testService.evaluateAnswer(req.params.id, req.body, req.user.id);
            (0, utils_1.sendSuccess)(res, result);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.TestController = TestController;
exports.testController = new TestController();
//# sourceMappingURL=test.controller.js.map