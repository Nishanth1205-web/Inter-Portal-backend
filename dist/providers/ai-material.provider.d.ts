import { MaterialType } from '../types';
export interface AIGeneratedMaterial {
    title: string;
    description: string;
    content: string;
    type: MaterialType;
    metadata?: any;
}
export interface AIMaterialGenerateInput {
    subject: string;
    skill?: string;
    topic?: string;
    difficulty?: string;
    learningObjective?: string;
    studentLevel?: string;
    type: MaterialType;
}
export interface IAIMaterialGenerator {
    generate(input: AIMaterialGenerateInput): Promise<AIGeneratedMaterial>;
}
export declare class MockAIMaterialGenerator implements IAIMaterialGenerator {
    generate(input: AIMaterialGenerateInput): Promise<AIGeneratedMaterial>;
    private generatePPT;
    private generateVideo;
    private generateImage;
    private generateDocument;
}
export declare function createAIMaterialGenerator(provider: string): IAIMaterialGenerator;
//# sourceMappingURL=ai-material.provider.d.ts.map