"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const user_model_1 = require("../User/user.model");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../../config"));
const registerUser = async (payload) => {
    const userExists = await user_model_1.User.findOne({ email: payload.email });
    if (userExists) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "User already exists");
    }
    const result = await user_model_1.User.create(payload);
    return result;
};
const loginUser = async (payload) => {
    const user = await user_model_1.User.findOne({ email: payload.email }).select("+password");
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not found");
    }
    const isPasswordValid = await bcrypt_1.default.compare(payload.password, user.password);
    if (!isPasswordValid) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, "Invalid credentials");
    }
    if (!user.isActive) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, "User is inactive");
    }
    const accessTokenOptions = {
        expiresIn: config_1.default.jwt.expires_in,
    };
    const refreshTokenOptions = {
        expiresIn: config_1.default.jwt.refresh_expires_in,
    };
    const accessToken = jsonwebtoken_1.default.sign({
        _id: user._id,
        email: user.email,
        role: user.role,
    }, config_1.default.jwt.secret, accessTokenOptions);
    const refreshToken = jsonwebtoken_1.default.sign({ _id: user._id }, config_1.default.jwt.refresh_secret, refreshTokenOptions);
    return {
        accessToken,
        refreshToken,
        user: {
            _id: user._id.toString(),
            email: user.email,
            role: user.role,
            name: user.name,
        },
    };
};
const refreshToken = async (token) => {
    let decodedToken;
    try {
        decodedToken = jsonwebtoken_1.default.verify(token, config_1.default.jwt.refresh_secret);
    }
    catch (error) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, "Invalid or expired refresh token");
    }
    const user = await user_model_1.User.findById(decodedToken._id);
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not found");
    }
    if (!user.isActive) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, "User is inactive");
    }
    const accessTokenOptions = {
        expiresIn: config_1.default.jwt.expires_in,
    };
    const refreshTokenOptions = {
        expiresIn: config_1.default.jwt.refresh_expires_in,
    };
    const accessToken = jsonwebtoken_1.default.sign({
        _id: user._id,
        email: user.email,
        role: user.role,
    }, config_1.default.jwt.secret, accessTokenOptions);
    const newRefreshToken = jsonwebtoken_1.default.sign({ _id: user._id }, config_1.default.jwt.refresh_secret, refreshTokenOptions);
    return {
        accessToken,
        refreshToken: newRefreshToken,
    };
};
exports.AuthService = {
    registerUser,
    loginUser,
    refreshToken,
};
//# sourceMappingURL=auth.service.js.map