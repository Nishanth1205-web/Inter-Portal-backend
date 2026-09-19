import { Router } from 'express';
import { materialController } from '../controllers/material.controller';
import { authenticate, authorize } from '../middleware';

const router = Router();
router.use(authenticate);

// Admin material management
router.post('/generate', authorize('SUPER_ADMIN'), (req, res, next) => materialController.generateMaterial(req, res, next));
router.post('/', authorize('SUPER_ADMIN', 'ADMIN'), (req, res, next) => materialController.createMaterial(req, res, next));
router.get('/', authorize('SUPER_ADMIN', 'ADMIN'), (req, res, next) => materialController.getMaterials(req, res, next));
router.post('/:id/map', authorize('SUPER_ADMIN', 'ADMIN'), (req, res, next) => materialController.mapMaterial(req, res, next));

// Student material access
router.get('/assigned', authorize('STUDENT'), (req, res, next) => materialController.getStudentMaterials(req, res, next));
router.get('/my/learning', authorize('STUDENT'), (req, res, next) => materialController.getStudentMaterials(req, res, next));
router.get('/assigned/:id', authorize('STUDENT'), (req, res, next) => materialController.getStudentMaterialById(req, res, next));
router.get('/my/learning/:id', authorize('STUDENT'), (req, res, next) => materialController.getStudentMaterialById(req, res, next));
router.post('/:id/activity', authorize('STUDENT'), (req, res, next) => materialController.recordActivity(req, res, next));

// Detail (after specific routes)
router.get('/:id', authorize('SUPER_ADMIN', 'ADMIN'), (req, res, next) => materialController.getMaterialById(req, res, next));
router.put('/:id', authorize('SUPER_ADMIN', 'ADMIN'), (req, res, next) => materialController.updateMaterial(req, res, next));
router.delete('/:id', authorize('SUPER_ADMIN'), (req, res, next) => materialController.deleteMaterial(req, res, next));

export default router;
