import { Router } from 'express';
import { userController } from '../controllers/user.controller';
import { authenticate, authorize } from '../middleware';

const router = Router();

// Public routes for registration
router.get('/departments', (req, res, next) => userController.getDepartments(req, res, next));
router.get('/batches', (req, res, next) => userController.getBatches(req, res, next));

router.use(authenticate);

// Departments (Protected)
router.post('/departments', authorize('SUPER_ADMIN'), (req, res, next) => userController.createDepartment(req, res, next));
router.put('/departments/:id', authorize('SUPER_ADMIN'), (req, res, next) => userController.updateDepartment(req, res, next));
router.delete('/departments/:id', authorize('SUPER_ADMIN'), (req, res, next) => userController.deleteDepartment(req, res, next));

// Batches (Protected)
router.post('/batches', authorize('SUPER_ADMIN'), (req, res, next) => userController.createBatch(req, res, next));
router.put('/batches/:id', authorize('SUPER_ADMIN'), (req, res, next) => userController.updateBatch(req, res, next));
router.delete('/batches/:id', authorize('SUPER_ADMIN'), (req, res, next) => userController.deleteBatch(req, res, next));

// Subjects
router.get('/subjects', (req, res, next) => userController.getSubjects(req, res, next));
router.post('/subjects', authorize('SUPER_ADMIN'), (req, res, next) => userController.createSubject(req, res, next));
router.put('/subjects/:id', authorize('SUPER_ADMIN'), (req, res, next) => userController.updateSubject(req, res, next));

// Skills
router.get('/skills', (req, res, next) => userController.getSkills(req, res, next));
router.post('/skills', authorize('SUPER_ADMIN'), (req, res, next) => userController.createSkill(req, res, next));

// Topics
router.get('/topics', (req, res, next) => userController.getTopics(req, res, next));
router.post('/topics', authorize('SUPER_ADMIN'), (req, res, next) => userController.createTopic(req, res, next));

export default router;
