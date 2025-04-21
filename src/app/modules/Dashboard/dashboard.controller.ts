import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { DashboardService } from "./dashboard.service";

// Get dashboard data
const getDashboardData = catchAsync(async (_req: Request, res: Response) => {
  const result = await DashboardService.getDashboardData();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Dashboard data retrieved successfully",
    data: result,
  });
});

// Get dashboard data by date range
const getDashboardDataByDateRange = catchAsync(
  async (req: Request, res: Response) => {
    const { startDate, endDate } = req.query;

    // Validate date inputs
    if (!startDate || !endDate) {
      return sendResponse(res, {
        statusCode: 400,
        success: false,
        message: "Both startDate and endDate are required",
        data: null,
      });
    }

    try {
      const start = new Date(startDate as string);
      const end = new Date(endDate as string);

      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return sendResponse(res, {
          statusCode: 400,
          success: false,
          message: "Invalid date format. Please use YYYY-MM-DD format",
          data: null,
        });
      }

      const result = await DashboardService.getDashboardDataByDateRange(
        start,
        end
      );

      sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Dashboard data retrieved successfully",
        data: result,
      });
    } catch (error) {
      sendResponse(res, {
        statusCode: 400,
        success: false,
        message: "Error processing date range",
        data: null,
      });
    }
  }
);

export const DashboardController = {
  getDashboardData,
  getDashboardDataByDateRange,
};
