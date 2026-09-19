import { MaterialType } from '../types';
export declare class MaterialService {
    private aiGenerator;
    generateMaterial(data: {
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
    }, createdById: string): Promise<{
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
        type: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        description: string | null;
        subjectId: string;
        skillId: string | null;
        isAIGenerated: boolean;
        topicId: string | null;
        createdById: string;
        title: string;
        content: string | null;
        fileUrl: string | null;
        fileName: string | null;
        fileSize: number | null;
        mimeType: string | null;
        metadata: string | null;
    }>;
    createMaterial(data: {
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
    }, createdById: string): Promise<{
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
        type: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        description: string | null;
        subjectId: string;
        skillId: string | null;
        isAIGenerated: boolean;
        topicId: string | null;
        createdById: string;
        title: string;
        content: string | null;
        fileUrl: string | null;
        fileName: string | null;
        fileSize: number | null;
        mimeType: string | null;
        metadata: string | null;
    }>;
    getMaterials(params: {
        page?: number;
        limit?: number;
        search?: string;
        type?: MaterialType;
        subjectId?: string;
        skillId?: string;
        topicId?: string;
    }): Promise<{
        materials: ({
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
            _count: {
                assignments: number;
            };
            createdBy: {
                firstName: string;
                lastName: string;
            };
        } & {
            type: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            isActive: boolean;
            description: string | null;
            subjectId: string;
            skillId: string | null;
            isAIGenerated: boolean;
            topicId: string | null;
            createdById: string;
            title: string;
            content: string | null;
            fileUrl: string | null;
            fileName: string | null;
            fileSize: number | null;
            mimeType: string | null;
            metadata: string | null;
        })[];
        total: number;
        page: number;
        limit: number;
    }>;
    getMaterialById(id: string): Promise<{
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
        type: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        description: string | null;
        subjectId: string;
        skillId: string | null;
        isAIGenerated: boolean;
        topicId: string | null;
        createdById: string;
        title: string;
        content: string | null;
        fileUrl: string | null;
        fileName: string | null;
        fileSize: number | null;
        mimeType: string | null;
        metadata: string | null;
    }>;
    updateMaterial(id: string, data: any, updaterId: string): Promise<{
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
        type: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        description: string | null;
        subjectId: string;
        skillId: string | null;
        isAIGenerated: boolean;
        topicId: string | null;
        createdById: string;
        title: string;
        content: string | null;
        fileUrl: string | null;
        fileName: string | null;
        fileSize: number | null;
        mimeType: string | null;
        metadata: string | null;
    }>;
    deleteMaterial(id: string, deleterId: string): Promise<{
        message: string;
    }>;
    mapMaterial(materialId: string, data: {
        studentIds?: string[];
        batchId?: string;
        departmentId?: string;
    }, mapperId: string): Promise<{
        mapped: number;
        skipped: number;
    }>;
    getStudentMaterials(studentId: string): Promise<({
        material: {
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
            type: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            isActive: boolean;
            description: string | null;
            subjectId: string;
            skillId: string | null;
            isAIGenerated: boolean;
            topicId: string | null;
            createdById: string;
            title: string;
            content: string | null;
            fileUrl: string | null;
            fileName: string | null;
            fileSize: number | null;
            mimeType: string | null;
            metadata: string | null;
        };
        activities: {
            id: string;
            createdAt: Date;
            assignmentId: string;
            timeSpent: number | null;
            accessedAt: Date;
            isCompleted: boolean;
            completedAt: Date | null;
            progress: number;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        studentId: string;
        assignedAt: Date;
        materialId: string;
    })[]>;
    getStudentMaterialById(materialId: string, studentId: string): Promise<{
        material: {
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
            type: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            isActive: boolean;
            description: string | null;
            subjectId: string;
            skillId: string | null;
            isAIGenerated: boolean;
            topicId: string | null;
            createdById: string;
            title: string;
            content: string | null;
            fileUrl: string | null;
            fileName: string | null;
            fileSize: number | null;
            mimeType: string | null;
            metadata: string | null;
        };
        activities: {
            id: string;
            createdAt: Date;
            assignmentId: string;
            timeSpent: number | null;
            accessedAt: Date;
            isCompleted: boolean;
            completedAt: Date | null;
            progress: number;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        studentId: string;
        assignedAt: Date;
        materialId: string;
    }>;
    recordActivity(materialId: string, studentId: string, data: {
        timeSpent?: number;
        progress?: number;
        isCompleted?: boolean;
    }): Promise<{
        id: string;
        createdAt: Date;
        assignmentId: string;
        timeSpent: number | null;
        accessedAt: Date;
        isCompleted: boolean;
        completedAt: Date | null;
        progress: number;
    }>;
}
export declare const materialService: MaterialService;
//# sourceMappingURL=material.service.d.ts.map