export type Role = 'SUPER_ADMIN' | 'ADMIN' | 'STUDENT';
export const Role = {
  SUPER_ADMIN: 'SUPER_ADMIN' as const,
  ADMIN: 'ADMIN' as const,
  STUDENT: 'STUDENT' as const,
};

export type QuestionType = 'MCQ' | 'TRUE_FALSE' | 'FILL_BLANK' | 'SHORT_ANSWER' | 'PROGRAMMING' | 'DESCRIPTIVE';
export const QuestionType = {
  MCQ: 'MCQ' as const,
  TRUE_FALSE: 'TRUE_FALSE' as const,
  FILL_BLANK: 'FILL_BLANK' as const,
  SHORT_ANSWER: 'SHORT_ANSWER' as const,
  PROGRAMMING: 'PROGRAMMING' as const,
  DESCRIPTIVE: 'DESCRIPTIVE' as const,
};

export type Difficulty = 'EASY' | 'MEDIUM' | 'HARD';
export const Difficulty = {
  EASY: 'EASY' as const,
  MEDIUM: 'MEDIUM' as const,
  HARD: 'HARD' as const,
};

export type TestStatus = 'DRAFT' | 'PUBLISHED' | 'ASSIGNED' | 'STARTED' | 'SUBMITTED' | 'EVALUATED' | 'COMPLETED' | 'EXPIRED';
export const TestStatus = {
  DRAFT: 'DRAFT' as const,
  PUBLISHED: 'PUBLISHED' as const,
  ASSIGNED: 'ASSIGNED' as const,
  STARTED: 'STARTED' as const,
  SUBMITTED: 'SUBMITTED' as const,
  EVALUATED: 'EVALUATED' as const,
  COMPLETED: 'COMPLETED' as const,
  EXPIRED: 'EXPIRED' as const,
};

export type SubmissionStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'SUBMITTED' | 'EVALUATED';
export const SubmissionStatus = {
  NOT_STARTED: 'NOT_STARTED' as const,
  IN_PROGRESS: 'IN_PROGRESS' as const,
  SUBMITTED: 'SUBMITTED' as const,
  EVALUATED: 'EVALUATED' as const,
};

export type MaterialType = 'PPT' | 'VIDEO' | 'IMAGE' | 'DOCUMENT' | 'OTHER';
export const MaterialType = {
  PPT: 'PPT' as const,
  VIDEO: 'VIDEO' as const,
  IMAGE: 'IMAGE' as const,
  DOCUMENT: 'DOCUMENT' as const,
  OTHER: 'OTHER' as const,
};

export type NotificationType = 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';
export const NotificationType = {
  INFO: 'INFO' as const,
  SUCCESS: 'SUCCESS' as const,
  WARNING: 'WARNING' as const,
  ERROR: 'ERROR' as const,
};
