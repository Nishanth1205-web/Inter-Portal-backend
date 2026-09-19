import { QuestionType, Difficulty } from '../types';
export declare class QuestionService {
    createQuestion(data: {
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
        options?: Array<{
            optionText: string;
            isCorrect: boolean;
            sortOrder?: number;
        }>;
        isAIGenerated?: boolean;
    }, createdById: string): Promise<{
        options: {
            id: string;
            createdAt: Date;
            optionText: string;
            isCorrect: boolean;
            sortOrder: number;
            questionId: string;
        }[];
        subject: {
            code: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            isActive: boolean;
            description: string | null;
        };
        skill: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            isActive: boolean;
            description: string | null;
            subjectId: string;
        } | null;
        topic: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            isActive: boolean;
            description: string | null;
            skillId: string;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        subjectId: string;
        skillId: string | null;
        questionText: string;
        questionType: string;
        difficulty: string;
        marks: number;
        timeInSeconds: number | null;
        explanation: string | null;
        correctAnswer: string | null;
        isAIGenerated: boolean;
        topicId: string | null;
        createdById: string;
    }>;
    getQuestions(params: {
        page?: number;
        limit?: number;
        search?: string;
        subjectId?: string;
        skillId?: string;
        topicId?: string;
        difficulty?: Difficulty;
        questionType?: QuestionType;
        isAIGenerated?: boolean;
    }): Promise<{
        questions: ({
            options: {
                id: string;
                createdAt: Date;
                optionText: string;
                isCorrect: boolean;
                sortOrder: number;
                questionId: string;
            }[];
            subject: {
                code: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                isActive: boolean;
                description: string | null;
            };
            skill: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                isActive: boolean;
                description: string | null;
                subjectId: string;
            } | null;
            topic: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                isActive: boolean;
                description: string | null;
                skillId: string;
            } | null;
            createdBy: {
                firstName: string;
                lastName: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            isActive: boolean;
            subjectId: string;
            skillId: string | null;
            questionText: string;
            questionType: string;
            difficulty: string;
            marks: number;
            timeInSeconds: number | null;
            explanation: string | null;
            correctAnswer: string | null;
            isAIGenerated: boolean;
            topicId: string | null;
            createdById: string;
        })[];
        total: number;
        page: number;
        limit: number;
    }>;
    getQuestionById(id: string): Promise<{
        options: {
            id: string;
            createdAt: Date;
            optionText: string;
            isCorrect: boolean;
            sortOrder: number;
            questionId: string;
        }[];
        subject: {
            code: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            isActive: boolean;
            description: string | null;
        };
        skill: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            isActive: boolean;
            description: string | null;
            subjectId: string;
        } | null;
        topic: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            isActive: boolean;
            description: string | null;
            skillId: string;
        } | null;
        createdBy: {
            firstName: string;
            lastName: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        subjectId: string;
        skillId: string | null;
        questionText: string;
        questionType: string;
        difficulty: string;
        marks: number;
        timeInSeconds: number | null;
        explanation: string | null;
        correctAnswer: string | null;
        isAIGenerated: boolean;
        topicId: string | null;
        createdById: string;
    }>;
    updateQuestion(id: string, data: any, updaterId: string): Promise<{
        options: {
            id: string;
            createdAt: Date;
            optionText: string;
            isCorrect: boolean;
            sortOrder: number;
            questionId: string;
        }[];
        subject: {
            code: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            isActive: boolean;
            description: string | null;
        };
        skill: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            isActive: boolean;
            description: string | null;
            subjectId: string;
        } | null;
        topic: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            isActive: boolean;
            description: string | null;
            skillId: string;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        subjectId: string;
        skillId: string | null;
        questionText: string;
        questionType: string;
        difficulty: string;
        marks: number;
        timeInSeconds: number | null;
        explanation: string | null;
        correctAnswer: string | null;
        isAIGenerated: boolean;
        topicId: string | null;
        createdById: string;
    }>;
    deleteQuestion(id: string, deleterId: string): Promise<{
        message: string;
    }>;
    duplicateQuestion(id: string, createdById: string): Promise<{
        options: {
            id: string;
            createdAt: Date;
            optionText: string;
            isCorrect: boolean;
            sortOrder: number;
            questionId: string;
        }[];
        subject: {
            code: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            isActive: boolean;
            description: string | null;
        };
        skill: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            isActive: boolean;
            description: string | null;
            subjectId: string;
        } | null;
        topic: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            isActive: boolean;
            description: string | null;
            skillId: string;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        subjectId: string;
        skillId: string | null;
        questionText: string;
        questionType: string;
        difficulty: string;
        marks: number;
        timeInSeconds: number | null;
        explanation: string | null;
        correctAnswer: string | null;
        isAIGenerated: boolean;
        topicId: string | null;
        createdById: string;
    }>;
}
export declare const questionService: QuestionService;
//# sourceMappingURL=question.service.d.ts.map