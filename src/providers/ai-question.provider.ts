import { QuestionType, Difficulty } from '../types';

// ============================================
// AI PROVIDER INTERFACES
// ============================================

export interface AIGeneratedQuestion {
  questionText: string;
  questionType: QuestionType;
  difficulty: Difficulty;
  marks: number;
  explanation?: string;
  correctAnswer?: string;
  options?: Array<{ optionText: string; isCorrect: boolean }>;
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

// ============================================
// MOCK AI QUESTION GENERATOR
// ============================================

export class MockAIQuestionGenerator implements IAIQuestionGenerator {
  async generate(input: AIQuestionGenerateInput): Promise<AIGeneratedQuestion[]> {
    const questions: AIGeneratedQuestion[] = [];

    for (let i = 0; i < input.count; i++) {
      questions.push(this.generateMockQuestion(input, i));
    }

    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    return questions;
  }

  private generateMockQuestion(input: AIQuestionGenerateInput, index: number): AIGeneratedQuestion {
    const marks = input.marks || (input.difficulty === 'EASY' ? 1 : input.difficulty === 'MEDIUM' ? 2 : 3);

    switch (input.questionType) {
      case 'MCQ':
        return this.generateMCQ(input, index, marks);
      case 'TRUE_FALSE':
        return this.generateTrueFalse(input, index, marks);
      case 'FILL_BLANK':
        return this.generateFillBlank(input, index, marks);
      case 'SHORT_ANSWER':
        return this.generateShortAnswer(input, index, marks);
      case 'PROGRAMMING':
        return this.generateProgramming(input, index, marks);
      case 'DESCRIPTIVE':
        return this.generateDescriptive(input, index, marks);
      default:
        return this.generateMCQ(input, index, marks);
    }
  }

  private generateMCQ(input: AIQuestionGenerateInput, index: number, marks: number): AIGeneratedQuestion {
    const topic = input.topic || input.subject;
    return {
      questionText: `[AI Generated] Which of the following best describes the concept of "${topic}" in ${input.subject}? (Question ${index + 1})`,
      questionType: 'MCQ',
      difficulty: input.difficulty,
      marks,
      explanation: `This question tests understanding of ${topic} in ${input.subject}. The correct answer demonstrates fundamental knowledge of the concept.`,
      correctAnswer: 'A',
      options: [
        { optionText: `The primary mechanism used in ${topic} for processing data`, isCorrect: true },
        { optionText: `A secondary feature that is rarely used in ${topic}`, isCorrect: false },
        { optionText: `An deprecated approach to ${topic}`, isCorrect: false },
        { optionText: `A concept unrelated to ${topic}`, isCorrect: false },
      ],
    };
  }

  private generateTrueFalse(input: AIQuestionGenerateInput, index: number, marks: number): AIGeneratedQuestion {
    return {
      questionText: `[AI Generated] In ${input.subject}, ${input.topic || 'the core concept'} is essential for building scalable applications. (True/False - Question ${index + 1})`,
      questionType: 'TRUE_FALSE',
      difficulty: input.difficulty,
      marks,
      explanation: `This statement is true because ${input.topic || 'the concept'} plays a fundamental role in ${input.subject}.`,
      correctAnswer: 'True',
    };
  }

  private generateFillBlank(input: AIQuestionGenerateInput, index: number, marks: number): AIGeneratedQuestion {
    return {
      questionText: `[AI Generated] In ${input.subject}, the _____ is used to implement ${input.topic || 'the core functionality'}. (Question ${index + 1})`,
      questionType: 'FILL_BLANK',
      difficulty: input.difficulty,
      marks,
      explanation: `The answer relates to the fundamental building block of ${input.topic || input.subject}.`,
      correctAnswer: input.topic || 'function',
    };
  }

  private generateShortAnswer(input: AIQuestionGenerateInput, index: number, marks: number): AIGeneratedQuestion {
    return {
      questionText: `[AI Generated] Explain the significance of ${input.topic || input.skill || input.subject} in modern software development. (Question ${index + 1})`,
      questionType: 'SHORT_ANSWER',
      difficulty: input.difficulty,
      marks,
      explanation: `A complete answer should cover the key aspects of ${input.topic || input.subject} and its practical applications.`,
      correctAnswer: `${input.topic || input.subject} is significant because it provides a structured approach to solving complex problems in software development.`,
    };
  }

  private generateProgramming(input: AIQuestionGenerateInput, index: number, marks: number): AIGeneratedQuestion {
    return {
      questionText: `[AI Generated] Write a function in ${input.subject} that demonstrates the use of ${input.topic || 'basic concepts'}. The function should accept appropriate parameters and return the expected result. (Question ${index + 1})`,
      questionType: 'PROGRAMMING',
      difficulty: input.difficulty,
      marks,
      explanation: `The solution should demonstrate proper use of ${input.topic || input.subject} syntax, error handling, and clean code practices.`,
      correctAnswer: `function example() {\n  // Implementation using ${input.topic || input.subject}\n  return result;\n}`,
    };
  }

  private generateDescriptive(input: AIQuestionGenerateInput, index: number, marks: number): AIGeneratedQuestion {
    return {
      questionText: `[AI Generated] Describe in detail how ${input.topic || input.skill || input.subject} works and discuss its advantages and limitations. Provide examples. (Question ${index + 1})`,
      questionType: 'DESCRIPTIVE',
      difficulty: input.difficulty,
      marks,
      explanation: `A comprehensive answer should cover the working mechanism, advantages, limitations, and practical examples of ${input.topic || input.subject}.`,
    };
  }
}

// Factory function
export function createAIQuestionGenerator(provider: string): IAIQuestionGenerator {
  switch (provider) {
    case 'mock':
      return new MockAIQuestionGenerator();
    // Future: case 'openai': return new OpenAIQuestionGenerator();
    // Future: case 'gemini': return new GeminiQuestionGenerator();
    default:
      return new MockAIQuestionGenerator();
  }
}
