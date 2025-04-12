"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const AppError_1 = __importDefault(require("../errors/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config"));
const user_model_1 = require("../modules/User/user.model");
const auth = (...requiredRoles) => {
    return (0, catchAsync_1.default)(async (req, _res, next) => {
        const token = req.headers.authorization;
        if (!token) {
            throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, "You are not authorized to access this resource");
        }
        const tokenWithoutBearer = token.startsWith("Bearer ")
            ? token.slice(7)
            : token;
        let verifiedUser;
        try {
            verifiedUser = jsonwebtoken_1.default.verify(tokenWithoutBearer, config_1.default.jwt.secret);
        }
        catch (error) {
            throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, "Invalid or expired token");
        }
        const user = await user_model_1.User.findById(verifiedUser._id);
        if (!user) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not found");
        }
        if (!user.isActive) {
            throw new AppError_1.default(http_status_1.default.FORBIDDEN, "User is inactive");
        }
        req.user = verifiedUser;
        if (requiredRoles.length && !requiredRoles.includes(verifiedUser.role)) {
            throw new AppError_1.default(http_status_1.default.FORBIDDEN, "You do not have permission to perform this action");
        }
        next();
    });
};
exports.default = auth;
//# sourceMappingURL=auth.js.map