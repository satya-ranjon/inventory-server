"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SalesOrderController = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const salesOrder_service_1 = require("./salesOrder.service");
const http_status_1 = __importDefault(require("http-status"));
const salesOrder_constant_1 = require("./salesOrder.constant");
const pick_1 = __importDefault(require("../../utils/pick"));
const createSalesOrder = (0, catchAsync_1.default)(async (req, res) => {
    const result = await salesOrder_service_1.SalesOrderService.createSalesOrder(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: "Sales order created successfully",
        data: result,
    });
});
const getAllSalesOrders = (0, catchAsync_1.default)(async (req, res) => {
    const filters = (0, pick_1.default)(req.query, salesOrder_constant_1.salesOrderFilterableFields);
    const result = await salesOrder_service_1.SalesOrderService.getAllSalesOrders(filters);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Sales orders retrieved successfully",
        meta: {
            page: Number(result.meta.page),
            limit: Number(result.meta.limit),
            total: result.meta.total,
        },
        data: result.data,
    });
});
const getSalesOrderById = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const result = await salesOrder_service_1.SalesOrderService.getSalesOrderById(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Sales order retrieved successfully",
        data: result,
    });
});
const updateSalesOrder = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const result = await salesOrder_service_1.SalesOrderService.updateSalesOrder(id, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Sales order updated successfully",
        data: result,
    });
});
const updateOrderStatus = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const result = await salesOrder_service_1.SalesOrderService.updateOrderStatus(id, status);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Sales order status updated successfully",
        data: result,
    });
});
const deleteSalesOrder = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const result = await salesOrder_service_1.SalesOrderService.deleteSalesOrder(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Sales order deleted successfully",
        data: result,
    });
});
const getSingleSalesOrder = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const result = await salesOrder_service_1.SalesOrderService.getSingleSalesOrder(id);
    res.status(http_status_1.default.OK).json({
        success: true,
        message: "Sales order retrieved successfully",
        data: result,
    });
});
exports.SalesOrderController = {
    createSalesOrder,
    getAllSalesOrders,
    getSalesOrderById,
    updateSalesOrder,
    updateOrderStatus,
    deleteSalesOrder,
    getSingleSalesOrder,
};
//# sourceMappingURL=salesOrder.controller.js.map