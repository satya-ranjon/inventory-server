"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItemService = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const item_model_1 = require("./item.model");
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const item_constant_1 = require("./item.constant");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const mongoose_2 = require("mongoose");
const createItem = async (payload) => {
    const result = (await item_model_1.Item.create(payload)).populate("entryBy");
    return result;
};
const getAllItems = async (filters) => {
    const { searchTerm, minPrice, maxPrice, ...filterData } = filters;
    const andConditions = [];
    if (searchTerm) {
        andConditions.push({
            $or: item_constant_1.itemSearchableFields.map((field) => ({
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
    if (minPrice !== undefined) {
        andConditions.push({ price: { $gte: minPrice } });
    }
    if (maxPrice !== undefined) {
        andConditions.push({ price: { $lte: maxPrice } });
    }
    const whereConditions = andConditions.length > 0 ? { $and: andConditions } : {};
    const itemQuery = item_model_1.Item.find(whereConditions).populate("entryBy");
    const queryBuilder = new QueryBuilder_1.default(itemQuery, filters)
        .filter()
        .sort()
        .paginate()
        .fields();
    const result = await queryBuilder.modelQuery;
    const total = await item_model_1.Item.countDocuments(whereConditions);
    return {
        meta: {
            page: queryBuilder.query.page || 1,
            limit: queryBuilder.query.limit || 10,
            total,
        },
        data: result,
    };
};
const getItemById = async (id) => {
    const result = await item_model_1.Item.findById(id);
    if (!result) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Item not found");
    }
    return result;
};
const updateItem = async (id, payload) => {
    const result = await item_model_1.Item.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
    if (!result) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Item not found");
    }
    return result;
};
const deleteItem = async (id) => {
    const result = await item_model_1.Item.findByIdAndDelete(id);
    if (!result) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Item not found");
    }
    return result;
};
const updateInventory = async (id, quantity) => {
    const session = await mongoose_1.default.startSession();
    try {
        session.startTransaction();
        const item = await item_model_1.Item.findById(id).session(session);
        if (!item) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Item not found");
        }
        const currentStock = item.quantity || 0;
        const updatedItem = await item_model_1.Item.findByIdAndUpdate(id, { quantity: currentStock + quantity }, { new: true, runValidators: true, session });
        await session.commitTransaction();
        session.endSession();
        return updatedItem;
    }
    catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
};
const getSingleItem = async (id) => {
    if (!(0, mongoose_2.isValidObjectId)(id)) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Invalid item ID");
    }
    const item = await item_model_1.Item.findById(id);
    if (!item) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Item not found");
    }
    return item;
};
exports.ItemService = {
    createItem,
    getAllItems,
    getSingleItem,
    getItemById,
    updateItem,
    deleteItem,
    updateInventory,
};
//# sourceMappingURL=item.service.js.map