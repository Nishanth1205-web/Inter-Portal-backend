import { Router } from 'express';
import { questionController } from '../controllers/question.controller';
import { authenticate, authorize } from '../middleware';

const router = Router();
router.use(authenticate);

router.post('/generate', authorize('SUPER_ADMIN'), (req, res, next) => questionController.generateQuestions(req, res, next));
router.post('/', authorize('SUPER_ADMIN', 'ADMIN'), (req, res, next) => questionController.createQuestion(req, res, next));
router.get('/', authorize('SUPER_ADMIN', 'ADMIN'), (req, res, next) => questionController.getQuestions(req, res, next));
router.get('/:id', authorize('SUPER_ADMIN', 'ADMIN'), (req, res, next) => questionController.getQuestionById(req, res, next));
router.put('/:id', authorize('SUPER_ADMIN', 'ADMIN'), (req, res, next) => questionController.updateQuestion(req, res, next));
router.delete('/:id', authorize('SUPER_ADMIN'), (req, res, next) => questionController.deleteQuestion(req, res, next));
router.post('/:id/duplicate', authorize('SUPER_ADMIN', 'ADMIN'), (req, res, next) => questionController.duplicateQuestion(req, res, next));

export default router;
