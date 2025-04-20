import mongoose, { Schema } from "mongoose";
import { ICustomer, TCustomerModel } from "./customer.interface";

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
      type: String,
      required: function () {
        return this.customerType === "Business";
      },
    },
    customerType: {
      type: String,
      enum: ["Business", "Individual"],
      required: true,
    },
    due: {
      type: Number,
      default: 0,
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
