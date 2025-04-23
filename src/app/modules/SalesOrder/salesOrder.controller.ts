import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { SalesOrderService } from "./salesOrder.service";
import httpStatus from "http-status";
import { salesOrderFilterableFields } from "./salesOrder.constant";
import pick from "../../utils/pick";

const createSalesOrder = catchAsync(async (req: Request, res: Response) => {
  const result = await SalesOrderService.createSalesOrder(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Sales order created successfully",
    data: result,
  });
});

const getAllSalesOrders = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, salesOrderFilterableFields);

  const result = await SalesOrderService.getAllSalesOrders(filters);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Sales orders retrieved successfully",
    data: result,
  });
});

const getSalesOrderById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await SalesOrderService.getSalesOrderById(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Sales order retrieved successfully",
    data: result,
  });
});

const updateSalesOrder = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await SalesOrderService.updateSalesOrder(id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Sales order updated successfully",
    data: result,
  });
});

const updateOrderStatus = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  const result = await SalesOrderService.updateOrderStatus(id, status);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Sales order status updated successfully",
    data: result,
  });
});

const updatePayment = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { payment } = req.body;

  const result = await SalesOrderService.updateSalesOrder(id, { payment });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Payment updated successfully",
    data: result,
  });
});

const deleteSalesOrder = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await SalesOrderService.deleteSalesOrder(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Sales order deleted successfully",
    data: result,
  });
});

const getSingleSalesOrder = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await SalesOrderService.getSingleSalesOrder(id);

  res.status(httpStatus.OK).json({
    success: true,
    message: "Sales order retrieved successfully",
    data: result,
  });
});

export const SalesOrderController = {
  createSalesOrder,
  getAllSalesOrders,
  getSalesOrderById,
  updateSalesOrder,
  updateOrderStatus,
  updatePayment,
  deleteSalesOrder,
  getSingleSalesOrder,
};
