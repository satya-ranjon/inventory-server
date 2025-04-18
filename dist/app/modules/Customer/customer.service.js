"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerService = void 0;
const customer_model_1 = require("./customer.model");
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const customer_constant_1 = require("./customer.constant");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const mongoose_1 = require("mongoose");
const createCustomer = async (payload) => {
    if (!payload.displayName) {
        if (payload.customerType === "Business" && payload.companyName) {
            payload.displayName = payload.companyName;
        }
        else if (payload.primaryContact) {
            const { firstName, lastName } = payload.primaryContact;
            payload.displayName = `${firstName} ${lastName}`;
        }
    }
    const result = await customer_model_1.Customer.create(payload);
    return result;
};
const getAllCustomers = async (filters) => {
    const { searchTerm, ...filterData } = filters;
    const andConditions = [];
    if (searchTerm) {
        andConditions.push({
            $or: customer_constant_1.customerSearchableFields.map((field) => ({
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
    const whereConditions = andConditions.length > 0 ? { $and: andConditions } : {};
    const customerQuery = customer_model_1.Customer.find(whereConditions);
    const queryBuilder = new QueryBuilder_1.default(customerQuery, filters)
        .filter()
        .sort()
        .paginate()
        .fields();
    const result = await queryBuilder.modelQuery;
    const total = await customer_model_1.Customer.countDocuments(whereConditions);
    return {
        meta: {
            page: queryBuilder.query.page || 1,
            limit: queryBuilder.query.limit || 10,
            total,
        },
        data: result,
    };
};
const getCustomerById = async (id) => {
    const result = await customer_model_1.Customer.findById(id);
    if (!result) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Customer not found");
    }
    return result;
};
const updateCustomer = async (id, payload) => {
    const result = await customer_model_1.Customer.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
    if (!result) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Customer not found");
    }
    return result;
};
const deleteCustomer = async (id) => {
    const result = await customer_model_1.Customer.findByIdAndDelete(id);
    if (!result) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Customer not found");
    }
    return result;
};
const addContactPerson = async (id, contactPersonData) => {
    const customer = await customer_model_1.Customer.findById(id);
    if (!customer) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Customer not found");
    }
    if (!customer.contactPersons) {
        customer.contactPersons = [];
    }
    customer.contactPersons.push(contactPersonData);
    const result = await customer.save();
    return result;
};
const updateContactPerson = async (id, contactIndex, contactPersonData) => {
    const customer = await customer_model_1.Customer.findById(id);
    if (!customer) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Customer not found");
    }
    if (!customer.contactPersons || !customer.contactPersons[contactIndex]) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Contact person not found");
    }
    Object.assign(customer.contactPersons[contactIndex], contactPersonData);
    const result = await customer.save();
    return result;
};
const getSingleCustomer = async (id) => {
    if (!(0, mongoose_1.isValidObjectId)(id)) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Invalid customer ID");
    }
    const customer = await customer_model_1.Customer.findById(id);
    if (!customer) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Customer not found");
    }
    return customer;
};
exports.CustomerService = {
    createCustomer,
    getAllCustomers,
    getCustomerById,
    updateCustomer,
    deleteCustomer,
    addContactPerson,
    updateContactPerson,
    getSingleCustomer,
};
//# sourceMappingURL=customer.service.js.map