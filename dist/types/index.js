"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationType = exports.MaterialType = exports.SubmissionStatus = exports.TestStatus = exports.Difficulty = exports.QuestionType = exports.Role = void 0;
exports.Role = {
    SUPER_ADMIN: 'SUPER_ADMIN',
    ADMIN: 'ADMIN',
    STUDENT: 'STUDENT',
};
exports.QuestionType = {
    MCQ: 'MCQ',
    TRUE_FALSE: 'TRUE_FALSE',
    FILL_BLANK: 'FILL_BLANK',
    SHORT_ANSWER: 'SHORT_ANSWER',
    PROGRAMMING: 'PROGRAMMING',
    DESCRIPTIVE: 'DESCRIPTIVE',
};
exports.Difficulty = {
    EASY: 'EASY',
    MEDIUM: 'MEDIUM',
    HARD: 'HARD',
};
exports.TestStatus = {
    DRAFT: 'DRAFT',
    PUBLISHED: 'PUBLISHED',
    ASSIGNED: 'ASSIGNED',
    STARTED: 'STARTED',
    SUBMITTED: 'SUBMITTED',
    EVALUATED: 'EVALUATED',
    COMPLETED: 'COMPLETED',
    EXPIRED: 'EXPIRED',
};
exports.SubmissionStatus = {
    NOT_STARTED: 'NOT_STARTED',
    IN_PROGRESS: 'IN_PROGRESS',
    SUBMITTED: 'SUBMITTED',
    EVALUATED: 'EVALUATED',
};
exports.MaterialType = {
    PPT: 'PPT',
    VIDEO: 'VIDEO',
    IMAGE: 'IMAGE',
    DOCUMENT: 'DOCUMENT',
    OTHER: 'OTHER',
};
exports.NotificationType = {
    INFO: 'INFO',
    SUCCESS: 'SUCCESS',
    WARNING: 'WARNING',
    ERROR: 'ERROR',
};
//# sourceMappingURL=index.js.map