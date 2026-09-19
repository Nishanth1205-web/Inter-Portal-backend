import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { authenticate, authorize } from '../middleware';
import { validate } from '../middleware';
import { loginSchema, refreshTokenSchema, forgotPasswordSchema, resetPasswordSchema, registerStudentSchema } from '../validators/auth.validator';

const router = Router();

router.post('/login', validate(loginSchema), (req, res, next) => authController.login(req, res, next));
router.post('/register', validate(registerStudentSchema), (req, res, next) => authController.registerStudent(req, res, next));
router.post('/logout', authenticate, (req, res, next) => authController.logout(req, res, next));
router.post('/refresh', validate(refreshTokenSchema), (req, res, next) => authController.refresh(req, res, next));
router.post('/forgot-password', validate(forgotPasswordSchema), (req, res, next) => authController.forgotPassword(req, res, next));
router.post('/reset-password', validate(resetPasswordSchema), (req, res, next) => authController.resetPassword(req, res, next));
router.get('/profile', authenticate, (req, res, next) => authController.getProfile(req, res, next));
router.post('/impersonate', authenticate, authorize('SUPER_ADMIN'), (req, res, next) => authController.impersonate(req, res, next));

export default router;
