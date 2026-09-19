"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const question_controller_1 = require("../controllers/question.controller");
const middleware_1 = require("../middleware");
const router = (0, express_1.Router)();
router.use(middleware_1.authenticate);
router.post('/generate', (0, middleware_1.authorize)('SUPER_ADMIN'), (req, res, next) => question_controller_1.questionController.generateQuestions(req, res, next));
router.post('/', (0, middleware_1.authorize)('SUPER_ADMIN', 'ADMIN'), (req, res, next) => question_controller_1.questionController.createQuestion(req, res, next));
router.get('/', (0, middleware_1.authorize)('SUPER_ADMIN', 'ADMIN'), (req, res, next) => question_controller_1.questionController.getQuestions(req, res, next));
router.get('/:id', (0, middleware_1.authorize)('SUPER_ADMIN', 'ADMIN'), (req, res, next) => question_controller_1.questionController.getQuestionById(req, res, next));
router.put('/:id', (0, middleware_1.authorize)('SUPER_ADMIN', 'ADMIN'), (req, res, next) => question_controller_1.questionController.updateQuestion(req, res, next));
router.delete('/:id', (0, middleware_1.authorize)('SUPER_ADMIN'), (req, res, next) => question_controller_1.questionController.deleteQuestion(req, res, next));
router.post('/:id/duplicate', (0, middleware_1.authorize)('SUPER_ADMIN', 'ADMIN'), (req, res, next) => question_controller_1.questionController.duplicateQuestion(req, res, next));
exports.default = router;
//# sourceMappingURL=question.routes.js.map