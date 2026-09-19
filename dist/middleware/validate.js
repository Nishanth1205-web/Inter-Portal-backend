"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = validate;
const zod_1 = require("zod");
const utils_1 = require("../utils");
function validate(schema, source = 'body') {
    return (req, res, next) => {
        try {
            const data = schema.parse(req[source]);
            req[source] = data;
            next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                const errors = error.errors.map((e) => ({
                    field: e.path.join('.'),
                    message: e.message,
                }));
                return (0, utils_1.sendError)(res, 'Validation failed', 422, errors);
            }
            next(error);
        }
    };
}
//# sourceMappingURL=validate.js.map