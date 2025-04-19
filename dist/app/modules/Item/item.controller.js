"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItemController = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const item_service_1 = require("./item.service");
const http_status_1 = __importDefault(require("http-status"));
const item_constant_1 = require("./item.constant");
const pick_1 = __importDefault(require("../../utils/pick"));
const createItem = (0, catchAsync_1.default)(async (req, res) => {
    const result = await item_service_1.ItemService.createItem({
        ...req.body,
        entryBy: req.user._id,
    });
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: "Item created successfully",
        data: result,
    });
});
const getAllItems = (0, catchAsync_1.default)(async (req, res) => {
    const filters = (0, pick_1.default)(req.query, item_constant_1.itemFilterableFields);
    const result = await item_service_1.ItemService.getAllItems(filters);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
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
const getItemById = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const result = await item_service_1.ItemService.getItemById(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Item retrieved successfully",
        data: result,
    });
});
const getSingleItem = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const result = await item_service_1.ItemService.getSingleItem(id);
    res.status(http_status_1.default.OK).json({
        success: true,
        message: "Item retrieved successfully",
        data: result,
    });
});
const updateItem = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const result = await item_service_1.ItemService.updateItem(id, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Item updated successfully",
        data: result,
    });
});
const deleteItem = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const result = await item_service_1.ItemService.deleteItem(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Item deleted successfully",
        data: result,
    });
});
const updateInventory = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const { quantity } = req.body;
    const result = await item_service_1.ItemService.updateInventory(id, quantity);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Inventory updated successfully",
        data: result,
    });
});
exports.ItemController = {
    createItem,
    getAllItems,
    getItemById,
    getSingleItem,
    updateItem,
    deleteItem,
    updateInventory,
};
//# sourceMappingURL=item.controller.js.map