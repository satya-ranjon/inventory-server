import {
  TCustomer,
  TCustomerFilters,
  ICustomerWithOrders,
} from "./customer.interface";
import { Customer } from "./customer.model";
import { SalesOrder } from "../SalesOrder/salesOrder.model";
import QueryBuilder from "../../builder/QueryBuilder";
import { customerSearchableFields } from "./customer.constant";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import { isValidObjectId } from "mongoose";

const createCustomer = async (payload: TCustomer) => {
  const result = await Customer.create(payload);
  return result;
};

const getAllCustomers = async (filters: TCustomerFilters) => {
  const { searchTerm, ...filterData } = filters;

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      $or: customerSearchableFields.map((field) => ({
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

  const whereConditions =
    andConditions.length > 0 ? { $and: andConditions } : {};

  const customerQuery = Customer.find(whereConditions);

  const queryBuilder = new QueryBuilder(customerQuery, filters)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await queryBuilder.modelQuery;
  const total = await Customer.countDocuments(whereConditions);

  return {
    meta: {
      page: queryBuilder.query.page || 1,
      limit: queryBuilder.query.limit || 10,
      total,
    },
    data: result,
  };
};

// Reusable function to fetch customer with orders
const getCustomerWithOrders = async (
  id: string
): Promise<ICustomerWithOrders> => {
  const customer = await Customer.findById(id);

  if (!customer) {
    throw new AppError(httpStatus.NOT_FOUND, "Customer not found");
  }

  const orders = await SalesOrder.find({ customer: id })
    .populate("items.item")
    .sort({ salesOrderDate: -1 });

  return {
    customer,
    orders,
  };
};

const getCustomerById = async (id: string): Promise<ICustomerWithOrders> => {
  return getCustomerWithOrders(id);
};

const updateCustomer = async (id: string, payload: Partial<TCustomer>) => {
  const result = await Customer.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Customer not found");
  }

  return result;
};

const deleteCustomer = async (id: string) => {
  const result = await Customer.findByIdAndDelete(id);

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Customer not found");
  }

  return result;
};

const getSingleCustomer = async (id: string): Promise<ICustomerWithOrders> => {
  if (!isValidObjectId(id)) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid customer ID");
  }

  return getCustomerWithOrders(id);
};

export const CustomerService = {
  createCustomer,
  getAllCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
  getSingleCustomer,
};
