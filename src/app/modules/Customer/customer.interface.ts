import { Model, Document } from "mongoose";
import { ISalesOrder } from "../SalesOrder/salesOrder.interface";

export type TCustomerType = "Business" | "Individual";

export type TCustomer = {
  customerName: string;
  contactNumber: string;
  email?: string;
  address?: string;
  customerType: TCustomerType;
  due?: number;
};

export interface ICustomer extends Document, TCustomer {
  createdAt: Date;
  updatedAt: Date;
}

export type TCustomerModel = Model<ICustomer>;

export type TCustomerFilters = {
  searchTerm?: string;
  customerType?: TCustomerType;
  email?: string;
  contactNumber?: string;
};

// Response interface for customer with orders
export interface ICustomerWithOrders {
  customer: ICustomer;
  orders: ISalesOrder[];
}
