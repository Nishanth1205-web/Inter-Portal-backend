"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const middleware_1 = require("../middleware");
const middleware_2 = require("../middleware");
const auth_validator_1 = require("../validators/auth.validator");
const router = (0, express_1.Router)();
router.post('/login', (0, middleware_2.validate)(auth_validator_1.loginSchema), (req, res, next) => auth_controller_1.authController.login(req, res, next));
router.post('/register', (0, middleware_2.validate)(auth_validator_1.registerStudentSchema), (req, res, next) => auth_controller_1.authController.registerStudent(req, res, next));
router.post('/logout', middleware_1.authenticate, (req, res, next) => auth_controller_1.authController.logout(req, res, next));
router.post('/refresh', (0, middleware_2.validate)(auth_validator_1.refreshTokenSchema), (req, res, next) => auth_controller_1.authController.refresh(req, res, next));
router.post('/forgot-password', (0, middleware_2.validate)(auth_validator_1.forgotPasswordSchema), (req, res, next) => auth_controller_1.authController.forgotPassword(req, res, next));
router.post('/reset-password', (0, middleware_2.validate)(auth_validator_1.resetPasswordSchema), (req, res, next) => auth_controller_1.authController.resetPassword(req, res, next));
router.get('/profile', middleware_1.authenticate, (req, res, next) => auth_controller_1.authController.getProfile(req, res, next));
router.post('/impersonate', middleware_1.authenticate, (0, middleware_1.authorize)('SUPER_ADMIN'), (req, res, next) => auth_controller_1.authController.impersonate(req, res, next));
exports.default = router;
//# sourceMappingURL=auth.routes.js.map