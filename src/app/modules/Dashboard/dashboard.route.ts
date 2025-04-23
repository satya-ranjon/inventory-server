import express from "express";
import { DashboardController } from "./dashboard.controller";

const router = express.Router();

// Routes
router.get("/data", DashboardController.getDashboardData);

router.get("/data/date-range", DashboardController.getDashboardDataByDateRange);

// New daily sales data routes
router.get("/sales-data", DashboardController.getDailySalesData);

router.get(
  "/sales-data/date-range",
  DashboardController.getDailySalesDataByDateRange
);

export const DashboardRoutes = router;
