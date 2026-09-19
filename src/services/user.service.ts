import bcrypt from 'bcryptjs';
import { prisma } from '../config';
import { NotFoundError, ConflictError, BadRequestError } from '../utils';
import { createAuditLog } from '../middleware';
import { Prisma } from '@prisma/client';
import { Role } from '../types';

export class UserService {
  async createUser(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: Role;
    phone?: string;
    departmentId?: string;
    batchId?: string;
    enrollmentNo?: string;
    designation?: string;
  }, creatorId?: string) {
    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) throw new ConflictError('Email already registered');

    const hashedPassword = await bcrypt.hash(data.password, 12);

    const user = await prisma.$transaction(async (tx) => {
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
          throw new BadRequestError('Department, batch, and enrollment number are required for students');
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
      await createAuditLog(creatorId, 'USER_CREATED', 'User', user.id, { role: data.role, email: data.email });
    }

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async getUsers(params: {
    page?: number;
    limit?: number;
    role?: Role;
    search?: string;
    isActive?: boolean;
    departmentId?: string;
    batchId?: string;
  }) {
    const { page = 1, limit = 10, role, search, isActive, departmentId, batchId } = params;
    const skip = (page - 1) * limit;

    const where: Prisma.UserWhereInput = {};
    if (role) where.role = role;
    if (isActive !== undefined) where.isActive = isActive;
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
      where.student = { ...where.student as any, batchId };
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
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
      prisma.user.count({ where }),
    ]);

    return { users, total, page, limit };
  }

  async getUserById(id: string) {
    const user = await prisma.user.findUnique({
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

    if (!user) throw new NotFoundError('User not found');
    return user;
  }

  async updateUser(id: string, data: any, updaterId: string) {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundError('User not found');

    const updateData: any = {};
    if (data.firstName) updateData.firstName = data.firstName;
    if (data.lastName) updateData.lastName = data.lastName;
    if (data.phone !== undefined) updateData.phone = data.phone;
    if (data.isActive !== undefined) updateData.isActive = data.isActive;
    if (data.password) updateData.password = await bcrypt.hash(data.password, 12);

    const updated = await prisma.user.update({
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

    await createAuditLog(updaterId, 'USER_UPDATED', 'User', id);
    return updated;
  }

  async deleteUser(id: string, deleterId: string) {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundError('User not found');

    await prisma.user.update({
      where: { id },
      data: { isActive: false },
    });

    await createAuditLog(deleterId, 'USER_DELETED', 'User', id);
    return { message: 'User deactivated successfully' };
  }

  // Department management
  async getDepartments() {
    return prisma.department.findMany({ orderBy: { name: 'asc' } });
  }

  async createDepartment(data: { name: string; code: string; description?: string }) {
    return prisma.department.create({ data });
  }

  async updateDepartment(id: string, data: any) {
    return prisma.department.update({ where: { id }, data });
  }

  async deleteDepartment(id: string) {
    return prisma.department.update({ where: { id }, data: { isActive: false } });
  }

  // Batch management
  async getBatches() {
    return prisma.batch.findMany({ orderBy: { year: 'desc' } });
  }

  async createBatch(data: { name: string; year: number }) {
    return prisma.batch.create({ data });
  }

  async updateBatch(id: string, data: any) {
    return prisma.batch.update({ where: { id }, data });
  }

  async deleteBatch(id: string) {
    return prisma.batch.update({ where: { id }, data: { isActive: false } });
  }

  // Subject management
  async getSubjects() {
    return prisma.subject.findMany({ 
      where: { isActive: true },
      include: { skills: { include: { topics: true } } },
      orderBy: { name: 'asc' },
    });
  }

  async createSubject(data: { name: string; code: string; description?: string }) {
    return prisma.subject.create({ data });
  }

  async updateSubject(id: string, data: any) {
    return prisma.subject.update({ where: { id }, data });
  }

  // Skill management
  async getSkills(subjectId?: string) {
    const where = subjectId ? { subjectId, isActive: true } : { isActive: true };
    return prisma.skill.findMany({
      where,
      include: { subject: true, topics: true },
      orderBy: { name: 'asc' },
    });
  }

  async createSkill(data: { name: string; subjectId: string; description?: string }) {
    return prisma.skill.create({ data, include: { subject: true } });
  }

  // Topic management
  async getTopics(skillId?: string) {
    const where = skillId ? { skillId, isActive: true } : { isActive: true };
    return prisma.topic.findMany({
      where,
      include: { skill: { include: { subject: true } } },
      orderBy: { name: 'asc' },
    });
  }

  async createTopic(data: { name: string; skillId: string; description?: string }) {
    return prisma.topic.create({ data, include: { skill: true } });
  }
}

export const userService = new UserService();
