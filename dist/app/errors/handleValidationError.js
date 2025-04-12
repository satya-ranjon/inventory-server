"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const handleValidationError = (err) => {
    const errorMessages = Object.values(err.errors).map((val) => {
        return {
            path: val === null || val === void 0 ? void 0 : val.path,
            message: val === null || val === void 0 ? void 0 : val.message,
        };
    });
    return {
        statusCode: 400,
        message: "Validation Error",
        errorMessages,
    };
};
exports.default = handleValidationError;
//# sourceMappingURL=handleValidationError.js.map