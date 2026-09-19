"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const compression_1 = __importDefault(require("compression"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const path_1 = __importDefault(require("path"));
const config_1 = require("./config");
const middleware_1 = require("./middleware");
// Routes
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const academic_routes_1 = __importDefault(require("./routes/academic.routes"));
const question_routes_1 = __importDefault(require("./routes/question.routes"));
const test_routes_1 = __importDefault(require("./routes/test.routes"));
const material_routes_1 = __importDefault(require("./routes/material.routes"));
const system_routes_1 = __importDefault(require("./routes/system.routes"));
const app = (0, express_1.default)();
// Security
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: config_1.env.CORS_ORIGIN,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
// Rate limiting
const authLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20,
    message: { success: false, message: 'Too many attempts, please try again later.' },
});
const apiLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 200,
});
// Body parsing
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, compression_1.default)());
// Logging
if (config_1.env.NODE_ENV !== 'test') {
    app.use((0, morgan_1.default)('dev'));
}
// Static files
app.use('/uploads', express_1.default.static(path_1.default.join(process.cwd(), 'uploads')));
// Health check
app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
// API Routes
app.use('/api/auth', authLimiter, auth_routes_1.default);
app.use('/api/users', apiLimiter, user_routes_1.default);
app.use('/api/academic', apiLimiter, academic_routes_1.default);
app.use('/api/questions', apiLimiter, question_routes_1.default);
app.use('/api/tests', apiLimiter, test_routes_1.default);
app.use('/api/materials', apiLimiter, material_routes_1.default);
app.use('/api', apiLimiter, system_routes_1.default);
// 404 handler
app.use((_req, res) => {
    res.status(404).json({ success: false, message: 'Route not found' });
});
// Global error handler
app.use(middleware_1.errorHandler);
exports.default = app;
//# sourceMappingURL=app.js.map