import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { UserService } from "./user.service";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";

const createEmployee = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.createEmployee(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Employee created successfully",
    data: result,
  });
});

const updateProfile = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user._id;
  const result = await UserService.updateProfile(userId, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Profile updated successfully",
    data: result,
  });
});

export const UserController = {
  createEmployee,
  updateProfile,
};
