import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { ItemService } from "./item.service";
import httpStatus from "http-status";
import { itemFilterableFields } from "./item.constant";
import pick from "../../utils/pick";

const createItem = catchAsync(async (req: Request, res: Response) => {
  const result = await ItemService.createItem(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Item created successfully",
    data: result,
  });
});

const getAllItems = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, itemFilterableFields);

  const result = await ItemService.getAllItems(filters);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Items retrieved successfully",
    meta: {
      page: Number(result.meta.page),
      limit: Number(result.meta.limit),
      total: result.meta.total,
    },
    data: result.data,
  });
});

const getItemById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await ItemService.getItemById(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Item retrieved successfully",
    data: result,
  });
});

const getSingleItem = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await ItemService.getSingleItem(id);

  res.status(httpStatus.OK).json({
    success: true,
    message: "Item retrieved successfully",
    data: result,
  });
});

const updateItem = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await ItemService.updateItem(id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Item updated successfully",
    data: result,
  });
});

const deleteItem = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await ItemService.deleteItem(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Item deleted successfully",
    data: result,
  });
});

const updateInventory = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { quantity } = req.body;

  const result = await ItemService.updateInventory(id, quantity);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Inventory updated successfully",
    data: result,
  });
});

const getLowStockItems = catchAsync(async (req: Request, res: Response) => {
  const result = await ItemService.getLowStockItems();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Low stock items retrieved successfully",
    data: result,
  });
});

export const ItemController = {
  createItem,
  getAllItems,
  getItemById,
  getSingleItem,
  updateItem,
  deleteItem,
  updateInventory,
  getLowStockItems,
};
