import { TestStatus, SubmissionStatus } from '../types';
export declare class TestService {
    createTest(data: {
        title: string;
        description?: string;
        instructions?: string;
        subjectId: string;
        skillId?: string;
        topicId?: string;
        duration: number;
        maxAttempts?: number;
        startDate?: string;
        endDate?: string;
        passingScore?: number;
        shuffleQuestions?: boolean;
        showResult?: boolean;
        questionIds?: string[];
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
        _count: {
            assignments: number;
        };
        createdBy: {
            firstName: string;
            lastName: string;
        };
        testQuestions: ({
            question: {
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
            };
        } & {
            id: string;
            createdAt: Date;
            marks: number | null;
            sortOrder: number;
            questionId: string;
            testId: string;
        })[];
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
    }>;
    getTests(params: {
        page?: number;
        limit?: number;
        status?: TestStatus;
        subjectId?: string;
        search?: string;
        createdById?: string;
    }): Promise<{
        tests: ({
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
                testQuestions: number;
                assignments: number;
            };
            createdBy: {
                firstName: string;
                lastName: string;
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
        })[];
        total: number;
        page: number;
        limit: number;
    }>;
    getTestById(id: string): Promise<{
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
        testQuestions: ({
            question: {
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
            };
        } & {
            id: string;
            createdAt: Date;
            marks: number | null;
            sortOrder: number;
            questionId: string;
            testId: string;
        })[];
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
    }>;
    updateTest(id: string, data: any, updaterId: string): Promise<{
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
        testQuestions: ({
            question: {
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
            };
        } & {
            id: string;
            createdAt: Date;
            marks: number | null;
            sortOrder: number;
            questionId: string;
            testId: string;
        })[];
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
    }>;
    publishTest(id: string, userId: string): Promise<{
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
    }>;
    assignTest(testId: string, data: {
        studentIds?: string[];
        batchId?: string;
        departmentId?: string;
        startDate?: string;
        endDate?: string;
    }, assignerId: string): Promise<{
        assigned: number;
        skipped: number;
    }>;
    getAssignments(params: {
        testId?: string;
        studentId?: string;
        status?: SubmissionStatus;
        page?: number;
        limit?: number;
    }): Promise<{
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
            student: {
                user: {
                    email: string;
                    firstName: string;
                    lastName: string;
                };
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
        total: number;
        page: number;
        limit: number;
    }>;
    getStudentAssignments(studentId: string): Promise<({
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
    })[]>;
    startTest(testOrAssignmentId: string, studentId: string): Promise<{
        submission: {
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
        };
        test: {
            testQuestions: ({
                question: {
                    options: {
                        id: string;
                        createdAt: Date;
                        optionText: string;
                        isCorrect: boolean;
                        sortOrder: number;
                        questionId: string;
                    }[];
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
                };
            } & {
                id: string;
                createdAt: Date;
                marks: number | null;
                sortOrder: number;
                questionId: string;
                testId: string;
            })[];
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
        answers: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            isCorrect: boolean | null;
            questionId: string;
            timeSpent: number | null;
            submissionId: string;
            answer: string | null;
            selectedOptionId: string | null;
            marksObtained: number | null;
            isMarkedForReview: boolean;
            answeredAt: Date | null;
        }[];
    } | {
        submission: {
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
        };
        test: {
            testQuestions: {
                question: {
                    correctAnswer: undefined;
                    explanation: undefined;
                    options: {
                        id: string;
                        optionText: string;
                        sortOrder: number;
                        questionId: string;
                    }[];
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
                    isAIGenerated: boolean;
                    topicId: string | null;
                    createdById: string;
                };
                id: string;
                createdAt: Date;
                marks: number | null;
                sortOrder: number;
                questionId: string;
                testId: string;
            }[];
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
        answers: never[];
    }>;
    saveAnswer(submissionOrTestId: string, studentId: string, data: {
        questionId: string;
        answer?: string;
        selectedOptionId?: string;
        isMarkedForReview?: boolean;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isCorrect: boolean | null;
        questionId: string;
        timeSpent: number | null;
        submissionId: string;
        answer: string | null;
        selectedOptionId: string | null;
        marksObtained: number | null;
        isMarkedForReview: boolean;
        answeredAt: Date | null;
    }>;
    submitTest(submissionOrTestId: string, studentId: string): Promise<{
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
        };
        timeSpent: number;
        hasManualQuestions: boolean;
        submission: ({
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
            answers: ({
                question: {
                    options: {
                        id: string;
                        createdAt: Date;
                        optionText: string;
                        isCorrect: boolean;
                        sortOrder: number;
                        questionId: string;
                    }[];
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
                };
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                isCorrect: boolean | null;
                questionId: string;
                timeSpent: number | null;
                submissionId: string;
                answer: string | null;
                selectedOptionId: string | null;
                marksObtained: number | null;
                isMarkedForReview: boolean;
                answeredAt: Date | null;
            })[];
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
        }) | null;
    }>;
    getTestResult(submissionOrTestId: string, studentId?: string): Promise<{
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
                subject: {
                    code: string;
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    name: string;
                    isActive: boolean;
                    description: string | null;
                };
                testQuestions: ({
                    question: {
                        options: {
                            id: string;
                            createdAt: Date;
                            optionText: string;
                            isCorrect: boolean;
                            sortOrder: number;
                            questionId: string;
                        }[];
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
                    };
                } & {
                    id: string;
                    createdAt: Date;
                    marks: number | null;
                    sortOrder: number;
                    questionId: string;
                    testId: string;
                })[];
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
            student: {
                user: {
                    email: string;
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
        answers: ({
            question: {
                options: {
                    id: string;
                    createdAt: Date;
                    optionText: string;
                    isCorrect: boolean;
                    sortOrder: number;
                    questionId: string;
                }[];
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
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            isCorrect: boolean | null;
            questionId: string;
            timeSpent: number | null;
            submissionId: string;
            answer: string | null;
            selectedOptionId: string | null;
            marksObtained: number | null;
            isMarkedForReview: boolean;
            answeredAt: Date | null;
        })[];
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
    }>;
    evaluateAnswer(answerId: string, data: {
        marksObtained: number;
        isCorrect: boolean;
        feedback?: string;
    }, evaluatorId: string): Promise<{
        message: string;
    }>;
}
export declare const testService: TestService;
//# sourceMappingURL=test.service.d.ts.map