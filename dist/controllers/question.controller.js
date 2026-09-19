"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.questionController = exports.QuestionController = void 0;
const services_1 = require("../services");
const providers_1 = require("../providers");
const config_1 = require("../config");
const utils_1 = require("../utils");
class QuestionController {
    async createQuestion(req, res, next) {
        try {
            const question = await services_1.questionService.createQuestion(req.body, req.user.id);
            (0, utils_1.sendCreated)(res, question, 'Question created successfully');
        }
        catch (error) {
            next(error);
        }
    }
    async generateQuestions(req, res, next) {
        try {
            const generator = (0, providers_1.createAIQuestionGenerator)(config_1.env.AI_PROVIDER);
            const generated = await generator.generate(req.body);
            (0, utils_1.sendSuccess)(res, generated, 'Questions generated successfully');
        }
        catch (error) {
            next(error);
        }
    }
    async getQuestions(req, res, next) {
        try {
            const { questions, total, page, limit } = await services_1.questionService.getQuestions(req.query);
            (0, utils_1.sendPaginated)(res, questions, total, page, limit);
        }
        catch (error) {
            next(error);
        }
    }
    async getQuestionById(req, res, next) {
        try {
            const question = await services_1.questionService.getQuestionById(req.params.id);
            (0, utils_1.sendSuccess)(res, question);
        }
        catch (error) {
            next(error);
        }
    }
    async updateQuestion(req, res, next) {
        try {
            const question = await services_1.questionService.updateQuestion(req.params.id, req.body, req.user.id);
            (0, utils_1.sendSuccess)(res, question, 'Question updated successfully');
        }
        catch (error) {
            next(error);
        }
    }
    async deleteQuestion(req, res, next) {
        try {
            const result = await services_1.questionService.deleteQuestion(req.params.id, req.user.id);
            (0, utils_1.sendSuccess)(res, result);
        }
        catch (error) {
            next(error);
        }
    }
    async duplicateQuestion(req, res, next) {
        try {
            const question = await services_1.questionService.duplicateQuestion(req.params.id, req.user.id);
            (0, utils_1.sendCreated)(res, question, 'Question duplicated successfully');
        }
        catch (error) {
            next(error);
        }
    }
}
exports.QuestionController = QuestionController;
exports.questionController = new QuestionController();
//# sourceMappingURL=question.controller.js.map