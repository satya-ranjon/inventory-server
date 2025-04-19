import { Model, Document } from "mongoose";

export type TCustomerType = "Business" | "Individual";

export type TAddress = {
  address: string;
  city: string;
  state: string;
  zipCode: string;
};

export type TCustomer = {
  customerName: string;
  contactNumber: string;
  email?: string;
  address?: TAddress;
  customerType: TCustomerType;
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
