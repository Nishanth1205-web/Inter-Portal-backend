"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const test_controller_1 = require("../controllers/test.controller");
const middleware_1 = require("../middleware");
const router = (0, express_1.Router)();
router.use(middleware_1.authenticate);
// Admin/SuperAdmin test management
router.post('/', (0, middleware_1.authorize)('SUPER_ADMIN', 'ADMIN'), (req, res, next) => test_controller_1.testController.createTest(req, res, next));
router.get('/', (0, middleware_1.authorize)('SUPER_ADMIN', 'ADMIN'), (req, res, next) => test_controller_1.testController.getTests(req, res, next));
router.get('/assignments', (0, middleware_1.authorize)('SUPER_ADMIN', 'ADMIN'), (req, res, next) => test_controller_1.testController.getAssignments(req, res, next));
router.get('/assignments/all', (0, middleware_1.authorize)('SUPER_ADMIN', 'ADMIN'), (req, res, next) => test_controller_1.testController.getAssignments(req, res, next));
// Student assignments
router.get('/assigned', (0, middleware_1.authorize)('STUDENT'), (req, res, next) => test_controller_1.testController.getStudentAssignments(req, res, next));
router.get('/my/assignments', (0, middleware_1.authorize)('STUDENT'), (req, res, next) => test_controller_1.testController.getStudentAssignments(req, res, next));
// Student assessment interaction
router.post('/start/:id', (0, middleware_1.authorize)('STUDENT'), (req, res, next) => test_controller_1.testController.startTest(req, res, next));
router.post('/:id/start', (0, middleware_1.authorize)('STUDENT'), (req, res, next) => test_controller_1.testController.startTest(req, res, next));
router.put('/answer/:id', (0, middleware_1.authorize)('STUDENT'), (req, res, next) => test_controller_1.testController.saveAnswer(req, res, next));
router.post('/:id/answer', (0, middleware_1.authorize)('STUDENT'), (req, res, next) => test_controller_1.testController.saveAnswer(req, res, next));
router.post('/submit/:id', (0, middleware_1.authorize)('STUDENT'), (req, res, next) => test_controller_1.testController.submitTest(req, res, next));
router.post('/:id/submit', (0, middleware_1.authorize)('STUDENT'), (req, res, next) => test_controller_1.testController.submitTest(req, res, next));
router.get('/result/:id', middleware_1.authenticate, (req, res, next) => test_controller_1.testController.getTestResult(req, res, next));
router.get('/:id/result', middleware_1.authenticate, (req, res, next) => test_controller_1.testController.getTestResult(req, res, next));
// Evaluation
router.post('/evaluate/:id', (0, middleware_1.authorize)('SUPER_ADMIN', 'ADMIN'), (req, res, next) => test_controller_1.testController.evaluateAnswer(req, res, next));
// Test detail & lifecycle (must be after specific routes)
router.get('/:id', (0, middleware_1.authorize)('SUPER_ADMIN', 'ADMIN'), (req, res, next) => test_controller_1.testController.getTestById(req, res, next));
router.put('/:id', (0, middleware_1.authorize)('SUPER_ADMIN', 'ADMIN'), (req, res, next) => test_controller_1.testController.updateTest(req, res, next));
router.post('/:id/publish', (0, middleware_1.authorize)('SUPER_ADMIN', 'ADMIN'), (req, res, next) => test_controller_1.testController.publishTest(req, res, next));
router.post('/:id/assign', (0, middleware_1.authorize)('SUPER_ADMIN', 'ADMIN'), (req, res, next) => test_controller_1.testController.assignTest(req, res, next));
exports.default = router;
//# sourceMappingURL=test.routes.js.map