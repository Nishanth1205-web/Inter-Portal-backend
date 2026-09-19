import { prisma } from '../config';
import { NotFoundError, BadRequestError } from '../utils';
import { createAuditLog } from '../middleware';
import { Prisma } from '@prisma/client';
import { QuestionType, Difficulty } from '../types';

export class QuestionService {
  async createQuestion(data: {
    questionText: string;
    questionType: QuestionType;
    difficulty: Difficulty;
    marks: number;
    timeInSeconds?: number;
    explanation?: string;
    correctAnswer?: string;
    subjectId: string;
    skillId?: string;
    topicId?: string;
    options?: Array<{ optionText: string; isCorrect: boolean; sortOrder?: number }>;
    isAIGenerated?: boolean;
  }, createdById: string) {
    const question = await prisma.question.create({
      data: {
        questionText: data.questionText,
        questionType: data.questionType,
        difficulty: data.difficulty,
        marks: data.marks,
        timeInSeconds: data.timeInSeconds,
        explanation: data.explanation,
        correctAnswer: data.correctAnswer,
        subjectId: data.subjectId,
        skillId: data.skillId,
        topicId: data.topicId,
        createdById,
        isAIGenerated: data.isAIGenerated || false,
        options: data.options ? {
          create: data.options.map((opt, idx) => ({
            optionText: opt.optionText,
            isCorrect: opt.isCorrect,
            sortOrder: opt.sortOrder ?? idx,
          })),
        } : undefined,
      },
      include: {
        options: { orderBy: { sortOrder: 'asc' } },
        subject: true,
        skill: true,
        topic: true,
      },
    });

    await createAuditLog(createdById, 'QUESTION_CREATED', 'Question', question.id);
    return question;
  }

  async getQuestions(params: {
    page?: number;
    limit?: number;
    search?: string;
    subjectId?: string;
    skillId?: string;
    topicId?: string;
    difficulty?: Difficulty;
    questionType?: QuestionType;
    isAIGenerated?: boolean;
  }) {
    const { page = 1, limit = 10, search, subjectId, skillId, topicId, difficulty, questionType, isAIGenerated } = params;
    const skip = (page - 1) * limit;

    const where: Prisma.QuestionWhereInput = { isActive: true };
    if (subjectId) where.subjectId = subjectId;
    if (skillId) where.skillId = skillId;
    if (topicId) where.topicId = topicId;
    if (difficulty) where.difficulty = difficulty;
    if (questionType) where.questionType = questionType;
    if (isAIGenerated !== undefined) where.isAIGenerated = isAIGenerated;
    if (search) {
      where.questionText = { contains: search };
    }

    const [questions, total] = await Promise.all([
      prisma.question.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          options: { orderBy: { sortOrder: 'asc' } },
          subject: true,
          skill: true,
          topic: true,
          createdBy: { select: { firstName: true, lastName: true } },
        },
      }),
      prisma.question.count({ where }),
    ]);

    return { questions, total, page, limit };
  }

  async getQuestionById(id: string) {
    const question = await prisma.question.findUnique({
      where: { id },
      include: {
        options: { orderBy: { sortOrder: 'asc' } },
        subject: true,
        skill: true,
        topic: true,
        createdBy: { select: { firstName: true, lastName: true } },
      },
    });
    if (!question) throw new NotFoundError('Question not found');
    return question;
  }

  async updateQuestion(id: string, data: any, updaterId: string) {
    const question = await prisma.question.findUnique({ where: { id } });
    if (!question) throw new NotFoundError('Question not found');

    const updated = await prisma.$transaction(async (tx) => {
      // If options are provided, replace all options
      if (data.options) {
        await tx.questionOption.deleteMany({ where: { questionId: id } });
        await tx.questionOption.createMany({
          data: data.options.map((opt: any, idx: number) => ({
            questionId: id,
            optionText: opt.optionText,
            isCorrect: opt.isCorrect,
            sortOrder: opt.sortOrder ?? idx,
          })),
        });
      }

      const { options, ...updateData } = data;
      return tx.question.update({
        where: { id },
        data: updateData,
        include: {
          options: { orderBy: { sortOrder: 'asc' } },
          subject: true,
          skill: true,
          topic: true,
        },
      });
    });

    await createAuditLog(updaterId, 'QUESTION_UPDATED', 'Question', id);
    return updated;
  }

  async deleteQuestion(id: string, deleterId: string) {
    const question = await prisma.question.findUnique({ where: { id } });
    if (!question) throw new NotFoundError('Question not found');

    await prisma.question.update({ where: { id }, data: { isActive: false } });
    await createAuditLog(deleterId, 'QUESTION_DELETED', 'Question', id);
    return { message: 'Question deleted successfully' };
  }

  async duplicateQuestion(id: string, createdById: string) {
    const original = await prisma.question.findUnique({
      where: { id },
      include: { options: true },
    });
    if (!original) throw new NotFoundError('Question not found');

    const { id: _, createdAt, updatedAt, options, ...questionData } = original;
    
    const duplicate = await prisma.question.create({
      data: {
        ...questionData,
        questionText: `${original.questionText} (Copy)`,
        createdById,
        options: {
          create: options.map(({ id, questionId, createdAt, ...opt }) => opt),
        },
      },
      include: {
        options: { orderBy: { sortOrder: 'asc' } },
        subject: true,
        skill: true,
        topic: true,
      },
    });

    return duplicate;
  }
}

export const questionService = new QuestionService();
