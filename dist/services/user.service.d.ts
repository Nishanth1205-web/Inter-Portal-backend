import { Role } from '../types';
export declare class UserService {
    createUser(data: {
        email: string;
        password: string;
        firstName: string;
        lastName: string;
        role: Role;
        phone?: string;
        departmentId?: string;
        batchId?: string;
        enrollmentNo?: string;
        designation?: string;
    }, creatorId?: string): Promise<{
        id: string;
        email: string;
        role: string;
        firstName: string;
        lastName: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        avatar: string | null;
        phone: string | null;
        lastLoginAt: Date | null;
    }>;
    getUsers(params: {
        page?: number;
        limit?: number;
        role?: Role;
        search?: string;
        isActive?: boolean;
        departmentId?: string;
        batchId?: string;
    }): Promise<{
        users: {
            id: string;
            email: string;
            role: string;
            firstName: string;
            lastName: string;
            createdAt: Date;
            student: ({
                department: {
                    code: string;
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    name: string;
                    isActive: boolean;
                    description: string | null;
                };
                batch: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    name: string;
                    isActive: boolean;
                    year: number;
                };
            } & {
                id: string;
                userId: string;
                enrollmentNo: string;
                departmentId: string;
                batchId: string;
                semester: number | null;
                createdAt: Date;
                updatedAt: Date;
            }) | null;
            isActive: boolean;
            phone: string | null;
            lastLoginAt: Date | null;
            admin: {
                id: string;
                userId: string;
                createdAt: Date;
                updatedAt: Date;
                designation: string | null;
            } | null;
        }[];
        total: number;
        page: number;
        limit: number;
    }>;
    getUserById(id: string): Promise<{
        id: string;
        email: string;
        role: string;
        firstName: string;
        lastName: string;
        createdAt: Date;
        updatedAt: Date;
        student: ({
            department: {
                code: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                isActive: boolean;
                description: string | null;
            };
            batch: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                isActive: boolean;
                year: number;
            };
        } & {
            id: string;
            userId: string;
            enrollmentNo: string;
            departmentId: string;
            batchId: string;
            semester: number | null;
            createdAt: Date;
            updatedAt: Date;
        }) | null;
        isActive: boolean;
        avatar: string | null;
        phone: string | null;
        lastLoginAt: Date | null;
        admin: {
            id: string;
            userId: string;
            createdAt: Date;
            updatedAt: Date;
            designation: string | null;
        } | null;
    }>;
    updateUser(id: string, data: any, updaterId: string): Promise<{
        id: string;
        email: string;
        role: string;
        firstName: string;
        lastName: string;
        createdAt: Date;
        isActive: boolean;
        phone: string | null;
    }>;
    deleteUser(id: string, deleterId: string): Promise<{
        message: string;
    }>;
    getDepartments(): Promise<{
        code: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        isActive: boolean;
        description: string | null;
    }[]>;
    createDepartment(data: {
        name: string;
        code: string;
        description?: string;
    }): Promise<{
        code: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        isActive: boolean;
        description: string | null;
    }>;
    updateDepartment(id: string, data: any): Promise<{
        code: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        isActive: boolean;
        description: string | null;
    }>;
    deleteDepartment(id: string): Promise<{
        code: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        isActive: boolean;
        description: string | null;
    }>;
    getBatches(): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        isActive: boolean;
        year: number;
    }[]>;
    createBatch(data: {
        name: string;
        year: number;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        isActive: boolean;
        year: number;
    }>;
    updateBatch(id: string, data: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        isActive: boolean;
        year: number;
    }>;
    deleteBatch(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        isActive: boolean;
        year: number;
    }>;
    getSubjects(): Promise<({
        skills: ({
            topics: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                isActive: boolean;
                description: string | null;
                skillId: string;
            }[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            isActive: boolean;
            description: string | null;
            subjectId: string;
        })[];
    } & {
        code: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        isActive: boolean;
        description: string | null;
    })[]>;
    createSubject(data: {
        name: string;
        code: string;
        description?: string;
    }): Promise<{
        code: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        isActive: boolean;
        description: string | null;
    }>;
    updateSubject(id: string, data: any): Promise<{
        code: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        isActive: boolean;
        description: string | null;
    }>;
    getSkills(subjectId?: string): Promise<({
        subject: {
            code: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            isActive: boolean;
            description: string | null;
        };
        topics: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            isActive: boolean;
            description: string | null;
            skillId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        isActive: boolean;
        description: string | null;
        subjectId: string;
    })[]>;
    createSkill(data: {
        name: string;
        subjectId: string;
        description?: string;
    }): Promise<{
        subject: {
            code: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            isActive: boolean;
            description: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        isActive: boolean;
        description: string | null;
        subjectId: string;
    }>;
    getTopics(skillId?: string): Promise<({
        skill: {
            subject: {
                code: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                isActive: boolean;
                description: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            isActive: boolean;
            description: string | null;
            subjectId: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        isActive: boolean;
        description: string | null;
        skillId: string;
    })[]>;
    createTopic(data: {
        name: string;
        skillId: string;
        description?: string;
    }): Promise<{
        skill: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            isActive: boolean;
            description: string | null;
            subjectId: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        isActive: boolean;
        description: string | null;
        skillId: string;
    }>;
}
export declare const userService: UserService;
//# sourceMappingURL=user.service.d.ts.map