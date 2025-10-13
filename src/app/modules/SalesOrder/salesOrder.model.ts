import mongoose, { Schema } from "mongoose";
import { ISalesOrder, TSalesOrderModel } from "./salesOrder.interface";

const orderItemSchema = new Schema(
  {
    item: {
      type: Schema.Types.ObjectId,
      ref: "Item",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
    },
    rate: {
      type: Number,
      required: true,
      min: 0,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    discount: {
      type: Number,
      min: 0,
    },
  },
  { _id: false }
);

const discountSchema = new Schema(
  {
    type: {
      type: String,
      enum: ["percentage", "amount"],
      required: true,
    },
    value: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: false }
);

const salesOrderSchema = new Schema<ISalesOrder>(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
    },
    customer: {
      type: Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    reference: String,
    salesOrderDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    paymentTerms: {
      type: String,
      required: true,
    },
    deliveryMethod: String,
    salesPerson: String,

    items: [orderItemSchema],

    subTotal: {
      type: Number,
      required: false,
      min: 0,
    },
    discount: discountSchema,
    shippingCharges: {
      type: Number,
      min: 0,
    },
    adjustment: Number,
    total: {
      type: Number,
      required: true,
      min: 0,
    },

    customerNotes: String,
    termsAndConditions: String,

    status: {
      type: String,
      enum: ["Draft", "Confirmed", "Shipped", "Delivered", "Cancelled"],
      default: "Draft",
    },
    payment: {
      type: Number,
      default: 0,
      min: 0,
    },
    previousDue: {
      type: Number,
      default: 0,
      min: 0,
    },
    due: {
      type: Number,
      min: 0,
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
salesOrderSchema.index({ orderNumber: 1 });
salesOrderSchema.index({ customer: 1 });
salesOrderSchema.index({ status: 1 });
salesOrderSchema.index({ salesOrderDate: -1 });
salesOrderSchema.index({ total: 1 });

// Note: Calculation logic has been moved to the frontend
// The backend now accepts pre-calculated values from the frontend
// This ensures consistency between what the user sees and what gets saved

export const SalesOrder = mongoose.model<ISalesOrder, TSalesOrderModel>(
  "SalesOrder",
  salesOrderSchema
);
