"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const material_controller_1 = require("../controllers/material.controller");
const middleware_1 = require("../middleware");
const router = (0, express_1.Router)();
router.use(middleware_1.authenticate);
// Admin material management
router.post('/generate', (0, middleware_1.authorize)('SUPER_ADMIN'), (req, res, next) => material_controller_1.materialController.generateMaterial(req, res, next));
router.post('/', (0, middleware_1.authorize)('SUPER_ADMIN', 'ADMIN'), (req, res, next) => material_controller_1.materialController.createMaterial(req, res, next));
router.get('/', (0, middleware_1.authorize)('SUPER_ADMIN', 'ADMIN'), (req, res, next) => material_controller_1.materialController.getMaterials(req, res, next));
router.post('/:id/map', (0, middleware_1.authorize)('SUPER_ADMIN', 'ADMIN'), (req, res, next) => material_controller_1.materialController.mapMaterial(req, res, next));
// Student material access
router.get('/assigned', (0, middleware_1.authorize)('STUDENT'), (req, res, next) => material_controller_1.materialController.getStudentMaterials(req, res, next));
router.get('/my/learning', (0, middleware_1.authorize)('STUDENT'), (req, res, next) => material_controller_1.materialController.getStudentMaterials(req, res, next));
router.get('/assigned/:id', (0, middleware_1.authorize)('STUDENT'), (req, res, next) => material_controller_1.materialController.getStudentMaterialById(req, res, next));
router.get('/my/learning/:id', (0, middleware_1.authorize)('STUDENT'), (req, res, next) => material_controller_1.materialController.getStudentMaterialById(req, res, next));
router.post('/:id/activity', (0, middleware_1.authorize)('STUDENT'), (req, res, next) => material_controller_1.materialController.recordActivity(req, res, next));
// Detail (after specific routes)
router.get('/:id', (0, middleware_1.authorize)('SUPER_ADMIN', 'ADMIN'), (req, res, next) => material_controller_1.materialController.getMaterialById(req, res, next));
router.put('/:id', (0, middleware_1.authorize)('SUPER_ADMIN', 'ADMIN'), (req, res, next) => material_controller_1.materialController.updateMaterial(req, res, next));
router.delete('/:id', (0, middleware_1.authorize)('SUPER_ADMIN'), (req, res, next) => material_controller_1.materialController.deleteMaterial(req, res, next));
exports.default = router;
//# sourceMappingURL=material.routes.js.map