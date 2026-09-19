"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const config_1 = require("./config");
const utils_1 = require("./utils");
const config_2 = require("./config");
async function startServer() {
    try {
        // Test database connection
        await config_2.prisma.$connect();
        utils_1.logger.info('✅ Database connected successfully');
        app_1.default.listen(config_1.env.PORT, () => {
            utils_1.logger.info(`🚀 INTER Portal API Server running on port ${config_1.env.PORT}`);
            utils_1.logger.info(`📝 Environment: ${config_1.env.NODE_ENV}`);
            utils_1.logger.info(`🔗 API: http://localhost:${config_1.env.PORT}/api`);
            utils_1.logger.info(`❤️  Health: http://localhost:${config_1.env.PORT}/api/health`);
        });
    }
    catch (error) {
        utils_1.logger.error('Failed to start server', error);
        process.exit(1);
    }
}
// Graceful shutdown
process.on('SIGINT', async () => {
    utils_1.logger.info('Shutting down...');
    await config_2.prisma.$disconnect();
    process.exit(0);
});
process.on('SIGTERM', async () => {
    utils_1.logger.info('Shutting down...');
    await config_2.prisma.$disconnect();
    process.exit(0);
});
startServer();
//# sourceMappingURL=server.js.map