"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockAIQuestionGenerator = void 0;
exports.createAIQuestionGenerator = createAIQuestionGenerator;
// ============================================
// MOCK AI QUESTION GENERATOR
// ============================================
class MockAIQuestionGenerator {
    async generate(input) {
        const questions = [];
        for (let i = 0; i < input.count; i++) {
            questions.push(this.generateMockQuestion(input, i));
        }
        // Simulate AI processing delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        return questions;
    }
    generateMockQuestion(input, index) {
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
    generateMCQ(input, index, marks) {
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
    generateTrueFalse(input, index, marks) {
        return {
            questionText: `[AI Generated] In ${input.subject}, ${input.topic || 'the core concept'} is essential for building scalable applications. (True/False - Question ${index + 1})`,
            questionType: 'TRUE_FALSE',
            difficulty: input.difficulty,
            marks,
            explanation: `This statement is true because ${input.topic || 'the concept'} plays a fundamental role in ${input.subject}.`,
            correctAnswer: 'True',
        };
    }
    generateFillBlank(input, index, marks) {
        return {
            questionText: `[AI Generated] In ${input.subject}, the _____ is used to implement ${input.topic || 'the core functionality'}. (Question ${index + 1})`,
            questionType: 'FILL_BLANK',
            difficulty: input.difficulty,
            marks,
            explanation: `The answer relates to the fundamental building block of ${input.topic || input.subject}.`,
            correctAnswer: input.topic || 'function',
        };
    }
    generateShortAnswer(input, index, marks) {
        return {
            questionText: `[AI Generated] Explain the significance of ${input.topic || input.skill || input.subject} in modern software development. (Question ${index + 1})`,
            questionType: 'SHORT_ANSWER',
            difficulty: input.difficulty,
            marks,
            explanation: `A complete answer should cover the key aspects of ${input.topic || input.subject} and its practical applications.`,
            correctAnswer: `${input.topic || input.subject} is significant because it provides a structured approach to solving complex problems in software development.`,
        };
    }
    generateProgramming(input, index, marks) {
        return {
            questionText: `[AI Generated] Write a function in ${input.subject} that demonstrates the use of ${input.topic || 'basic concepts'}. The function should accept appropriate parameters and return the expected result. (Question ${index + 1})`,
            questionType: 'PROGRAMMING',
            difficulty: input.difficulty,
            marks,
            explanation: `The solution should demonstrate proper use of ${input.topic || input.subject} syntax, error handling, and clean code practices.`,
            correctAnswer: `function example() {\n  // Implementation using ${input.topic || input.subject}\n  return result;\n}`,
        };
    }
    generateDescriptive(input, index, marks) {
        return {
            questionText: `[AI Generated] Describe in detail how ${input.topic || input.skill || input.subject} works and discuss its advantages and limitations. Provide examples. (Question ${index + 1})`,
            questionType: 'DESCRIPTIVE',
            difficulty: input.difficulty,
            marks,
            explanation: `A comprehensive answer should cover the working mechanism, advantages, limitations, and practical examples of ${input.topic || input.subject}.`,
        };
    }
}
exports.MockAIQuestionGenerator = MockAIQuestionGenerator;
// Factory function
function createAIQuestionGenerator(provider) {
    switch (provider) {
        case 'mock':
            return new MockAIQuestionGenerator();
        // Future: case 'openai': return new OpenAIQuestionGenerator();
        // Future: case 'gemini': return new GeminiQuestionGenerator();
        default:
            return new MockAIQuestionGenerator();
    }
}
//# sourceMappingURL=ai-question.provider.js.map