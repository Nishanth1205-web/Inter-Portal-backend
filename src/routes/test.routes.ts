import { Router } from 'express';
import { testController } from '../controllers/test.controller';
import { authenticate, authorize } from '../middleware';

const router = Router();
router.use(authenticate);

// Admin/SuperAdmin test management
router.post('/', authorize('SUPER_ADMIN', 'ADMIN'), (req, res, next) => testController.createTest(req, res, next));
router.get('/', authorize('SUPER_ADMIN', 'ADMIN'), (req, res, next) => testController.getTests(req, res, next));
router.get('/assignments', authorize('SUPER_ADMIN', 'ADMIN'), (req, res, next) => testController.getAssignments(req, res, next));
router.get('/assignments/all', authorize('SUPER_ADMIN', 'ADMIN'), (req, res, next) => testController.getAssignments(req, res, next));

// Student assignments
router.get('/assigned', authorize('STUDENT'), (req, res, next) => testController.getStudentAssignments(req, res, next));
router.get('/my/assignments', authorize('STUDENT'), (req, res, next) => testController.getStudentAssignments(req, res, next));

// Student assessment interaction
router.post('/start/:id', authorize('STUDENT'), (req, res, next) => testController.startTest(req, res, next));
router.post('/:id/start', authorize('STUDENT'), (req, res, next) => testController.startTest(req, res, next));

router.put('/answer/:id', authorize('STUDENT'), (req, res, next) => testController.saveAnswer(req, res, next));
router.post('/:id/answer', authorize('STUDENT'), (req, res, next) => testController.saveAnswer(req, res, next));

router.post('/submit/:id', authorize('STUDENT'), (req, res, next) => testController.submitTest(req, res, next));
router.post('/:id/submit', authorize('STUDENT'), (req, res, next) => testController.submitTest(req, res, next));

router.get('/result/:id', authenticate, (req, res, next) => testController.getTestResult(req, res, next));
router.get('/:id/result', authenticate, (req, res, next) => testController.getTestResult(req, res, next));

// Evaluation
router.post('/evaluate/:id', authorize('SUPER_ADMIN', 'ADMIN'), (req, res, next) => testController.evaluateAnswer(req, res, next));

// Test detail & lifecycle (must be after specific routes)
router.get('/:id', authorize('SUPER_ADMIN', 'ADMIN'), (req, res, next) => testController.getTestById(req, res, next));
router.put('/:id', authorize('SUPER_ADMIN', 'ADMIN'), (req, res, next) => testController.updateTest(req, res, next));
router.post('/:id/publish', authorize('SUPER_ADMIN', 'ADMIN'), (req, res, next) => testController.publishTest(req, res, next));
router.post('/:id/assign', authorize('SUPER_ADMIN', 'ADMIN'), (req, res, next) => testController.assignTest(req, res, next));

export default router;
