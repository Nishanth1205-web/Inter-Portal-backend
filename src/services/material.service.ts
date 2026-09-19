import { prisma } from '../config';
import { env } from '../config';
import { NotFoundError, ForbiddenError } from '../utils';
import { createAuditLog } from '../middleware';
import { createAIMaterialGenerator } from '../providers';
import { Prisma } from '@prisma/client';
import { MaterialType } from '../types';

export class MaterialService {
  private aiGenerator = createAIMaterialGenerator(env.AI_PROVIDER);

  async generateMaterial(data: {
    subject: string;
    skill?: string;
    topic?: string;
    difficulty?: string;
    learningObjective?: string;
    studentLevel?: string;
    type: MaterialType;
    subjectId?: string;
    skillId?: string;
    topicId?: string;
  }, createdById: string) {
    let subjectId = data.subjectId;
    if (!subjectId) {
      const allSubjects = await prisma.subject.findMany();
      const match = allSubjects.find(s => 
        data.subject.toLowerCase().includes(s.name.toLowerCase()) || 
        s.name.toLowerCase().includes(data.subject.toLowerCase())
      );
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

    const material = await prisma.learningMaterial.create({
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

    await createAuditLog(createdById, 'MATERIAL_GENERATED', 'LearningMaterial', material.id);
    return material;
  }

  async createMaterial(data: {
    title: string;
    description?: string;
    type: MaterialType;
    subjectId: string;
    skillId?: string;
    topicId?: string;
    content?: string;
    fileUrl?: string;
    fileName?: string;
    fileSize?: number;
    mimeType?: string;
    metadata?: any;
  }, createdById: string) {
    const { metadata, ...rest } = data;
    const material = await prisma.learningMaterial.create({
      data: {
        ...rest,
        metadata: metadata ? (typeof metadata === 'string' ? metadata : JSON.stringify(metadata)) : undefined,
        createdById,
      },
      include: { subject: true, skill: true, topic: true },
    });

    await createAuditLog(createdById, 'MATERIAL_CREATED', 'LearningMaterial', material.id);
    return material;
  }

  async getMaterials(params: {
    page?: number;
    limit?: number;
    search?: string;
    type?: MaterialType;
    subjectId?: string;
    skillId?: string;
    topicId?: string;
  }) {
    const { page = 1, limit = 10, search, type, subjectId, skillId, topicId } = params;
    const skip = (page - 1) * limit;

    const where: Prisma.LearningMaterialWhereInput = { isActive: true };
    if (type) where.type = type;
    if (subjectId) where.subjectId = subjectId;
    if (skillId) where.skillId = skillId;
    if (topicId) where.topicId = topicId;
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
      ];
    }

    const [materials, total] = await Promise.all([
      prisma.learningMaterial.findMany({
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
      prisma.learningMaterial.count({ where }),
    ]);

    return { materials, total, page, limit };
  }

  async getMaterialById(id: string) {
    const material = await prisma.learningMaterial.findUnique({
      where: { id },
      include: {
        subject: true,
        skill: true,
        topic: true,
        createdBy: { select: { firstName: true, lastName: true } },
      },
    });
    if (!material) throw new NotFoundError('Material not found');
    return material;
  }

  async updateMaterial(id: string, data: any, updaterId: string) {
    const material = await prisma.learningMaterial.findUnique({ where: { id } });
    if (!material) throw new NotFoundError('Material not found');

    const updated = await prisma.learningMaterial.update({
      where: { id },
      data,
      include: { subject: true, skill: true, topic: true },
    });

    await createAuditLog(updaterId, 'MATERIAL_UPDATED', 'LearningMaterial', id);
    return updated;
  }

  async deleteMaterial(id: string, deleterId: string) {
    await prisma.learningMaterial.update({ where: { id }, data: { isActive: false } });
    await createAuditLog(deleterId, 'MATERIAL_DELETED', 'LearningMaterial', id);
    return { message: 'Material deleted' };
  }

  async mapMaterial(materialId: string, data: {
    studentIds?: string[];
    batchId?: string;
    departmentId?: string;
  }, mapperId: string) {
    let studentIds: string[] = data.studentIds || [];

    if (data.batchId) {
      const students = await prisma.student.findMany({
        where: { batchId: data.batchId },
        select: { id: true },
      });
      studentIds = [...studentIds, ...students.map(s => s.id)];
    }

    if (data.departmentId) {
      const students = await prisma.student.findMany({
        where: { departmentId: data.departmentId },
        select: { id: true },
      });
      studentIds = [...studentIds, ...students.map(s => s.id)];
    }

    studentIds = [...new Set(studentIds)];

    const existing = await prisma.materialAssignment.findMany({
      where: { materialId, studentId: { in: studentIds } },
      select: { studentId: true },
    });
    const existingSet = new Set(existing.map(e => e.studentId));
    const newIds = studentIds.filter(id => !existingSet.has(id));

    if (newIds.length > 0) {
      await prisma.materialAssignment.createMany({
        data: newIds.map(studentId => ({ materialId, studentId })),
      });

      // Notifications
      for (const studentId of newIds) {
        const student = await prisma.student.findUnique({
          where: { id: studentId },
          select: { userId: true },
        });
        if (student) {
          const material = await prisma.learningMaterial.findUnique({ where: { id: materialId } });
          await prisma.notification.create({
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

    await createAuditLog(mapperId, 'MATERIAL_MAPPED', 'LearningMaterial', materialId, { studentCount: newIds.length });
    return { mapped: newIds.length, skipped: existingSet.size };
  }

  // Student material access
  async getStudentMaterials(studentId: string) {
    return prisma.materialAssignment.findMany({
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

  async getStudentMaterialById(materialId: string, studentId: string) {
    const assignment = await prisma.materialAssignment.findUnique({
      where: { materialId_studentId: { materialId, studentId } },
      include: {
        material: { include: { subject: true, skill: true, topic: true } },
        activities: { orderBy: { accessedAt: 'desc' } },
      },
    });

    if (!assignment) throw new ForbiddenError('Material not assigned to you');
    return assignment;
  }

  async recordActivity(materialId: string, studentId: string, data: {
    timeSpent?: number;
    progress?: number;
    isCompleted?: boolean;
  }) {
    const assignment = await prisma.materialAssignment.findUnique({
      where: { materialId_studentId: { materialId, studentId } },
    });
    if (!assignment) throw new ForbiddenError('Material not assigned to you');

    const activity = await prisma.learningActivity.create({
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

export const materialService = new MaterialService();
