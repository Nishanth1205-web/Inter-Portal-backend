import { QuestionType, Difficulty } from '../types';
export interface AIGeneratedQuestion {
    questionText: string;
    questionType: QuestionType;
    difficulty: Difficulty;
    marks: number;
    explanation?: string;
    correctAnswer?: string;
    options?: Array<{
        optionText: string;
        isCorrect: boolean;
    }>;
}
export interface AIQuestionGenerateInput {
    subject: string;
    skill?: string;
    topic?: string;
    difficulty: Difficulty;
    questionType: QuestionType;
    count: number;
    marks?: number;
    learningObjective?: string;
}
export interface IAIQuestionGenerator {
    generate(input: AIQuestionGenerateInput): Promise<AIGeneratedQuestion[]>;
}
export declare class MockAIQuestionGenerator implements IAIQuestionGenerator {
    generate(input: AIQuestionGenerateInput): Promise<AIGeneratedQuestion[]>;
    private generateMockQuestion;
    private generateMCQ;
    private generateTrueFalse;
    private generateFillBlank;
    private generateShortAnswer;
    private generateProgramming;
    private generateDescriptive;
}
export declare function createAIQuestionGenerator(provider: string): IAIQuestionGenerator;
//# sourceMappingURL=ai-question.provider.d.ts.map