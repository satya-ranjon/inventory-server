"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerController = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const customer_service_1 = require("./customer.service");
const http_status_1 = __importDefault(require("http-status"));
const customer_constant_1 = require("./customer.constant");
const pick_1 = __importDefault(require("../../utils/pick"));
const createCustomer = (0, catchAsync_1.default)(async (req, res) => {
    const result = await customer_service_1.CustomerService.createCustomer(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: "Customer created successfully",
        data: result,
    });
});
const getAllCustomers = (0, catchAsync_1.default)(async (req, res) => {
    const filters = (0, pick_1.default)(req.query, customer_constant_1.customerFilterableFields);
    const result = await customer_service_1.CustomerService.getAllCustomers(filters);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Customers retrieved successfully",
        meta: {
            page: Number(result.meta.page),
            limit: Number(result.meta.limit),
            total: result.meta.total,
        },
        data: result.data,
    });
});
const getCustomerById = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const result = await customer_service_1.CustomerService.getCustomerById(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Customer retrieved successfully",
        data: result,
    });
});
const updateCustomer = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const result = await customer_service_1.CustomerService.updateCustomer(id, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Customer updated successfully",
        data: result,
    });
});
const deleteCustomer = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const result = await customer_service_1.CustomerService.deleteCustomer(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Customer deleted successfully",
        data: result,
    });
});
const addContactPerson = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const result = await customer_service_1.CustomerService.addContactPerson(id, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Contact person added successfully",
        data: result,
    });
});
const updateContactPerson = (0, catchAsync_1.default)(async (req, res) => {
    const { id, contactIndex } = req.params;
    const result = await customer_service_1.CustomerService.updateContactPerson(id, parseInt(contactIndex), req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Contact person updated successfully",
        data: result,
    });
});
const getSingleCustomer = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const result = await customer_service_1.CustomerService.getSingleCustomer(id);
    res.status(http_status_1.default.OK).json({
        success: true,
        message: "Customer retrieved successfully",
        data: result,
    });
});
exports.CustomerController = {
    createCustomer,
    getAllCustomers,
    getCustomerById,
    updateCustomer,
    deleteCustomer,
    addContactPerson,
    updateContactPerson,
    getSingleCustomer,
};
//# sourceMappingURL=customer.controller.js.map