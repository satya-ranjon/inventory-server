import express from "express";
import { AuthController } from "../modules/Auth/auth.controller";
import validateRequest from "../middlewares/validateRequest";
import { AuthValidation } from "../modules/Auth/auth.validation";

const router = express.Router();

// Register a new user
router.post(
  "/register",
  validateRequest(AuthValidation.registerUserValidationSchema),
  AuthController.registerUser
);

// Login user
router.post(
  "/login",
  validateRequest(AuthValidation.loginUserValidationSchema),
  AuthController.loginUser
);

// Refresh token
router.post(
  "/refresh-token",
  validateRequest(AuthValidation.refreshTokenValidationSchema),
  AuthController.refreshToken
);

export default router;
