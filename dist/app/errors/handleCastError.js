"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const handleCastError = (err) => {
    const errorMessage = `Invalid ${err.path}: ${err.value}`;
    return {
        statusCode: 400,
        message: "Cast Error",
        errorMessage,
    };
};
exports.default = handleCastError;
//# sourceMappingURL=handleCastError.js.map