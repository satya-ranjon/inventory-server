import express from "express";
import { AuthController } from "../modules/Auth/auth.controller";
import validateRequest from "../middlewares/validateRequest";
import { AuthValidation } from "../modules/Auth/auth.validation";
import auth from "../middlewares/auth";

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

// Change password - protected route
router.post(
  "/change-password",
  auth(),
  validateRequest(AuthValidation.changePasswordValidationSchema),
  AuthController.changePassword
);

export default router;
