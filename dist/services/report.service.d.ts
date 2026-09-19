export declare class ReportService {
    getStudentReport(params: {
        studentId?: string;
        departmentId?: string;
        batchId?: string;
        subjectId?: string;
        dateFrom?: string;
        dateTo?: string;
        page?: number;
        limit?: number;
    }): Promise<{
        report: {
            studentId: string;
            name: string;
            email: string;
            enrollmentNo: string;
            department: string;
            batch: string;
            testsAssigned: number;
            testsCompleted: number;
            testsPending: number;
            averageScore: number;
            materialsAssigned: number;
            materialsAccessed: number;
            materialsCompleted: number;
        }[];
        total: number;
        page: number;
        limit: number;
    }>;
    getTestReport(params: {
        testId?: string;
        subjectId?: string;
        status?: string;
        dateFrom?: string;
        dateTo?: string;
        page?: number;
        limit?: number;
    }): Promise<{
        report: {
            testId: string;
            testName: string;
            subject: string;
            status: string;
            totalMarks: number;
            assignedStudents: number;
            attemptedStudents: number;
            submittedStudents: number;
            pendingStudents: number;
            averageScore: number;
            completionPercentage: number;
        }[];
        total: number;
        page: number;
        limit: number;
    }>;
    exportCSV(data: any[], headers: string[]): Promise<string>;
    exportExcel(data: any[], headers: string[], sheetName?: string): Promise<Buffer>;
    exportPDF(data: any[], headers: string[], title?: string): Promise<Buffer>;
    private getNestedValue;
}
export declare const reportService: ReportService;
//# sourceMappingURL=report.service.d.ts.map