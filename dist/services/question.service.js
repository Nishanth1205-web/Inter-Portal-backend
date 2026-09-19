"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.questionService = exports.QuestionService = void 0;
const config_1 = require("../config");
const utils_1 = require("../utils");
const middleware_1 = require("../middleware");
class QuestionService {
    async createQuestion(data, createdById) {
        const question = await config_1.prisma.question.create({
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
        await (0, middleware_1.createAuditLog)(createdById, 'QUESTION_CREATED', 'Question', question.id);
        return question;
    }
    async getQuestions(params) {
        const { page = 1, limit = 10, search, subjectId, skillId, topicId, difficulty, questionType, isAIGenerated } = params;
        const skip = (page - 1) * limit;
        const where = { isActive: true };
        if (subjectId)
            where.subjectId = subjectId;
        if (skillId)
            where.skillId = skillId;
        if (topicId)
            where.topicId = topicId;
        if (difficulty)
            where.difficulty = difficulty;
        if (questionType)
            where.questionType = questionType;
        if (isAIGenerated !== undefined)
            where.isAIGenerated = isAIGenerated;
        if (search) {
            where.questionText = { contains: search };
        }
        const [questions, total] = await Promise.all([
            config_1.prisma.question.findMany({
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
            config_1.prisma.question.count({ where }),
        ]);
        return { questions, total, page, limit };
    }
    async getQuestionById(id) {
        const question = await config_1.prisma.question.findUnique({
            where: { id },
            include: {
                options: { orderBy: { sortOrder: 'asc' } },
                subject: true,
                skill: true,
                topic: true,
                createdBy: { select: { firstName: true, lastName: true } },
            },
        });
        if (!question)
            throw new utils_1.NotFoundError('Question not found');
        return question;
    }
    async updateQuestion(id, data, updaterId) {
        const question = await config_1.prisma.question.findUnique({ where: { id } });
        if (!question)
            throw new utils_1.NotFoundError('Question not found');
        const updated = await config_1.prisma.$transaction(async (tx) => {
            // If options are provided, replace all options
            if (data.options) {
                await tx.questionOption.deleteMany({ where: { questionId: id } });
                await tx.questionOption.createMany({
                    data: data.options.map((opt, idx) => ({
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
        await (0, middleware_1.createAuditLog)(updaterId, 'QUESTION_UPDATED', 'Question', id);
        return updated;
    }
    async deleteQuestion(id, deleterId) {
        const question = await config_1.prisma.question.findUnique({ where: { id } });
        if (!question)
            throw new utils_1.NotFoundError('Question not found');
        await config_1.prisma.question.update({ where: { id }, data: { isActive: false } });
        await (0, middleware_1.createAuditLog)(deleterId, 'QUESTION_DELETED', 'Question', id);
        return { message: 'Question deleted successfully' };
    }
    async duplicateQuestion(id, createdById) {
        const original = await config_1.prisma.question.findUnique({
            where: { id },
            include: { options: true },
        });
        if (!original)
            throw new utils_1.NotFoundError('Question not found');
        const { id: _, createdAt, updatedAt, options, ...questionData } = original;
        const duplicate = await config_1.prisma.question.create({
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
exports.QuestionService = QuestionService;
exports.questionService = new QuestionService();
//# sourceMappingURL=question.service.js.map