"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userService = exports.UserService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const config_1 = require("../config");
const utils_1 = require("../utils");
const middleware_1 = require("../middleware");
class UserService {
    async createUser(data, creatorId) {
        const existing = await config_1.prisma.user.findUnique({ where: { email: data.email } });
        if (existing)
            throw new utils_1.ConflictError('Email already registered');
        const hashedPassword = await bcryptjs_1.default.hash(data.password, 12);
        const user = await config_1.prisma.$transaction(async (tx) => {
            const newUser = await tx.user.create({
                data: {
                    email: data.email,
                    password: hashedPassword,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    role: data.role,
                    phone: data.phone,
                },
            });
            if (data.role === 'STUDENT') {
                if (!data.departmentId || !data.batchId || !data.enrollmentNo) {
                    throw new utils_1.BadRequestError('Department, batch, and enrollment number are required for students');
                }
                await tx.student.create({
                    data: {
                        userId: newUser.id,
                        departmentId: data.departmentId,
                        batchId: data.batchId,
                        enrollmentNo: data.enrollmentNo,
                    },
                });
            }
            if (data.role === 'ADMIN') {
                await tx.admin.create({
                    data: {
                        userId: newUser.id,
                        designation: data.designation,
                    },
                });
            }
            return newUser;
        });
        if (creatorId) {
            await (0, middleware_1.createAuditLog)(creatorId, 'USER_CREATED', 'User', user.id, { role: data.role, email: data.email });
        }
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }
    async getUsers(params) {
        const { page = 1, limit = 10, role, search, isActive, departmentId, batchId } = params;
        const skip = (page - 1) * limit;
        const where = {};
        if (role)
            where.role = role;
        if (isActive !== undefined)
            where.isActive = isActive;
        if (search) {
            where.OR = [
                { firstName: { contains: search } },
                { lastName: { contains: search } },
                { email: { contains: search } },
            ];
        }
        if (departmentId) {
            where.student = { departmentId };
        }
        if (batchId) {
            where.student = { ...where.student, batchId };
        }
        const [users, total] = await Promise.all([
            config_1.prisma.user.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                select: {
                    id: true,
                    email: true,
                    firstName: true,
                    lastName: true,
                    role: true,
                    isActive: true,
                    phone: true,
                    lastLoginAt: true,
                    createdAt: true,
                    student: {
                        include: { department: true, batch: true },
                    },
                    admin: true,
                },
            }),
            config_1.prisma.user.count({ where }),
        ]);
        return { users, total, page, limit };
    }
    async getUserById(id) {
        const user = await config_1.prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true,
                isActive: true,
                phone: true,
                avatar: true,
                lastLoginAt: true,
                createdAt: true,
                updatedAt: true,
                student: {
                    include: { department: true, batch: true },
                },
                admin: true,
            },
        });
        if (!user)
            throw new utils_1.NotFoundError('User not found');
        return user;
    }
    async updateUser(id, data, updaterId) {
        const user = await config_1.prisma.user.findUnique({ where: { id } });
        if (!user)
            throw new utils_1.NotFoundError('User not found');
        const updateData = {};
        if (data.firstName)
            updateData.firstName = data.firstName;
        if (data.lastName)
            updateData.lastName = data.lastName;
        if (data.phone !== undefined)
            updateData.phone = data.phone;
        if (data.isActive !== undefined)
            updateData.isActive = data.isActive;
        if (data.password)
            updateData.password = await bcryptjs_1.default.hash(data.password, 12);
        const updated = await config_1.prisma.user.update({
            where: { id },
            data: updateData,
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true,
                isActive: true,
                phone: true,
                createdAt: true,
            },
        });
        await (0, middleware_1.createAuditLog)(updaterId, 'USER_UPDATED', 'User', id);
        return updated;
    }
    async deleteUser(id, deleterId) {
        const user = await config_1.prisma.user.findUnique({ where: { id } });
        if (!user)
            throw new utils_1.NotFoundError('User not found');
        await config_1.prisma.user.update({
            where: { id },
            data: { isActive: false },
        });
        await (0, middleware_1.createAuditLog)(deleterId, 'USER_DELETED', 'User', id);
        return { message: 'User deactivated successfully' };
    }
    // Department management
    async getDepartments() {
        return config_1.prisma.department.findMany({ orderBy: { name: 'asc' } });
    }
    async createDepartment(data) {
        return config_1.prisma.department.create({ data });
    }
    async updateDepartment(id, data) {
        return config_1.prisma.department.update({ where: { id }, data });
    }
    async deleteDepartment(id) {
        return config_1.prisma.department.update({ where: { id }, data: { isActive: false } });
    }
    // Batch management
    async getBatches() {
        return config_1.prisma.batch.findMany({ orderBy: { year: 'desc' } });
    }
    async createBatch(data) {
        return config_1.prisma.batch.create({ data });
    }
    async updateBatch(id, data) {
        return config_1.prisma.batch.update({ where: { id }, data });
    }
    async deleteBatch(id) {
        return config_1.prisma.batch.update({ where: { id }, data: { isActive: false } });
    }
    // Subject management
    async getSubjects() {
        return config_1.prisma.subject.findMany({
            where: { isActive: true },
            include: { skills: { include: { topics: true } } },
            orderBy: { name: 'asc' },
        });
    }
    async createSubject(data) {
        return config_1.prisma.subject.create({ data });
    }
    async updateSubject(id, data) {
        return config_1.prisma.subject.update({ where: { id }, data });
    }
    // Skill management
    async getSkills(subjectId) {
        const where = subjectId ? { subjectId, isActive: true } : { isActive: true };
        return config_1.prisma.skill.findMany({
            where,
            include: { subject: true, topics: true },
            orderBy: { name: 'asc' },
        });
    }
    async createSkill(data) {
        return config_1.prisma.skill.create({ data, include: { subject: true } });
    }
    // Topic management
    async getTopics(skillId) {
        const where = skillId ? { skillId, isActive: true } : { isActive: true };
        return config_1.prisma.topic.findMany({
            where,
            include: { skill: { include: { subject: true } } },
            orderBy: { name: 'asc' },
        });
    }
    async createTopic(data) {
        return config_1.prisma.topic.create({ data, include: { skill: true } });
    }
}
exports.UserService = UserService;
exports.userService = new UserService();
//# sourceMappingURL=user.service.js.map