"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SalesOrderService = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const salesOrder_model_1 = require("./salesOrder.model");
const item_model_1 = require("../Item/item.model");
const customer_model_1 = require("../Customer/customer.model");
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const salesOrder_constant_1 = require("./salesOrder.constant");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const mongoose_2 = require("mongoose");
const generateOrderNumber = async () => {
    const today = new Date();
    const prefix = "SO";
    const year = today.getFullYear().toString().substr(-2);
    const month = (today.getMonth() + 1).toString().padStart(2, "0");
    const latestOrder = await salesOrder_model_1.SalesOrder.findOne({
        orderNumber: new RegExp(`^${prefix}${year}${month}`),
    }).sort({ orderNumber: -1 });
    let nextNumber = 1;
    if (latestOrder) {
        const latestNumberStr = latestOrder.orderNumber.slice(-4);
        nextNumber = parseInt(latestNumberStr) + 1;
    }
    const numberStr = nextNumber.toString().padStart(4, "0");
    return `${prefix}${year}${month}${numberStr}`;
};
const createSalesOrder = async (payload) => {
    const session = await mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const customer = await customer_model_1.Customer.findById(payload.customer).session(session);
        if (!customer) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Customer not found");
        }
        for (const item of payload.items) {
            const itemDoc = await item_model_1.Item.findById(item.item).session(session);
            if (!itemDoc) {
                throw new AppError_1.default(http_status_1.default.NOT_FOUND, `Item not found: ${item.item}`);
            }
            if (item.quantity > (itemDoc.quantity || 0)) {
                throw new AppError_1.default(http_status_1.default.BAD_REQUEST, `Not enough stock for item: ${itemDoc.name}. Available: ${itemDoc.quantity || 0}, Requested: ${item.quantity}`);
            }
            await item_model_1.Item.findByIdAndUpdate(item.item, { $inc: { quantity: -item.quantity } }, { session });
        }
        if (!payload.orderNumber) {
            payload.orderNumber = await generateOrderNumber();
        }
        if (!payload.subTotal) {
            payload.subTotal = payload.items.reduce((sum, item) => sum + (item.amount || 0), 0);
        }
        const newOrder = {
            ...payload,
            status: payload.status || "Draft",
            payment: payload.payment || 0,
        };
        const salesOrder = await salesOrder_model_1.SalesOrder.create([newOrder], { session });
        await customer_model_1.Customer.findByIdAndUpdate(payload.customer, { $set: { due: newOrder.due || 0 } }, { session });
        await session.commitTransaction();
        session.endSession();
        return salesOrder_model_1.SalesOrder.findById(salesOrder[0]._id)
            .populate("customer", "customerName contactNumber email address customerType due")
            .populate("items.item");
    }
    catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
};
const updateSalesOrder = async (id, payload) => {
    const session = await mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const existingSalesOrder = await salesOrder_model_1.SalesOrder.findById(id).session(session);
        if (!existingSalesOrder) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Sales order not found");
        }
        const originalDue = existingSalesOrder.due || 0;
        if (payload.items && payload.items.length > 0) {
            for (const item of existingSalesOrder.items) {
                await item_model_1.Item.findByIdAndUpdate(item.item, { $inc: { quantity: item.quantity } }, { session });
            }
            for (const item of payload.items) {
                const itemDoc = await item_model_1.Item.findById(item.item).session(session);
                if (!itemDoc) {
                    throw new AppError_1.default(http_status_1.default.NOT_FOUND, `Item not found: ${item.item}`);
                }
                if (item.quantity > (itemDoc.quantity || 0)) {
                    throw new AppError_1.default(http_status_1.default.BAD_REQUEST, `Not enough stock for item: ${itemDoc.name}. Available: ${itemDoc.quantity || 0}, Requested: ${item.quantity}`);
                }
                await item_model_1.Item.findByIdAndUpdate(item.item, { $inc: { quantity: -item.quantity } }, { session });
            }
        }
        const updatedSalesOrder = await salesOrder_model_1.SalesOrder.findByIdAndUpdate(id, payload, {
            new: true,
            runValidators: true,
            session,
        });
        const dueDifference = ((updatedSalesOrder === null || updatedSalesOrder === void 0 ? void 0 : updatedSalesOrder.due) || 0) - originalDue;
        if (dueDifference !== 0) {
            await customer_model_1.Customer.findByIdAndUpdate(existingSalesOrder.customer, { $inc: { due: dueDifference } }, { session });
        }
        await session.commitTransaction();
        session.endSession();
        return salesOrder_model_1.SalesOrder.findById(updatedSalesOrder === null || updatedSalesOrder === void 0 ? void 0 : updatedSalesOrder._id)
            .populate("customer", "customerName contactNumber email address customerType due")
            .populate("items.item");
    }
    catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
};
const updateOrderStatus = async (id, status) => {
    const session = await mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const salesOrder = await salesOrder_model_1.SalesOrder.findById(id).session(session);
        if (!salesOrder) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Sales order not found");
        }
        if (status === "Cancelled" && salesOrder.status !== "Cancelled") {
            for (const item of salesOrder.items) {
                await item_model_1.Item.findByIdAndUpdate(item.item, { $inc: { quantity: item.quantity } }, { session });
            }
            if (salesOrder.due && salesOrder.due > 0) {
                await customer_model_1.Customer.findByIdAndUpdate(salesOrder.customer, { $inc: { due: -salesOrder.due } }, { session });
            }
        }
        const result = await salesOrder_model_1.SalesOrder.findByIdAndUpdate(id, { status }, { new: true, runValidators: true, session });
        await session.commitTransaction();
        session.endSession();
        return result;
    }
    catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
};
const deleteSalesOrder = async (id) => {
    const session = await mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const salesOrder = await salesOrder_model_1.SalesOrder.findById(id).session(session);
        if (!salesOrder) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Sales order not found");
        }
        for (const item of salesOrder.items) {
            await item_model_1.Item.findByIdAndUpdate(item.item, { $inc: { quantity: item.quantity } }, { session });
        }
        if (salesOrder.due && salesOrder.due > 0) {
            await customer_model_1.Customer.findByIdAndUpdate(salesOrder.customer, { $inc: { due: -salesOrder.due } }, { session });
        }
        await salesOrder_model_1.SalesOrder.findByIdAndDelete(id).session(session);
        await session.commitTransaction();
        session.endSession();
        return { success: true };
    }
    catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
};
const getAllSalesOrders = async (filters) => {
    const { searchTerm, fromDate, toDate, minAmount, maxAmount, payment, due, page, limit, sort, fields, ...filterData } = filters;
    const andConditions = [];
    if (searchTerm) {
        andConditions.push({
            $or: salesOrder_constant_1.salesOrderSearchableFields.map((field) => ({
                [field]: {
                    $regex: searchTerm,
                    $options: "i",
                },
            })),
        });
    }
    if (Object.keys(filterData).length) {
        andConditions.push({
            $and: Object.entries(filterData).map(([field, value]) => ({
                [field]: value,
            })),
        });
    }
    if (fromDate || toDate) {
        const dateFilter = {};
        if (fromDate) {
            dateFilter.$gte = new Date(fromDate);
        }
        if (toDate) {
            dateFilter.$lte = new Date(toDate);
        }
        andConditions.push({ salesOrderDate: dateFilter });
    }
    if (minAmount !== undefined || maxAmount !== undefined) {
        const amountFilter = {};
        if (minAmount !== undefined) {
            amountFilter.$gte = minAmount;
        }
        if (maxAmount !== undefined) {
            amountFilter.$lte = maxAmount;
        }
        andConditions.push({ total: amountFilter });
    }
    if (payment !== undefined) {
        andConditions.push({ payment });
    }
    if (due !== undefined) {
        andConditions.push({ due });
    }
    const whereConditions = andConditions.length > 0 ? { $and: andConditions } : {};
    const defaultLimit = 8;
    const salesOrderQuery = salesOrder_model_1.SalesOrder.find(whereConditions)
        .populate("customer")
        .populate("items.item", "name sku");
    const queryBuilder = new QueryBuilder_1.default(salesOrderQuery, {
        page,
        limit: limit || defaultLimit,
        sort,
        fields,
    })
        .sort()
        .paginate()
        .fields();
    const result = await queryBuilder.modelQuery;
    const total = await salesOrder_model_1.SalesOrder.countDocuments(whereConditions);
    const totals = await salesOrder_model_1.SalesOrder.aggregate([
        { $match: whereConditions },
        {
            $group: {
                _id: null,
                totalDue: { $sum: "$due" },
                totalPayment: { $sum: "$payment" },
                totalAmount: { $sum: "$total" },
            },
        },
    ]).exec();
    const totalsDue = totals.length > 0 ? totals[0].totalDue : 0;
    const totalsPayment = totals.length > 0 ? totals[0].totalPayment : 0;
    const totalAmount = totals.length > 0 ? totals[0].totalAmount : 0;
    return {
        meta: {
            page: Number(page) || 1,
            limit: Number(limit) || defaultLimit,
            total,
            totalDue: totalsDue,
            totalPayment: totalsPayment,
            totalPaid: totalsPayment,
            totalAmount: totalAmount,
        },
        data: result,
    };
};
const getSalesOrderById = async (id) => {
    const result = await salesOrder_model_1.SalesOrder.findById(id)
        .populate("customer", "customerName contactNumber email address customerType due")
        .populate("items.item");
    if (!result) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Sales order not found");
    }
    return result;
};
const getSingleSalesOrder = async (id) => {
    if (!(0, mongoose_2.isValidObjectId)(id)) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Invalid sales order ID");
    }
    const salesOrder = await salesOrder_model_1.SalesOrder.findById(id)
        .populate("customer")
        .populate("items.item");
    if (!salesOrder) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Sales order not found");
    }
    return salesOrder;
};
exports.SalesOrderService = {
    createSalesOrder,
    getAllSalesOrders,
    getSalesOrderById,
    updateSalesOrder,
    updateOrderStatus,
    deleteSalesOrder,
    getSingleSalesOrder,
};
//# sourceMappingURL=salesOrder.service.js.map