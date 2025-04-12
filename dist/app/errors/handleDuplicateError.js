"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const handleDuplicateError = (err) => {
    const match = err.message.match(/"([^"]*)"/);
    const extractedMessage = match && match[1] ? match[1] : "";
    const errorMessage = `${extractedMessage} is already in use`;
    return {
        statusCode: 400,
        message: "Duplicate Entry",
        errorMessage,
    };
};
exports.default = handleDuplicateError;
//# sourceMappingURL=handleDuplicateError.js.map