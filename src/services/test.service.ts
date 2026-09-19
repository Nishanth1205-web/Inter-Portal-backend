import { prisma } from '../config';
import { NotFoundError, BadRequestError, ForbiddenError } from '../utils';
import { createAuditLog } from '../middleware';
import { Prisma } from '@prisma/client';
import { TestStatus, SubmissionStatus } from '../types';

const VALID_TRANSITIONS: Record<TestStatus, TestStatus[]> = {
  DRAFT: ['PUBLISHED'],
  PUBLISHED: ['ASSIGNED', 'DRAFT'],
  ASSIGNED: ['STARTED', 'EXPIRED'],
  STARTED: ['SUBMITTED'],
  SUBMITTED: ['EVALUATED'],
  EVALUATED: ['COMPLETED'],
  COMPLETED: [],
  EXPIRED: [],
};

export class TestService {
  async createTest(data: {
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
  }, createdById: string) {
    const test = await prisma.$transaction(async (tx) => {
      const newTest = await tx.test.create({
        data: {
          title: data.title,
          description: data.description,
          instructions: data.instructions,
          subjectId: data.subjectId,
          skillId: data.skillId,
          topicId: data.topicId,
          duration: data.duration,
          maxAttempts: data.maxAttempts || 1,
          startDate: data.startDate ? new Date(data.startDate) : undefined,
          endDate: data.endDate ? new Date(data.endDate) : undefined,
          passingScore: data.passingScore,
          shuffleQuestions: data.shuffleQuestions || false,
          showResult: data.showResult !== false,
          createdById,
          status: 'DRAFT',
        },
      });

      // Add questions if provided
      if (data.questionIds && data.questionIds.length > 0) {
        let totalMarks = 0;
        const questions = await tx.question.findMany({
          where: { id: { in: data.questionIds } },
        });

        await tx.testQuestion.createMany({
          data: data.questionIds.map((qId, idx) => {
            const q = questions.find(q => q.id === qId);
            totalMarks += q?.marks || 0;
            return {
              testId: newTest.id,
              questionId: qId,
              sortOrder: idx,
              marks: q?.marks,
            };
          }),
        });

        await tx.test.update({
          where: { id: newTest.id },
          data: { totalMarks },
        });
      }

      return newTest;
    });

    await createAuditLog(createdById, 'TEST_CREATED', 'Test', test.id);

    return this.getTestById(test.id);
  }

