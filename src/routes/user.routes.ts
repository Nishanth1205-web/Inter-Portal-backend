import { Router } from 'express';
import { userController } from '../controllers/user.controller';
import { authenticate, authorize } from '../middleware';

const router = Router();

// All user routes require authentication
router.use(authenticate);

// Users CRUD (Super Admin only)
router.post('/', authorize('SUPER_ADMIN'), (req, res, next) => userController.createUser(req, res, next));
router.get('/', authorize('SUPER_ADMIN', 'ADMIN'), (req, res, next) => userController.getUsers(req, res, next));
router.get('/:id', authorize('SUPER_ADMIN', 'ADMIN'), (req, res, next) => userController.getUserById(req, res, next));
router.put('/:id', authorize('SUPER_ADMIN'), (req, res, next) => userController.updateUser(req, res, next));
router.delete('/:id', authorize('SUPER_ADMIN'), (req, res, next) => userController.deleteUser(req, res, next));

export default router;
