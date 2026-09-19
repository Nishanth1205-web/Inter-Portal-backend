import { prisma } from '../config';
import ExcelJS from 'exceljs';
import PDFDocument from 'pdfkit';
import { Prisma } from '@prisma/client';

export class ReportService {
  async getStudentReport(params: {
    studentId?: string;
    departmentId?: string;
    batchId?: string;
    subjectId?: string;
    dateFrom?: string;
    dateTo?: string;
    page?: number;
    limit?: number;
  }) {
    const { page = 1, limit = 20 } = params;
    const skip = (page - 1) * limit;

    const where: Prisma.StudentWhereInput = {};
    if (params.studentId) where.id = params.studentId;
    if (params.departmentId) where.departmentId = params.departmentId;
    if (params.batchId) where.batchId = params.batchId;

    const [students, total] = await Promise.all([
      prisma.student.findMany({
        where,
        skip,
        take: limit,
        include: {
          user: { select: { firstName: true, lastName: true, email: true } },
          department: true,
          batch: true,
          testAssignments: {
            include: {
              test: { select: { title: true, subjectId: true } },
              submissions: { include: { result: true } },
            },
            ...(params.subjectId ? { where: { test: { subjectId: params.subjectId } } } : {}),
          },
          materialAssignments: {
            include: {
              material: { select: { title: true, type: true } },
              activities: true,
            },
          },
        },
      }),
      prisma.student.count({ where }),
    ]);

    const report = students.map(student => {
      const tests = student.testAssignments;
      const materials = student.materialAssignments;

      const completedTests = tests.filter(t => t.status === 'EVALUATED' || t.status === 'SUBMITTED');
      const scores = tests
        .flatMap(t => t.submissions)
        .filter(s => s.result)
        .map(s => s.result!.percentage);
      const avgScore = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;

      const accessedMaterials = materials.filter(m => m.activities.length > 0);
      const completedMaterials = materials.filter(m => m.activities.some(a => a.isCompleted));

      return {
        studentId: student.id,
        name: `${student.user.firstName} ${student.user.lastName}`,
        email: student.user.email,
        enrollmentNo: student.enrollmentNo,
        department: student.department.name,
        batch: student.batch.name,
        testsAssigned: tests.length,
        testsCompleted: completedTests.length,
        testsPending: tests.length - completedTests.length,
        averageScore: Math.round(avgScore * 10) / 10,
        materialsAssigned: materials.length,
        materialsAccessed: accessedMaterials.length,
        materialsCompleted: completedMaterials.length,
      };
    });

    return { report, total, page, limit };
  }

