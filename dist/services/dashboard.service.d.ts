export declare class DashboardService {
    getSuperAdminDashboard(): Promise<{
        stats: {
            totalStudents: number;
            totalAdmins: number;
            totalQuestions: number;
            totalTests: number;
            assignedTests: number;
            completedSubmissions: number;
            pendingSubmissions: number;
            totalMaterials: number;
            activeStudents: number;
        };
        recentSubmissions: ({
            result: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                totalMarks: number;
                submissionId: string;
                obtainedMarks: number;
                percentage: number;
                isPassed: boolean | null;
                feedback: string | null;
                evaluatedAt: Date | null;
                evaluatedById: string | null;
            } | null;
            assignment: {
                test: {
                    title: string;
                };
                student: {
                    user: {
                        firstName: string;
                        lastName: string;
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
                };
            } & {
                status: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                startDate: Date | null;
                endDate: Date | null;
                testId: string;
                studentId: string;
                assignedAt: Date;
                attemptCount: number;
            };
        } & {
            status: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            attemptNumber: number;
            assignmentId: string;
            startedAt: Date;
            submittedAt: Date | null;
            lastActivityAt: Date;
            timeSpent: number | null;
        })[];
        recentActivities: ({
            assignment: {
                student: {
                    user: {
                        firstName: string;
                        lastName: string;
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
                };
                material: {
                    type: string;
                    title: string;
                };
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                studentId: string;
                assignedAt: Date;
                materialId: string;
            };
        } & {
            id: string;
            createdAt: Date;
            assignmentId: string;
            timeSpent: number | null;
            accessedAt: Date;
            isCompleted: boolean;
            completedAt: Date | null;
            progress: number;
        })[];
        charts: {
            testCompletionByMonth: {
                month: string;
                count: number;
            }[];
            subjectPerformance: {
                subject: string;
                avg_score: number;
                test_count: number;
            }[];
        };
    }>;
    getAdminDashboard(adminId: string): Promise<{
        stats: {
            totalTests: number;
            totalAssignments: number;
            pendingEvaluations: number;
        };
        recentSubmissions: ({
            result: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                totalMarks: number;
                submissionId: string;
                obtainedMarks: number;
                percentage: number;
                isPassed: boolean | null;
                feedback: string | null;
                evaluatedAt: Date | null;
                evaluatedById: string | null;
            } | null;
            assignment: {
                test: {
                    title: string;
                };
                student: {
                    user: {
                        firstName: string;
                        lastName: string;
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
                };
            } & {
                status: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                startDate: Date | null;
                endDate: Date | null;
                testId: string;
                studentId: string;
                assignedAt: Date;
                attemptCount: number;
            };
        } & {
            status: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            attemptNumber: number;
            assignmentId: string;
            startedAt: Date;
            submittedAt: Date | null;
            lastActivityAt: Date;
            timeSpent: number | null;
        })[];
    }>;
    getStudentDashboard(studentId: string): Promise<{
        assessment: {
            totalTests: number;
            completedTests: number;
            pendingTests: number;
            upcomingTests: number;
            averageScore: number;
            assignments: ({
                test: {
                    subject: {
                        code: string;
                        id: string;
                        createdAt: Date;
                        updatedAt: Date;
                        name: string;
                        isActive: boolean;
                        description: string | null;
                    };
                    _count: {
                        testQuestions: number;
                    };
                } & {
                    status: string;
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    description: string | null;
                    subjectId: string;
                    skillId: string | null;
                    topicId: string | null;
                    createdById: string;
                    title: string;
                    instructions: string | null;
                    totalMarks: number;
                    duration: number;
                    startDate: Date | null;
                    endDate: Date | null;
                    maxAttempts: number;
                    passingScore: number | null;
                    shuffleQuestions: boolean;
                    showResult: boolean;
                };
                submissions: ({
                    result: {
                        id: string;
                        createdAt: Date;
                        updatedAt: Date;
                        totalMarks: number;
                        submissionId: string;
                        obtainedMarks: number;
                        percentage: number;
                        isPassed: boolean | null;
                        feedback: string | null;
                        evaluatedAt: Date | null;
                        evaluatedById: string | null;
                    } | null;
                } & {
                    status: string;
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    attemptNumber: number;
                    assignmentId: string;
                    startedAt: Date;
                    submittedAt: Date | null;
                    lastActivityAt: Date;
                    timeSpent: number | null;
                })[];
            } & {
                status: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                startDate: Date | null;
                endDate: Date | null;
                testId: string;
                studentId: string;
                assignedAt: Date;
                attemptCount: number;
            })[];
        };
        learning: {
            totalMaterials: number;
            completedMaterials: number;
            materials: ({
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
            })[];
            recentActivities: ({
                assignment: {
                    material: {
                        type: string;
                        title: string;
                    };
                } & {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    studentId: string;
                    assignedAt: Date;
                    materialId: string;
                };
            } & {
                id: string;
                createdAt: Date;
                assignmentId: string;
                timeSpent: number | null;
                accessedAt: Date;
                isCompleted: boolean;
                completedAt: Date | null;
                progress: number;
            })[];
        };
        progress: {
            testsCompleted: number;
            testsTotal: number;
            averageScore: number;
            materialsCompleted: number;
            materialsTotal: number;
        };
    }>;
    getLiveStats(): Promise<{
        activeStudentsCount: number;
        activeTestsCount: number;
    }>;
}
export declare const dashboardService: DashboardService;
//# sourceMappingURL=dashboard.service.d.ts.map