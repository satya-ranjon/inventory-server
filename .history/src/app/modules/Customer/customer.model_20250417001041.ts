import mongoose, { Schema } from "mongoose";
import { ICustomer, TCustomerModel } from "./customer.interface";

const addressSchema = new Schema(
  {
    address: {
      type: String,
      required: true,
    },
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
  },
  { _id: false }
);

const customerSchema = new Schema<ICustomer>(
  {
    customerName: {
      type: String,
      required: true,
    },
    contactNumber: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: function () {
        return this.customerType === "Business";
      },
    },
    address: {
      type: addressSchema,
      required: function () {
        return this.customerType === "Business";
      },
    },
    customerType: {
      type: String,
      enum: ["Business", "Individual"],
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

// Create indexes for frequently searched fields
customerSchema.index({ customerName: 1 });
customerSchema.index({ email: 1 });
customerSchema.index({ customerType: 1 });
customerSchema.index({ contactNumber: 1 });

export const Customer = mongoose.model<ICustomer, TCustomerModel>(
  "Customer",
  customerSchema
);
