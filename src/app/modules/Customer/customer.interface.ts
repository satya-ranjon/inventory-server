import { Model, Document } from "mongoose";

export type TCustomerType = "Business" | "Individual";

export type TAddress = {
  attention?: string;
  country: string;
  address: string;
  street2?: string;
  city: string;
  state: string;
  zipCode: string;
  phone?: string;
  faxNumber?: string;
};

export type TContactPerson = {
  salutation?: string;
  firstName: string;
  lastName: string;
  email?: string;
  workPhone?: string;
  mobile?: string;
};

export type TPrimaryContact = {
  salutation?: string;
  firstName: string;
  lastName: string;
};

export type TPhone = {
  workPhone?: string;
  mobile?: string;
};

export type TCustomer = {
  customerType: TCustomerType;
  primaryContact: TPrimaryContact;
  companyName?: string;
  displayName: string;
  email: string;
  phone: TPhone;

  billingAddress: TAddress;
  shippingAddress?: TAddress;
  contactPersons?: TContactPerson[];

  taxId?: string;
  companyId?: string;
  currency: string;
  paymentTerms: string;
  enablePortal?: boolean;
  portalLanguage?: string;

  customFields?: Record<string, any>;
  reportingTags?: string[];
  remarks?: string;
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
  "phone.workPhone"?: string;
  "phone.mobile"?: string;
  companyName?: string;
};
