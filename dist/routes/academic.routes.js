"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const middleware_1 = require("../middleware");
const router = (0, express_1.Router)();
// Public routes for registration
router.get('/departments', (req, res, next) => user_controller_1.userController.getDepartments(req, res, next));
router.get('/batches', (req, res, next) => user_controller_1.userController.getBatches(req, res, next));
router.use(middleware_1.authenticate);
// Departments (Protected)
router.post('/departments', (0, middleware_1.authorize)('SUPER_ADMIN'), (req, res, next) => user_controller_1.userController.createDepartment(req, res, next));
router.put('/departments/:id', (0, middleware_1.authorize)('SUPER_ADMIN'), (req, res, next) => user_controller_1.userController.updateDepartment(req, res, next));
router.delete('/departments/:id', (0, middleware_1.authorize)('SUPER_ADMIN'), (req, res, next) => user_controller_1.userController.deleteDepartment(req, res, next));
// Batches (Protected)
router.post('/batches', (0, middleware_1.authorize)('SUPER_ADMIN'), (req, res, next) => user_controller_1.userController.createBatch(req, res, next));
router.put('/batches/:id', (0, middleware_1.authorize)('SUPER_ADMIN'), (req, res, next) => user_controller_1.userController.updateBatch(req, res, next));
router.delete('/batches/:id', (0, middleware_1.authorize)('SUPER_ADMIN'), (req, res, next) => user_controller_1.userController.deleteBatch(req, res, next));
// Subjects
router.get('/subjects', (req, res, next) => user_controller_1.userController.getSubjects(req, res, next));
router.post('/subjects', (0, middleware_1.authorize)('SUPER_ADMIN'), (req, res, next) => user_controller_1.userController.createSubject(req, res, next));
router.put('/subjects/:id', (0, middleware_1.authorize)('SUPER_ADMIN'), (req, res, next) => user_controller_1.userController.updateSubject(req, res, next));
// Skills
router.get('/skills', (req, res, next) => user_controller_1.userController.getSkills(req, res, next));
router.post('/skills', (0, middleware_1.authorize)('SUPER_ADMIN'), (req, res, next) => user_controller_1.userController.createSkill(req, res, next));
// Topics
router.get('/topics', (req, res, next) => user_controller_1.userController.getTopics(req, res, next));
router.post('/topics', (0, middleware_1.authorize)('SUPER_ADMIN'), (req, res, next) => user_controller_1.userController.createTopic(req, res, next));
exports.default = router;
//# sourceMappingURL=academic.routes.js.map