"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const middleware_1 = require("../middleware");
const router = (0, express_1.Router)();
// All user routes require authentication
router.use(middleware_1.authenticate);
// Users CRUD (Super Admin only)
router.post('/', (0, middleware_1.authorize)('SUPER_ADMIN'), (req, res, next) => user_controller_1.userController.createUser(req, res, next));
router.get('/', (0, middleware_1.authorize)('SUPER_ADMIN', 'ADMIN'), (req, res, next) => user_controller_1.userController.getUsers(req, res, next));
router.get('/:id', (0, middleware_1.authorize)('SUPER_ADMIN', 'ADMIN'), (req, res, next) => user_controller_1.userController.getUserById(req, res, next));
router.put('/:id', (0, middleware_1.authorize)('SUPER_ADMIN'), (req, res, next) => user_controller_1.userController.updateUser(req, res, next));
router.delete('/:id', (0, middleware_1.authorize)('SUPER_ADMIN'), (req, res, next) => user_controller_1.userController.deleteUser(req, res, next));
exports.default = router;
//# sourceMappingURL=user.routes.js.map