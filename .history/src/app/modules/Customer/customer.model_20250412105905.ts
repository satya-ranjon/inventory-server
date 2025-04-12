import mongoose, { Schema } from "mongoose";
import { ICustomer, TCustomerModel } from "./customer.interface";

const addressSchema = new Schema(
  {
    attention: String,
    country: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    street2: String,
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    zipCode: {
      type: String,
      required: true,
    },
    phone: String,
    faxNumber: String,
  },
  { _id: false }
);

const primaryContactSchema = new Schema(
  {
    salutation: String,
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

const phoneSchema = new Schema(
  {
    workPhone: String,
    mobile: String,
  },
  { _id: false }
);

const contactPersonSchema = new Schema(
  {
    salutation: String,
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: String,
    workPhone: String,
    mobile: String,
  },
  { _id: false }
);

const customerSchema = new Schema<ICustomer>(
  {
    customerType: {
      type: String,
      enum: ["Business", "Individual"],
      required: true,
    },
    primaryContact: primaryContactSchema,
    companyName: String,
    displayName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: phoneSchema,

    billingAddress: addressSchema,
    shippingAddress: addressSchema,
    contactPersons: [contactPersonSchema],

    taxId: String,
    companyId: String,
    currency: {
      type: String,
      required: true,
    },
    paymentTerms: {
      type: String,
      required: true,
    },
    enablePortal: {
      type: Boolean,
      default: false,
    },
    portalLanguage: {
      type: String,
      default: "English",
    },

    customFields: {
      type: Map,
      of: Schema.Types.Mixed,
    },
    reportingTags: [String],
    remarks: String,
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

// Create indexes for frequently searched fields
customerSchema.index({ displayName: 1 });
customerSchema.index({ email: 1 });
customerSchema.index({ customerType: 1 });
customerSchema.index({ "phone.mobile": 1 });
customerSchema.index({ "phone.workPhone": 1 });
customerSchema.index({ companyName: 1 });

export const Customer = mongoose.model<ICustomer, TCustomerModel>(
  "Customer",
  customerSchema
);
