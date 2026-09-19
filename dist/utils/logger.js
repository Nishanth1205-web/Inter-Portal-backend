"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const config_1 = require("../config");
const levels = { debug: 0, info: 1, warn: 2, error: 3 };
const currentLevel = config_1.env.LOG_LEVEL || 'info';
function shouldLog(level) {
    return levels[level] >= levels[currentLevel];
}
function formatMessage(level, message, meta) {
    const timestamp = new Date().toISOString();
    const metaStr = meta ? ` ${JSON.stringify(meta)}` : '';
    return `[${timestamp}] [${level.toUpperCase()}] ${message}${metaStr}`;
}
exports.logger = {
    debug(message, meta) {
        if (shouldLog('debug'))
            console.debug(formatMessage('debug', message, meta));
    },
    info(message, meta) {
        if (shouldLog('info'))
            console.info(formatMessage('info', message, meta));
    },
    warn(message, meta) {
        if (shouldLog('warn'))
            console.warn(formatMessage('warn', message, meta));
    },
    error(message, meta) {
        if (shouldLog('error'))
            console.error(formatMessage('error', message, meta));
    },
};
//# sourceMappingURL=logger.js.map