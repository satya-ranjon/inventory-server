import express from "express";
import { DashboardController } from "../modules/Dashboard/dashboard.controller";
import auth from "../middlewares/auth";

const router = express.Router();

// GET dashboard data - protected route
router.get(
  "/data",
  auth("admin", "manager", "employee"),
  DashboardController.getDashboardData
);

// GET dashboard data by date range - protected route
router.get(
  "/data/date-range",
  auth("admin", "manager", "employee"),
  DashboardController.getDashboardDataByDateRange
);

export default router;
