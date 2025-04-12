import mongoose from "mongoose";
import {
  TCustomer,
  TCustomerFilters,
  TContactPerson,
} from "./customer.interface";
import { Customer } from "./customer.model";
import QueryBuilder from "../../builder/QueryBuilder";
import { customerSearchableFields } from "./customer.constant";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";

const createCustomer = async (payload: TCustomer) => {
  // Generate display name if not provided
  if (!payload.displayName) {
    if (payload.customerType === "Business" && payload.companyName) {
      payload.displayName = payload.companyName;
    } else if (payload.primaryContact) {
      const { firstName, lastName } = payload.primaryContact;
      payload.displayName = `${firstName} ${lastName}`;
    }
  }

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

const getCustomerById = async (id: string) => {
  const result = await Customer.findById(id);

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Customer not found");
  }

  return result;
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
  // Verify if the customer has any sales orders (would be added in a full implementation)

  const result = await Customer.findByIdAndDelete(id);

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Customer not found");
  }

  return result;
};

const addContactPerson = async (
  id: string,
  contactPersonData: TContactPerson
) => {
  const customer = await Customer.findById(id);

  if (!customer) {
    throw new AppError(httpStatus.NOT_FOUND, "Customer not found");
  }

  // Initialize contact persons array if it doesn't exist
  if (!customer.contactPersons) {
    customer.contactPersons = [];
  }

  customer.contactPersons.push(contactPersonData);

  const result = await customer.save();

  return result;
};

const updateContactPerson = async (
  id: string,
  contactIndex: number,
  contactPersonData: Partial<TContactPerson>
) => {
  const customer = await Customer.findById(id);

  if (!customer) {
    throw new AppError(httpStatus.NOT_FOUND, "Customer not found");
  }

  if (!customer.contactPersons || !customer.contactPersons[contactIndex]) {
    throw new AppError(httpStatus.NOT_FOUND, "Contact person not found");
  }

  // Update contact person
  Object.assign(customer.contactPersons[contactIndex], contactPersonData);

  const result = await customer.save();

  return result;
};

export const CustomerService = {
  createCustomer,
  getAllCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
  addContactPerson,
  updateContactPerson,
};
