"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const handleCastError_1 = __importDefault(require("../errors/handleCastError"));
const handleValidationError_1 = __importDefault(require("../errors/handleValidationError"));
const handleZodError_1 = __importDefault(require("../errors/handleZodError"));
const handleDuplicateError_1 = __importDefault(require("../errors/handleDuplicateError"));
const mongoose_1 = __importDefault(require("mongoose"));
const globalErrorHandler = (err, _req, res, _next) => {
    let statusCode = 500;
    let message = "Something went wrong";
    let errorMessages = [];
    let errorMessage = "";
    let stack = "";
    if (err instanceof zod_1.ZodError) {
        const simplifiedError = (0, handleZodError_1.default)(err);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorMessages = simplifiedError.errorMessages;
    }
    else if (err instanceof mongoose_1.default.Error.ValidationError) {
        const simplifiedError = (0, handleValidationError_1.default)(err);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorMessages = simplifiedError.errorMessages;
    }
    else if (err instanceof mongoose_1.default.Error.CastError) {
        const simplifiedError = (0, handleCastError_1.default)(err);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorMessage = simplifiedError.errorMessage;
    }
    else if (err.code === 11000) {
        const simplifiedError = (0, handleDuplicateError_1.default)(err);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorMessage = simplifiedError.errorMessage;
    }
    else if (err instanceof Error) {
        message = err.message;
        stack = err.stack || "";
        if ("statusCode" in err) {
            statusCode = err.statusCode;
        }
    }
    const responseData = {
        success: false,
        statusCode,
        message,
        errorMessages,
        stack: process.env.NODE_ENV === "development" ? stack : undefined,
    };
    if (errorMessage) {
        responseData.errorMessage = errorMessage;
    }
    res.status(statusCode).json(responseData);
};
exports.default = globalErrorHandler;
//# sourceMappingURL=globalErrorhandler.js.map