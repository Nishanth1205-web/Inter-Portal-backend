"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dashboardService = exports.DashboardService = void 0;
const config_1 = require("../config");
class DashboardService {
    async getSuperAdminDashboard() {
        const [totalStudents, totalAdmins, totalQuestions, totalTests, assignedTests, completedSubmissions, pendingSubmissions, totalMaterials, activeStudents, recentSubmissions, recentActivities,] = await Promise.all([
            config_1.prisma.student.count(),
            config_1.prisma.admin.count(),
            config_1.prisma.question.count({ where: { isActive: true } }),
            config_1.prisma.test.count(),
            config_1.prisma.testAssignment.count(),
            config_1.prisma.testSubmission.count({ where: { status: 'EVALUATED' } }),
            config_1.prisma.testAssignment.count({ where: { status: { in: ['NOT_STARTED', 'IN_PROGRESS'] } } }),
            config_1.prisma.learningMaterial.count({ where: { isActive: true } }),
            config_1.prisma.user.count({ where: { role: 'STUDENT', isActive: true, lastLoginAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } } }),
            config_1.prisma.testSubmission.findMany({
                take: 10,
                orderBy: { submittedAt: 'desc' },
                where: { submittedAt: { not: null } },
                include: {
                    assignment: {
                        include: {
                            student: { include: { user: { select: { firstName: true, lastName: true } } } },
                            test: { select: { title: true } },
                        },
                    },
                    result: true,
                },
            }),
            config_1.prisma.learningActivity.findMany({
                take: 10,
                orderBy: { accessedAt: 'desc' },
                include: {
                    assignment: {
                        include: {
                            student: { include: { user: { select: { firstName: true, lastName: true } } } },
                            material: { select: { title: true, type: true } },
                        },
                    },
                },
            }),
        ]);
        // Chart data: Test completion by month (last 6 months)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        const submissions = await config_1.prisma.testSubmission.findMany({
            where: {
                submittedAt: { gte: sixMonthsAgo },
            },
            select: { submittedAt: true },
        });
        const monthCounts = {};
        for (const sub of submissions) {
            if (sub.submittedAt) {
                const key = sub.submittedAt.toISOString().slice(0, 7); // 'YYYY-MM'
                monthCounts[key] = (monthCounts[key] || 0) + 1;
            }
        }
        const testCompletionByMonth = Object.entries(monthCounts)
            .map(([month, count]) => ({ month, count }))
            .sort((a, b) => a.month.localeCompare(b.month));
        // Subject performance
        const results = await config_1.prisma.testResult.findMany({
            include: {
                submission: {
                    include: {
                        assignment: {
                            include: {
                                test: {
                                    include: {
                                        subject: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });
        const subjectMap = {};
        for (const r of results) {
            const subjName = r.submission?.assignment?.test?.subject?.name || 'General';
            if (!subjectMap[subjName]) {
                subjectMap[subjName] = { total: 0, count: 0 };
            }
            subjectMap[subjName].total += r.percentage;
            subjectMap[subjName].count += 1;
        }
        const subjectPerformance = Object.entries(subjectMap)
            .map(([subject, data]) => ({
            subject,
            avg_score: Math.round((data.total / data.count) * 10) / 10,
            test_count: data.count,
        }))
            .sort((a, b) => b.avg_score - a.avg_score);
        return {
            stats: {
                totalStudents,
                totalAdmins,
                totalQuestions,
                totalTests,
                assignedTests,
                completedSubmissions,
                pendingSubmissions,
                totalMaterials,
                activeStudents,
            },
            recentSubmissions,
            recentActivities,
            charts: {
                testCompletionByMonth,
                subjectPerformance,
            },
        };
    }
    async getAdminDashboard(adminId) {
        const [totalTests, totalAssignments, pendingEvaluations, recentSubmissions] = await Promise.all([
            config_1.prisma.test.count({ where: { createdById: adminId } }),
            config_1.prisma.testAssignment.count({
                where: { test: { createdById: adminId } },
            }),
            config_1.prisma.testSubmission.count({
                where: { status: 'SUBMITTED', assignment: { test: { createdById: adminId } } },
            }),
            config_1.prisma.testSubmission.findMany({
                take: 10,
                orderBy: { submittedAt: 'desc' },
                where: { submittedAt: { not: null }, assignment: { test: { createdById: adminId } } },
                include: {
                    assignment: {
                        include: {
                            student: { include: { user: { select: { firstName: true, lastName: true } } } },
                            test: { select: { title: true } },
                        },
                    },
                    result: true,
                },
            }),
        ]);
        return {
            stats: { totalTests, totalAssignments, pendingEvaluations },
            recentSubmissions,
        };
    }
    async getStudentDashboard(studentId) {
        const [assignments, materialAssignments, recentActivities,] = await Promise.all([
            config_1.prisma.testAssignment.findMany({
                where: { studentId },
                include: {
                    test: { include: { subject: true, _count: { select: { testQuestions: true } } } },
                    submissions: {
                        include: { result: true },
                        orderBy: { attemptNumber: 'desc' },
                    },
                },
                orderBy: { assignedAt: 'desc' },
            }),
            config_1.prisma.materialAssignment.findMany({
                where: { studentId },
                include: {
                    material: { include: { subject: true } },
                    activities: { orderBy: { accessedAt: 'desc' }, take: 1 },
                },
            }),
            config_1.prisma.learningActivity.findMany({
                where: { assignment: { studentId } },
                take: 10,
                orderBy: { accessedAt: 'desc' },
                include: {
                    assignment: { include: { material: { select: { title: true, type: true } } } },
                },
            }),
        ]);
        // Compute stats
        const totalTests = assignments.length;
        const completedTests = assignments.filter(a => a.status === 'EVALUATED' || a.status === 'SUBMITTED').length;
        const pendingTests = assignments.filter(a => a.status === 'NOT_STARTED' || a.status === 'IN_PROGRESS').length;
        const upcomingTests = assignments.filter(a => {
            const start = a.startDate || a.test.startDate;
            return start && new Date(start) > new Date() && a.status === 'NOT_STARTED';
        }).length;
        const scores = assignments
            .flatMap(a => a.submissions)
            .filter(s => s.result)
            .map(s => s.result.percentage);
        const averageScore = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
        const totalMaterials = materialAssignments.length;
        const completedMaterials = materialAssignments.filter(ma => ma.activities.some(a => a.isCompleted)).length;
        return {
            assessment: {
                totalTests,
                completedTests,
                pendingTests,
                upcomingTests,
                averageScore: Math.round(averageScore * 10) / 10,
                assignments,
            },
            learning: {
                totalMaterials,
                completedMaterials,
                materials: materialAssignments,
                recentActivities,
            },
            progress: {
                testsCompleted: completedTests,
                testsTotal: totalTests,
                averageScore: Math.round(averageScore * 10) / 10,
                materialsCompleted: completedMaterials,
                materialsTotal: totalMaterials,
            },
        };
    }
    async getLiveStats() {
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
        const fifteenMinsAgo = new Date(Date.now() - 15 * 60 * 1000);
        const [activeStudentsCount, activeTestsCount] = await Promise.all([
            // Consider a student "online" if they logged in recently
            config_1.prisma.user.count({
                where: {
                    role: 'STUDENT',
                    lastLoginAt: { gte: oneHourAgo }
                }
            }),
            // Active tests currently in progress
            config_1.prisma.testSubmission.count({
                where: {
                    status: 'IN_PROGRESS',
                    lastActivityAt: { gte: fifteenMinsAgo }
                }
            })
        ]);
        return {
            activeStudentsCount,
            activeTestsCount
        };
    }
}
exports.DashboardService = DashboardService;
exports.dashboardService = new DashboardService();
//# sourceMappingURL=dashboard.service.js.map