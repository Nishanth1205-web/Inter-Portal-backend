"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAuditLog = exports.auditLog = exports.errorHandler = exports.validate = exports.getStudentId = exports.authorize = exports.authenticate = void 0;
var auth_1 = require("./auth");
Object.defineProperty(exports, "authenticate", { enumerable: true, get: function () { return auth_1.authenticate; } });
Object.defineProperty(exports, "authorize", { enumerable: true, get: function () { return auth_1.authorize; } });
Object.defineProperty(exports, "getStudentId", { enumerable: true, get: function () { return auth_1.getStudentId; } });
var validate_1 = require("./validate");
Object.defineProperty(exports, "validate", { enumerable: true, get: function () { return validate_1.validate; } });
var errorHandler_1 = require("./errorHandler");
Object.defineProperty(exports, "errorHandler", { enumerable: true, get: function () { return errorHandler_1.errorHandler; } });
var auditLog_1 = require("./auditLog");
Object.defineProperty(exports, "auditLog", { enumerable: true, get: function () { return auditLog_1.auditLog; } });
Object.defineProperty(exports, "createAuditLog", { enumerable: true, get: function () { return auditLog_1.createAuditLog; } });
//# sourceMappingURL=index.js.map