  async getTestReport(params: {
    testId?: string;
    subjectId?: string;
    status?: string;
    dateFrom?: string;
    dateTo?: string;
    page?: number;
    limit?: number;
  }) {
    const { page = 1, limit = 20 } = params;
    const skip = (page - 1) * limit;

    const where: Prisma.TestWhereInput = {};
    if (params.testId) where.id = params.testId;
    if (params.subjectId) where.subjectId = params.subjectId;
    if (params.status) where.status = params.status as any;

    const [tests, total] = await Promise.all([
      prisma.test.findMany({
        where,
        skip,
        take: limit,
        include: {
          subject: true,
          assignments: {
            include: {
              submissions: { include: { result: true } },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.test.count({ where }),
    ]);

    const report = tests.map(test => {
      const assigned = test.assignments.length;
      const attempted = test.assignments.filter(a => a.attemptCount > 0).length;
      const submitted = test.assignments.filter(a => a.status === 'SUBMITTED' || a.status === 'EVALUATED').length;
      const pending = assigned - submitted;
      const scores = test.assignments
        .flatMap(a => a.submissions)
        .filter(s => s.result)
        .map(s => s.result!.percentage);
      const avgScore = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;

      return {
        testId: test.id,
        testName: test.title,
        subject: test.subject.name,
        status: test.status,
        totalMarks: test.totalMarks,
        assignedStudents: assigned,
        attemptedStudents: attempted,
        submittedStudents: submitted,
        pendingStudents: pending,
        averageScore: Math.round(avgScore * 10) / 10,
        completionPercentage: assigned > 0 ? Math.round((submitted / assigned) * 100) : 0,
      };
    });

    return { report, total, page, limit };
  }

  async exportCSV(data: any[], headers: string[]): Promise<string> {
    const rows = [headers.join(',')];
    for (const item of data) {
      const row = headers.map(h => {
        const key = h.toLowerCase().replace(/ /g, '');
        const val = this.getNestedValue(item, key);
        const strVal = String(val ?? '');
        return strVal.includes(',') ? `"${strVal}"` : strVal;
      });
      rows.push(row.join(','));
    }
    return rows.join('\n');
  }

  async exportExcel(data: any[], headers: string[], sheetName = 'Report'): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(sheetName);

    // Header row
    worksheet.addRow(headers);
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF4472C4' },
    };
    worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };

    // Data rows
    for (const item of data) {
      const row = headers.map(h => {
        const key = h.toLowerCase().replace(/ /g, '');
        return this.getNestedValue(item, key) ?? '';
      });
      worksheet.addRow(row);
    }

    // Auto width
    worksheet.columns.forEach(col => {
      let maxLength = 10;
      col.eachCell?.({ includeEmpty: true }, (cell) => {
        const len = cell.value ? String(cell.value).length : 0;
        if (len > maxLength) maxLength = len;
      });
      col.width = Math.min(maxLength + 2, 50);
    });

    const buffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(buffer);
  }

  async exportPDF(data: any[], headers: string[], title = 'Report'): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ margin: 30, size: 'A4', layout: 'landscape' });
      const chunks: Buffer[] = [];

      doc.on('data', (chunk: Buffer) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      // Title
      doc.fontSize(18).font('Helvetica-Bold').text(title, { align: 'center' });
      doc.moveDown();
      doc.fontSize(10).font('Helvetica').text(`Generated: ${new Date().toLocaleString()}`, { align: 'right' });
      doc.moveDown();

      // Table
      const colWidth = Math.min((doc.page.width - 60) / headers.length, 120);
      const startX = 30;
      let y = doc.y;

      // Headers
      doc.font('Helvetica-Bold').fontSize(8);
      headers.forEach((header, i) => {
        doc.text(header, startX + i * colWidth, y, { width: colWidth - 5, align: 'left' });
      });
      y += 20;
      doc.moveTo(startX, y).lineTo(startX + headers.length * colWidth, y).stroke();
      y += 5;

      // Data
      doc.font('Helvetica').fontSize(7);
      for (const item of data) {
        if (y > doc.page.height - 50) {
          doc.addPage();
          y = 30;
        }
        headers.forEach((header, i) => {
          const key = header.toLowerCase().replace(/ /g, '');
          const val = String(this.getNestedValue(item, key) ?? '');
          doc.text(val, startX + i * colWidth, y, { width: colWidth - 5, align: 'left' });
        });
        y += 15;
      }

      doc.end();
    });
  }

  private getNestedValue(obj: any, key: string): any {
    // Try exact match first, then camelCase variations
    if (obj[key] !== undefined) return obj[key];
    
    // Try common field name mappings
    const mappings: Record<string, string> = {
      'studentname': 'name',
      'studentid': 'studentId',
      'enrollmentno': 'enrollmentNo',
      'testname': 'testName',
      'testid': 'testId',
      'averagescore': 'averageScore',
      'testsassigned': 'testsAssigned',
      'testscompleted': 'testsCompleted',
      'testspending': 'testsPending',
      'materialsassigned': 'materialsAssigned',
      'materialsaccessed': 'materialsAccessed',
      'materialscompleted': 'materialsCompleted',
      'assignedstudents': 'assignedStudents',
      'attemptedstudents': 'attemptedStudents',
      'submittedstudents': 'submittedStudents',
      'pendingstudents': 'pendingStudents',
      'completionpercentage': 'completionPercentage',
      'totalmarks': 'totalMarks',
    };

    const mapped = mappings[key];
    if (mapped && obj[mapped] !== undefined) return obj[mapped];

    return undefined;
  }
}

export const reportService = new ReportService();
