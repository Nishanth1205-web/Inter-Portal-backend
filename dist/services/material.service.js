"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.materialService = exports.MaterialService = void 0;
const config_1 = require("../config");
const config_2 = require("../config");
const utils_1 = require("../utils");
const middleware_1 = require("../middleware");
const providers_1 = require("../providers");
class MaterialService {
    aiGenerator = (0, providers_1.createAIMaterialGenerator)(config_2.env.AI_PROVIDER);
    async generateMaterial(data, createdById) {
        let subjectId = data.subjectId;
        if (!subjectId) {
            const allSubjects = await config_1.prisma.subject.findMany();
            const match = allSubjects.find(s => data.subject.toLowerCase().includes(s.name.toLowerCase()) ||
                s.name.toLowerCase().includes(data.subject.toLowerCase()));
            subjectId = match ? match.id : (allSubjects[0]?.id || '');
        }
        const generated = await this.aiGenerator.generate({
            subject: data.subject,
            skill: data.skill,
            topic: data.topic,
            difficulty: data.difficulty,
            learningObjective: data.learningObjective,
            studentLevel: data.studentLevel,
            type: data.type,
        });
        const material = await config_1.prisma.learningMaterial.create({
            data: {
                title: generated.title,
                description: generated.description,
                type: generated.type,
                content: generated.content,
                metadata: generated.metadata ? (typeof generated.metadata === 'string' ? generated.metadata : JSON.stringify(generated.metadata)) : undefined,
                subjectId,
                skillId: data.skillId,
                topicId: data.topicId,
                isAIGenerated: true,
                createdById,
            },
            include: { subject: true, skill: true, topic: true },
        });
        await (0, middleware_1.createAuditLog)(createdById, 'MATERIAL_GENERATED', 'LearningMaterial', material.id);
        return material;
    }
    async createMaterial(data, createdById) {
        const { metadata, ...rest } = data;
        const material = await config_1.prisma.learningMaterial.create({
            data: {
                ...rest,
                metadata: metadata ? (typeof metadata === 'string' ? metadata : JSON.stringify(metadata)) : undefined,
                createdById,
            },
            include: { subject: true, skill: true, topic: true },
        });
        await (0, middleware_1.createAuditLog)(createdById, 'MATERIAL_CREATED', 'LearningMaterial', material.id);
        return material;
    }
    async getMaterials(params) {
        const { page = 1, limit = 10, search, type, subjectId, skillId, topicId } = params;
        const skip = (page - 1) * limit;
        const where = { isActive: true };
        if (type)
            where.type = type;
        if (subjectId)
            where.subjectId = subjectId;
        if (skillId)
            where.skillId = skillId;
        if (topicId)
            where.topicId = topicId;
        if (search) {
            where.OR = [
                { title: { contains: search } },
                { description: { contains: search } },
            ];
        }
        const [materials, total] = await Promise.all([
            config_1.prisma.learningMaterial.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    subject: true,
                    skill: true,
                    topic: true,
                    createdBy: { select: { firstName: true, lastName: true } },
                    _count: { select: { assignments: true } },
                },
            }),
            config_1.prisma.learningMaterial.count({ where }),
        ]);
        return { materials, total, page, limit };
    }
    async getMaterialById(id) {
        const material = await config_1.prisma.learningMaterial.findUnique({
            where: { id },
            include: {
                subject: true,
                skill: true,
                topic: true,
                createdBy: { select: { firstName: true, lastName: true } },
            },
        });
        if (!material)
            throw new utils_1.NotFoundError('Material not found');
        return material;
    }
    async updateMaterial(id, data, updaterId) {
        const material = await config_1.prisma.learningMaterial.findUnique({ where: { id } });
        if (!material)
            throw new utils_1.NotFoundError('Material not found');
        const updated = await config_1.prisma.learningMaterial.update({
            where: { id },
            data,
            include: { subject: true, skill: true, topic: true },
        });
        await (0, middleware_1.createAuditLog)(updaterId, 'MATERIAL_UPDATED', 'LearningMaterial', id);
        return updated;
    }
    async deleteMaterial(id, deleterId) {
        await config_1.prisma.learningMaterial.update({ where: { id }, data: { isActive: false } });
        await (0, middleware_1.createAuditLog)(deleterId, 'MATERIAL_DELETED', 'LearningMaterial', id);
        return { message: 'Material deleted' };
    }
    async mapMaterial(materialId, data, mapperId) {
        let studentIds = data.studentIds || [];
        if (data.batchId) {
            const students = await config_1.prisma.student.findMany({
                where: { batchId: data.batchId },
                select: { id: true },
            });
            studentIds = [...studentIds, ...students.map(s => s.id)];
        }
        if (data.departmentId) {
            const students = await config_1.prisma.student.findMany({
                where: { departmentId: data.departmentId },
                select: { id: true },
            });
            studentIds = [...studentIds, ...students.map(s => s.id)];
        }
        studentIds = [...new Set(studentIds)];
        const existing = await config_1.prisma.materialAssignment.findMany({
            where: { materialId, studentId: { in: studentIds } },
            select: { studentId: true },
        });
        const existingSet = new Set(existing.map(e => e.studentId));
        const newIds = studentIds.filter(id => !existingSet.has(id));
        if (newIds.length > 0) {
            await config_1.prisma.materialAssignment.createMany({
                data: newIds.map(studentId => ({ materialId, studentId })),
            });
            // Notifications
            for (const studentId of newIds) {
                const student = await config_1.prisma.student.findUnique({
                    where: { id: studentId },
                    select: { userId: true },
                });
                if (student) {
                    const material = await config_1.prisma.learningMaterial.findUnique({ where: { id: materialId } });
                    await config_1.prisma.notification.create({
                        data: {
                            userId: student.userId,
                            title: 'New Learning Material',
                            message: `New material "${material?.title}" has been assigned to you.`,
                            type: 'INFO',
                            link: '/student/materials',
                        },
                    });
                }
            }
        }
        await (0, middleware_1.createAuditLog)(mapperId, 'MATERIAL_MAPPED', 'LearningMaterial', materialId, { studentCount: newIds.length });
        return { mapped: newIds.length, skipped: existingSet.size };
    }
    // Student material access
    async getStudentMaterials(studentId) {
        return config_1.prisma.materialAssignment.findMany({
            where: { studentId },
            include: {
                material: {
                    include: { subject: true, skill: true, topic: true },
                },
                activities: { orderBy: { accessedAt: 'desc' }, take: 1 },
            },
            orderBy: { assignedAt: 'desc' },
        });
    }
    async getStudentMaterialById(materialId, studentId) {
        const assignment = await config_1.prisma.materialAssignment.findUnique({
            where: { materialId_studentId: { materialId, studentId } },
            include: {
                material: { include: { subject: true, skill: true, topic: true } },
                activities: { orderBy: { accessedAt: 'desc' } },
            },
        });
        if (!assignment)
            throw new utils_1.ForbiddenError('Material not assigned to you');
        return assignment;
    }
    async recordActivity(materialId, studentId, data) {
        const assignment = await config_1.prisma.materialAssignment.findUnique({
            where: { materialId_studentId: { materialId, studentId } },
        });
        if (!assignment)
            throw new utils_1.ForbiddenError('Material not assigned to you');
        const activity = await config_1.prisma.learningActivity.create({
            data: {
                assignmentId: assignment.id,
                timeSpent: data.timeSpent,
                progress: data.progress || 0,
                isCompleted: data.isCompleted || false,
                completedAt: data.isCompleted ? new Date() : undefined,
            },
        });
        return activity;
    }
}
exports.MaterialService = MaterialService;
exports.materialService = new MaterialService();
//# sourceMappingURL=material.service.js.map