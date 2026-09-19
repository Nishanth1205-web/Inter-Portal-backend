"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.materialController = exports.MaterialController = void 0;
const middleware_1 = require("../middleware");
const services_1 = require("../services");
const utils_1 = require("../utils");
class MaterialController {
    async generateMaterial(req, res, next) {
        try {
            const material = await services_1.materialService.generateMaterial(req.body, req.user.id);
            (0, utils_1.sendCreated)(res, material, 'Material generated successfully');
        }
        catch (error) {
            next(error);
        }
    }
    async createMaterial(req, res, next) {
        try {
            const material = await services_1.materialService.createMaterial(req.body, req.user.id);
            (0, utils_1.sendCreated)(res, material, 'Material created successfully');
        }
        catch (error) {
            next(error);
        }
    }
    async getMaterials(req, res, next) {
        try {
            const { materials, total, page, limit } = await services_1.materialService.getMaterials(req.query);
            (0, utils_1.sendPaginated)(res, materials, total, page, limit);
        }
        catch (error) {
            next(error);
        }
    }
    async getMaterialById(req, res, next) {
        try {
            const material = await services_1.materialService.getMaterialById(req.params.id);
            (0, utils_1.sendSuccess)(res, material);
        }
        catch (error) {
            next(error);
        }
    }
    async updateMaterial(req, res, next) {
        try {
            const material = await services_1.materialService.updateMaterial(req.params.id, req.body, req.user.id);
            (0, utils_1.sendSuccess)(res, material, 'Material updated');
        }
        catch (error) {
            next(error);
        }
    }
    async deleteMaterial(req, res, next) {
        try {
            const result = await services_1.materialService.deleteMaterial(req.params.id, req.user.id);
            (0, utils_1.sendSuccess)(res, result);
        }
        catch (error) {
            next(error);
        }
    }
    async mapMaterial(req, res, next) {
        try {
            const result = await services_1.materialService.mapMaterial(req.params.id, req.body, req.user.id);
            (0, utils_1.sendSuccess)(res, result, 'Material mapped successfully');
        }
        catch (error) {
            next(error);
        }
    }
    // Student endpoints
    async getStudentMaterials(req, res, next) {
        try {
            const studentId = await (0, middleware_1.getStudentId)(req);
            const materials = await services_1.materialService.getStudentMaterials(studentId);
            (0, utils_1.sendSuccess)(res, materials);
        }
        catch (error) {
            next(error);
        }
    }
    async getStudentMaterialById(req, res, next) {
        try {
            const studentId = await (0, middleware_1.getStudentId)(req);
            const material = await services_1.materialService.getStudentMaterialById(req.params.id, studentId);
            (0, utils_1.sendSuccess)(res, material);
        }
        catch (error) {
            next(error);
        }
    }
    async recordActivity(req, res, next) {
        try {
            const studentId = await (0, middleware_1.getStudentId)(req);
            const activity = await services_1.materialService.recordActivity(req.params.id, studentId, req.body);
            (0, utils_1.sendSuccess)(res, activity, 'Activity recorded');
        }
        catch (error) {
            next(error);
        }
    }
}
exports.MaterialController = MaterialController;
exports.materialController = new MaterialController();
//# sourceMappingURL=material.controller.js.map