  async getTests(params: {
    page?: number;
    limit?: number;
    status?: TestStatus;
    subjectId?: string;
    search?: string;
    createdById?: string;
  }) {
    const { page = 1, limit = 10, status, subjectId, search, createdById } = params;
    const skip = (page - 1) * limit;

    const where: Prisma.TestWhereInput = {};
    if (status) where.status = status;
    if (subjectId) where.subjectId = subjectId;
    if (createdById) where.createdById = createdById;
    if (search) {
      where.title = { contains: search };
    }

    const [tests, total] = await Promise.all([
      prisma.test.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          subject: true,
          skill: true,
          topic: true,
          createdBy: { select: { firstName: true, lastName: true } },
          _count: { select: { testQuestions: true, assignments: true } },
        },
      }),
      prisma.test.count({ where }),
    ]);

    return { tests, total, page, limit };
  }

  async getTestById(id: string) {
    const test = await prisma.test.findUnique({
      where: { id },
      include: {
        subject: true,
        skill: true,
        topic: true,
        createdBy: { select: { firstName: true, lastName: true } },
        testQuestions: {
          orderBy: { sortOrder: 'asc' },
          include: {
            question: {
              include: {
                options: { orderBy: { sortOrder: 'asc' } },
                subject: true,
                skill: true,
                topic: true,
              },
            },
          },
        },
        _count: { select: { assignments: true } },
      },
    });

    if (!test) throw new NotFoundError('Test not found');
    return test;
  }

  async updateTest(id: string, data: any, updaterId: string) {
    const test = await prisma.test.findUnique({ where: { id } });
    if (!test) throw new NotFoundError('Test not found');

    if (test.status !== 'DRAFT') {
      throw new BadRequestError('Can only edit tests in DRAFT status');
    }

    const updated = await prisma.$transaction(async (tx) => {
      if (data.questionIds) {
        await tx.testQuestion.deleteMany({ where: { testId: id } });
        
        let totalMarks = 0;
        const questions = await tx.question.findMany({
          where: { id: { in: data.questionIds } },
        });

        await tx.testQuestion.createMany({
          data: data.questionIds.map((qId: string, idx: number) => {
            const q = questions.find(q => q.id === qId);
            totalMarks += q?.marks || 0;
            return {
              testId: id,
              questionId: qId,
              sortOrder: idx,
              marks: q?.marks,
            };
          }),
        });

        data.totalMarks = totalMarks;
      }

      const { questionIds, ...updateData } = data;
      if (updateData.startDate) updateData.startDate = new Date(updateData.startDate);
      if (updateData.endDate) updateData.endDate = new Date(updateData.endDate);

      return tx.test.update({
        where: { id },
        data: updateData,
      });
    });

    await createAuditLog(updaterId, 'TEST_UPDATED', 'Test', id);
    return this.getTestById(id);
  }

  async publishTest(id: string, userId: string) {
    const test = await prisma.test.findUnique({
      where: { id },
      include: { _count: { select: { testQuestions: true } } },
    });
    if (!test) throw new NotFoundError('Test not found');
    if (test.status !== 'DRAFT') throw new BadRequestError('Only draft tests can be published');
    if (test._count.testQuestions === 0) throw new BadRequestError('Cannot publish a test without questions');

    const updated = await prisma.test.update({
      where: { id },
      data: { status: 'PUBLISHED' },
    });

    await createAuditLog(userId, 'TEST_PUBLISHED', 'Test', id);
    return updated;
  }

  async assignTest(testId: string, data: {
    studentIds?: string[];
    batchId?: string;
    departmentId?: string;
    startDate?: string;
    endDate?: string;
  }, assignerId: string) {
    const test = await prisma.test.findUnique({ where: { id: testId } });
    if (!test) throw new NotFoundError('Test not found');
    if (test.status !== 'PUBLISHED' && test.status !== 'ASSIGNED') {
      throw new BadRequestError('Test must be published before assignment');
    }

    let studentIds: string[] = data.studentIds || [];

    // Get students from batch/department if specified
    if (data.batchId) {
      const students = await prisma.student.findMany({
        where: { batchId: data.batchId },
        select: { id: true },
      });
      studentIds = [...studentIds, ...students.map(s => s.id)];
    }

    if (data.departmentId) {
      const students = await prisma.student.findMany({
        where: { departmentId: data.departmentId },
        select: { id: true },
      });
      studentIds = [...studentIds, ...students.map(s => s.id)];
    }

    // Remove duplicates
    studentIds = [...new Set(studentIds)];

    if (studentIds.length === 0) {
      throw new BadRequestError('No students selected for assignment');
    }

    // Create assignments (skip existing)
    const existingAssignments = await prisma.testAssignment.findMany({
      where: { testId, studentId: { in: studentIds } },
      select: { studentId: true },
    });

    const existingStudentIds = new Set(existingAssignments.map(a => a.studentId));
    const newStudentIds = studentIds.filter(id => !existingStudentIds.has(id));

    if (newStudentIds.length > 0) {
      await prisma.testAssignment.createMany({
        data: newStudentIds.map(studentId => ({
          testId,
          studentId,
          startDate: data.startDate ? new Date(data.startDate) : test.startDate,
          endDate: data.endDate ? new Date(data.endDate) : test.endDate,
        })),
      });
    }

    // Update test status to ASSIGNED
    if (test.status === 'PUBLISHED') {
      await prisma.test.update({
        where: { id: testId },
        data: { status: 'ASSIGNED' },
      });
    }

    // Create notifications
    for (const studentId of newStudentIds) {
      const student = await prisma.student.findUnique({
        where: { id: studentId },
        select: { userId: true },
      });
      if (student) {
        await prisma.notification.create({
          data: {
            userId: student.userId,
            title: 'New Test Assigned',
            message: `A new test "${test.title}" has been assigned to you.`,
            type: 'INFO',
            link: `/student/tests`,
          },
        });
      }
    }

    await createAuditLog(assignerId, 'TEST_ASSIGNED', 'Test', testId, { studentCount: newStudentIds.length });

    return { assigned: newStudentIds.length, skipped: existingStudentIds.size };
  }

  async getAssignments(params: {
    testId?: string;
    studentId?: string;
    status?: SubmissionStatus;
    page?: number;
    limit?: number;
  }) {
    const { testId, studentId, status, page = 1, limit = 10 } = params;
    const skip = (page - 1) * limit;

    const where: Prisma.TestAssignmentWhereInput = {};
    if (testId) where.testId = testId;
    if (studentId) where.studentId = studentId;
    if (status) where.status = status;

    const [assignments, total] = await Promise.all([
      prisma.testAssignment.findMany({
        where,
        skip,
        take: limit,
        orderBy: { assignedAt: 'desc' },
        include: {
          test: {
            include: {
              subject: true,
              _count: { select: { testQuestions: true } },
            },
          },
          student: {
            include: {
              user: { select: { firstName: true, lastName: true, email: true } },
              department: true,
              batch: true,
            },
          },
          submissions: {
            include: { result: true },
            orderBy: { attemptNumber: 'desc' },
            take: 1,
          },
        },
      }),
      prisma.testAssignment.count({ where }),
    ]);

    return { assignments, total, page, limit };
  }

  // Student test methods
  async getStudentAssignments(studentId: string) {
    return prisma.testAssignment.findMany({
      where: { studentId },
      orderBy: { assignedAt: 'desc' },
      include: {
        test: {
          include: {
            subject: true,
            _count: { select: { testQuestions: true } },
          },
        },
        submissions: {
          include: { result: true },
          orderBy: { attemptNumber: 'desc' },
        },
      },
    });
  }

  async startTest(testOrAssignmentId: string, studentId: string) {
    let assignment = await prisma.testAssignment.findFirst({
      where: {
        OR: [
          { id: testOrAssignmentId },
          { testId: testOrAssignmentId, studentId },
        ],
      },
      include: {
        test: {
          include: {
            testQuestions: {
              orderBy: { sortOrder: 'asc' },
              include: {
                question: {
                  include: {
                    options: { orderBy: { sortOrder: 'asc' } },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!assignment) throw new NotFoundError('Assignment not found');
    if (assignment.studentId !== studentId) throw new ForbiddenError('Not your assignment');

    // Check if test is expired
    if (assignment.endDate && new Date() > assignment.endDate) {
      throw new BadRequestError('Test has expired');
    }
    if (assignment.test.endDate && new Date() > assignment.test.endDate) {
      throw new BadRequestError('Test has expired');
    }

    // Check attempt count
    if (assignment.attemptCount >= assignment.test.maxAttempts) {
      throw new BadRequestError('Maximum attempts reached');
    }

    // Check for existing in-progress submission
    const existingSubmission = await prisma.testSubmission.findFirst({
      where: { assignmentId: assignment.id, status: 'IN_PROGRESS' },
    });

    if (existingSubmission) {
      // Return existing in-progress submission with answers
      const answers = await prisma.studentAnswer.findMany({
        where: { submissionId: existingSubmission.id },
      });

      return {
        submission: existingSubmission,
        test: assignment.test,
        answers,
      };
    }

    // Create new submission
    const submission = await prisma.$transaction(async (tx) => {
      const sub = await tx.testSubmission.create({
        data: {
          assignmentId: assignment.id,
          attemptNumber: assignment.attemptCount + 1,
          status: 'IN_PROGRESS',
        },
      });

      await tx.testAssignment.update({
        where: { id: assignment.id },
        data: {
          status: 'IN_PROGRESS',
          attemptCount: { increment: 1 },
        },
      });

      return sub;
    });

    // Remove correct answers from question options sent to student
    const sanitizedTest = {
      ...assignment.test,
      testQuestions: assignment.test.testQuestions.map(tq => ({
        ...tq,
        question: {
          ...tq.question,
          correctAnswer: undefined,
          explanation: undefined,
          options: tq.question.options.map(opt => ({
            id: opt.id,
            optionText: opt.optionText,
            sortOrder: opt.sortOrder,
            questionId: opt.questionId,
          })),
        },
      })),
    };

    return { submission, test: sanitizedTest, answers: [] };
  }

  async saveAnswer(submissionOrTestId: string, studentId: string, data: {
    questionId: string;
    answer?: string;
    selectedOptionId?: string;
    isMarkedForReview?: boolean;
  }) {
    let submission = await prisma.testSubmission.findUnique({
      where: { id: submissionOrTestId },
      include: { assignment: true },
    });

    if (!submission) {
      submission = await prisma.testSubmission.findFirst({
        where: {
          assignment: { testId: submissionOrTestId, studentId },
          status: 'IN_PROGRESS',
        },
        include: { assignment: true },
      });
    }

    if (!submission) throw new NotFoundError('Submission not found');
    if (submission.assignment.studentId !== studentId) throw new ForbiddenError('Not your submission');
    if (submission.status !== 'IN_PROGRESS') throw new BadRequestError('Test already submitted');

    const answer = await prisma.studentAnswer.upsert({
      where: {
        submissionId_questionId: {
          submissionId: submission.id,
          questionId: data.questionId,
        },
      },
      create: {
        submissionId: submission.id,
        questionId: data.questionId,
        answer: data.answer,
        selectedOptionId: data.selectedOptionId,
        isMarkedForReview: data.isMarkedForReview || false,
        answeredAt: new Date(),
      },
      update: {
        answer: data.answer,
        selectedOptionId: data.selectedOptionId,
        isMarkedForReview: data.isMarkedForReview,
        answeredAt: new Date(),
      },
    });

    // Update last activity
    await prisma.testSubmission.update({
      where: { id: submission.id },
      data: { lastActivityAt: new Date() },
    });

    return answer;
  }

  async submitTest(submissionOrTestId: string, studentId: string) {
    let submission = await prisma.testSubmission.findUnique({
      where: { id: submissionOrTestId },
      include: {
        assignment: {
          include: {
            test: {
              include: {
                testQuestions: {
                  include: {
                    question: { include: { options: true } },
                  },
                },
              },
            },
          },
        },
        answers: true,
      },
    });

    if (!submission) {
      submission = await prisma.testSubmission.findFirst({
        where: {
          assignment: { testId: submissionOrTestId, studentId },
          status: 'IN_PROGRESS',
        },
        include: {
          assignment: {
            include: {
              test: {
                include: {
                  testQuestions: {
                    include: {
                      question: { include: { options: true } },
                    },
                  },
                },
              },
            },
          },
          answers: true,
        },
      });
    }

    if (!submission) throw new NotFoundError('Submission not found');
    if (submission.assignment.studentId !== studentId) throw new ForbiddenError('Not your submission');
    if (submission.status !== 'IN_PROGRESS') throw new BadRequestError('Test already submitted');

    // Calculate time spent
    const timeSpent = Math.floor((new Date().getTime() - submission.startedAt.getTime()) / 1000);

    // Auto-evaluate MCQ and TRUE_FALSE questions
    let totalMarks = 0;
    let obtainedMarks = 0;

    for (const tq of submission.assignment.test.testQuestions) {
      const q = tq.question;
      const qMarks = tq.marks ?? q.marks;
      totalMarks += qMarks;

      const studentAns = submission.answers.find(a => a.questionId === q.id);
      if (!studentAns) continue;

      if (q.questionType === 'MCQ') {
        const correctOpt = q.options.find(o => o.isCorrect);
        const isCorrect = correctOpt && studentAns.selectedOptionId === correctOpt.id;
        const marksEarned = isCorrect ? qMarks : 0;

        await prisma.studentAnswer.update({
          where: { id: studentAns.id },
          data: { isCorrect, marksObtained: marksEarned },
        });

        if (isCorrect) obtainedMarks += marksEarned;
      } else if (q.questionType === 'TRUE_FALSE') {
        const isCorrect = q.correctAnswer && studentAns.answer?.toLowerCase().trim() === q.correctAnswer.toLowerCase().trim();
        const marksEarned = isCorrect ? qMarks : 0;

        await prisma.studentAnswer.update({
          where: { id: studentAns.id },
          data: { isCorrect: !!isCorrect, marksObtained: marksEarned },
        });

        if (isCorrect) obtainedMarks += marksEarned;
      } else if (q.questionType === 'FILL_BLANK') {
        const isCorrect = q.correctAnswer && studentAns.answer?.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase();
        const marksEarned = isCorrect ? qMarks : 0;

        await prisma.studentAnswer.update({
          where: { id: studentAns.id },
          data: { isCorrect: !!isCorrect, marksObtained: marksEarned },
        });

        if (isCorrect) obtainedMarks += marksEarned;
      }
    }

    // Update submission status
    await prisma.testSubmission.update({
      where: { id: submission.id },
      data: {
        status: 'SUBMITTED',
        submittedAt: new Date(),
        timeSpent,
      },
    });

    // Update assignment status
    await prisma.testAssignment.update({
      where: { id: submission.assignmentId },
      data: { status: 'SUBMITTED' },
    });

    // Check if all questions are auto-evaluable
    const hasManualQuestions = submission.assignment.test.testQuestions.some(
      tq => ['PROGRAMMING', 'SHORT_ANSWER', 'DESCRIPTIVE'].includes(tq.question.questionType)
    );

    const percentage = totalMarks > 0 ? (obtainedMarks / totalMarks) * 100 : 0;

    // Create result
    const result = await prisma.testResult.create({
      data: {
        submissionId: submission.id,
        totalMarks,
        obtainedMarks,
        percentage,
        isPassed: submission.assignment.test.passingScore ? percentage >= submission.assignment.test.passingScore : null,
        evaluatedAt: hasManualQuestions ? undefined : new Date(),
      },
    });

    if (!hasManualQuestions) {
      await prisma.testSubmission.update({
        where: { id: submission.id },
        data: { status: 'EVALUATED' },
      });
      await prisma.testAssignment.update({
        where: { id: submission.assignmentId },
        data: { status: 'EVALUATED' },
      });
    }

    const finalSubmission = await prisma.testSubmission.findUnique({
      where: { id: submission.id },
      include: {
        answers: { include: { question: { include: { options: true } } } },
        result: true,
      },
    });

    return { result, timeSpent, hasManualQuestions, submission: finalSubmission };
  }

  async getTestResult(submissionOrTestId: string, studentId?: string) {
    let submission = await prisma.testSubmission.findUnique({
      where: { id: submissionOrTestId },
      include: {
        assignment: {
          include: {
            test: {
              include: {
                subject: true,
                testQuestions: {
                  orderBy: { sortOrder: 'asc' },
                  include: {
                    question: { include: { options: true } },
                  },
                },
              },
            },
            student: {
              include: {
                user: { select: { firstName: true, lastName: true, email: true } },
              },
            },
          },
        },
        answers: { include: { question: { include: { options: true } } } },
        result: true,
      },
    });

    if (!submission) {
      submission = await prisma.testSubmission.findFirst({
        where: {
          assignment: { testId: submissionOrTestId, ...(studentId ? { studentId } : {}) },
        },
        orderBy: { attemptNumber: 'desc' },
        include: {
          assignment: {
            include: {
              test: {
                include: {
                  subject: true,
                  testQuestions: {
                    orderBy: { sortOrder: 'asc' },
                    include: {
                      question: { include: { options: true } },
                    },
                  },
                },
              },
              student: {
                include: {
                  user: { select: { firstName: true, lastName: true, email: true } },
                },
              },
            },
          },
          answers: { include: { question: { include: { options: true } } } },
          result: true,
        },
      });
    }

    if (!submission) throw new NotFoundError('Submission not found');
    if (studentId && submission.assignment.studentId !== studentId) {
      throw new ForbiddenError('Not authorized to view this result');
    }

    return submission;
  }

  async evaluateAnswer(answerId: string, data: {
    marksObtained: number;
    isCorrect: boolean;
    feedback?: string;
  }, evaluatorId: string) {
    const answer = await prisma.studentAnswer.findUnique({
      where: { id: answerId },
      include: {
        submission: {
          include: {
            result: true,
            answers: true,
          },
        },
      },
    });

    if (!answer) throw new NotFoundError('Answer not found');

    await prisma.studentAnswer.update({
      where: { id: answerId },
      data: {
        marksObtained: data.marksObtained,
        isCorrect: data.isCorrect,
      },
    });

    // Recalculate result
    if (answer.submission.result) {
      const allAnswers = await prisma.studentAnswer.findMany({
        where: { submissionId: answer.submissionId },
      });

      const obtainedMarks = allAnswers.reduce((sum, a) => sum + (a.marksObtained || 0), 0)
        - (answer.marksObtained || 0) + data.marksObtained;

      const percentage = answer.submission.result.totalMarks > 0
        ? (obtainedMarks / answer.submission.result.totalMarks) * 100
        : 0;

      await prisma.testResult.update({
        where: { id: answer.submission.result.id },
        data: {
          obtainedMarks,
          percentage,
          evaluatedById: evaluatorId,
          evaluatedAt: new Date(),
          feedback: data.feedback,
        },
      });

      // Check if all answers are evaluated
      const unevaluated = allAnswers.filter(a => a.id !== answerId && a.isCorrect === null);
      if (unevaluated.length === 0) {
        await prisma.testSubmission.update({
          where: { id: answer.submissionId },
          data: { status: 'EVALUATED' },
        });
        await prisma.testAssignment.update({
          where: { id: answer.submission.assignmentId },
          data: { status: 'EVALUATED' },
        });
      }
    }

    return { message: 'Answer evaluated successfully' };
  }
}

export const testService = new TestService();
