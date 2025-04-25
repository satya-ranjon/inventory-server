import express from "express";
import { UserController } from "../modules/User/user.controller";
import validateRequest from "../middlewares/validateRequest";
import { UserValidation } from "../modules/User/user.validation";
import auth from "../middlewares/auth";

const router = express.Router();

// Create employee (admin only)
router.post(
  "/create-employee",
  auth("admin"),
  validateRequest(UserValidation.createEmployeeValidationSchema),
  UserController.createEmployee
);

// Update user profile (authenticated users)
router.put(
  "/profile",
  auth(),
  validateRequest(UserValidation.updateProfileValidationSchema),
  UserController.updateProfile
);

export default router;
