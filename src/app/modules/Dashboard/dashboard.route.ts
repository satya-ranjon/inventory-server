import express from "express";
import { DashboardController } from "./dashboard.controller";

const router = express.Router();

// Routes
router.get("/data", DashboardController.getDashboardData);

router.get("/data/date-range", DashboardController.getDashboardDataByDateRange);

export const DashboardRoutes = router;
