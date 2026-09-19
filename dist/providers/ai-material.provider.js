"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockAIMaterialGenerator = void 0;
exports.createAIMaterialGenerator = createAIMaterialGenerator;
// ============================================
// MOCK AI MATERIAL GENERATOR
// ============================================
class MockAIMaterialGenerator {
    async generate(input) {
        await new Promise(resolve => setTimeout(resolve, 1500));
        switch (input.type) {
            case 'PPT':
                return this.generatePPT(input);
            case 'VIDEO':
                return this.generateVideo(input);
            case 'IMAGE':
                return this.generateImage(input);
            case 'DOCUMENT':
                return this.generateDocument(input);
            default:
                return this.generateDocument(input);
        }
    }
    generatePPT(input) {
        const topic = input.topic || input.subject;
        return {
            title: `${topic} - Comprehensive Presentation`,
            description: `AI-generated presentation covering ${topic} in ${input.subject}`,
            type: 'PPT',
            content: `# ${topic}\n\n## Presentation Outline\n\n### Slide 1: Introduction\n- Welcome and overview\n- Learning objectives\n\n### Slide 2: Core Concepts\n- Definition of ${topic}\n- Key terminology\n\n### Slide 3: How It Works\n- Step-by-step explanation\n- Visual diagrams\n\n### Slide 4: Examples\n- Real-world applications\n- Code examples\n\n### Slide 5: Best Practices\n- Industry standards\n- Common patterns\n\n### Slide 6: Summary\n- Key takeaways\n- Next steps\n\n### Slide 7: Q&A\n- Questions and discussion`,
            metadata: {
                slides: [
                    { title: 'Introduction', content: `Welcome to ${topic}`, notes: 'Start with overview' },
                    { title: 'Core Concepts', content: `Understanding ${topic}`, notes: 'Explain fundamentals' },
                    { title: 'How It Works', content: 'Step-by-step walkthrough', notes: 'Use diagrams' },
                    { title: 'Examples', content: 'Practical applications', notes: 'Show code' },
                    { title: 'Best Practices', content: 'Industry standards', notes: 'Highlight key points' },
                    { title: 'Summary', content: 'Key takeaways', notes: 'Recap main ideas' },
                    { title: 'Q&A', content: 'Questions?', notes: 'Open discussion' },
                ],
                slideCount: 7,
                estimatedDuration: '15-20 minutes',
            },
        };
    }
    generateVideo(input) {
        const topic = input.topic || input.subject;
        return {
            title: `${topic} - Video Tutorial`,
            description: `AI-generated video script for ${topic} in ${input.subject}`,
            type: 'VIDEO',
            content: `# Video Script: ${topic}\n\n## Scene 1: Introduction (0:00 - 0:30)\nNarration: "Welcome to this tutorial on ${topic}. Today we'll explore..."\n\n## Scene 2: Concept Overview (0:30 - 2:00)\nNarration: "Let's start by understanding what ${topic} is..."\nVisual: Animated diagram showing the concept\n\n## Scene 3: Detailed Explanation (2:00 - 5:00)\nNarration: "Now let's dive deeper into how ${topic} works..."\nVisual: Code walkthrough\n\n## Scene 4: Examples (5:00 - 8:00)\nNarration: "Let's look at some practical examples..."\nVisual: Live coding demonstration\n\n## Scene 5: Summary (8:00 - 9:00)\nNarration: "To summarize what we've learned today..."\nVisual: Key points recap`,
            metadata: {
                scenes: [
                    { title: 'Introduction', duration: '0:30', narration: 'Welcome...' },
                    { title: 'Concept Overview', duration: '1:30', narration: 'Understanding...' },
                    { title: 'Detailed Explanation', duration: '3:00', narration: 'Deep dive...' },
                    { title: 'Examples', duration: '3:00', narration: 'Practical examples...' },
                    { title: 'Summary', duration: '1:00', narration: 'Key takeaways...' },
                ],
                estimatedDuration: '9 minutes',
                note: 'This is a video script/storyboard. Connect a video generation service to produce the actual video.',
            },
        };
    }
    generateImage(input) {
        const topic = input.topic || input.subject;
        return {
            title: `${topic} - Concept Diagram`,
            description: `AI-generated diagram/infographic description for ${topic}`,
            type: 'IMAGE',
            content: `# Image Description: ${topic} Concept Map\n\n## Layout\nA clean infographic showing the key components of ${topic}\n\n## Elements\n- Central node: "${topic}"\n- Branch 1: Key Concepts\n- Branch 2: Applications\n- Branch 3: Benefits\n- Branch 4: Related Topics\n\n## Color Scheme\n- Primary: Blue (#3B82F6)\n- Secondary: Green (#10B981)\n- Accent: Purple (#8B5CF6)`,
            metadata: {
                imageType: 'concept_map',
                dimensions: '1920x1080',
                note: 'This is an image description. Connect an image generation service (DALL-E, Midjourney, etc.) to produce the actual image.',
            },
        };
    }
    generateDocument(input) {
        const topic = input.topic || input.subject;
        return {
            title: `${topic} - Study Notes`,
            description: `Comprehensive study notes for ${topic} in ${input.subject}`,
            type: 'DOCUMENT',
            content: `# ${topic} - Complete Study Guide\n\n## 1. Introduction\n${topic} is a fundamental concept in ${input.subject} that plays a crucial role in modern software development.\n\n## 2. Key Concepts\n\n### 2.1 Definition\n${topic} can be defined as a structured approach to solving problems in ${input.subject}.\n\n### 2.2 Core Principles\n- **Principle 1**: Foundation and basics\n- **Principle 2**: Implementation patterns\n- **Principle 3**: Best practices\n\n## 3. How It Works\nThe mechanism of ${topic} involves several steps:\n1. Step one: Initialize\n2. Step two: Process\n3. Step three: Output\n\n## 4. Examples\n\n### Example 1: Basic Usage\n\`\`\`\n// Example code for ${topic}\nfunction example() {\n  // Implementation\n}\n\`\`\`\n\n### Example 2: Advanced Usage\n\`\`\`\n// Advanced ${topic} implementation\nclass Advanced {\n  // Implementation\n}\n\`\`\`\n\n## 5. Best Practices\n- Always follow coding standards\n- Write clean, readable code\n- Test thoroughly\n\n## 6. Common Mistakes\n- Mistake 1: Incorrect implementation\n- Mistake 2: Not handling edge cases\n\n## 7. Summary\n${topic} is essential for ${input.subject}. Key takeaways include understanding the fundamentals, applying best practices, and continuous learning.\n\n## 8. References\n- Official documentation\n- Community resources\n- Practice exercises`,
            metadata: {
                wordCount: 250,
                readingTime: '3 minutes',
                sections: 8,
            },
        };
    }
}
exports.MockAIMaterialGenerator = MockAIMaterialGenerator;
function createAIMaterialGenerator(provider) {
    switch (provider) {
        case 'mock':
            return new MockAIMaterialGenerator();
        default:
            return new MockAIMaterialGenerator();
    }
}
//# sourceMappingURL=ai-material.provider.js.map