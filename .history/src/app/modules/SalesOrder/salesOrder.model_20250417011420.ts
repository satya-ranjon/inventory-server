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

const attachmentSchema = new Schema(
  {
    fileName: {
      type: String,
      required: true,
    },
    fileUrl: {
      type: String,
      required: true,
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
    expectedShipmentDate: Date,
    paymentTerms: {
      type: String,
      required: true,
    },
    deliveryMethod: String,
    salesPerson: String,

    items: [orderItemSchema],

    subTotal: {
      type: Number,
      required: true,
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

// Add middleware to calculate totals
salesOrderSchema.pre("save", function (next) {
  const salesOrder = this as unknown as ISalesOrder;

  // Calculate subtotal, already accounting for item-level discounts
  salesOrder.subTotal = salesOrder.items.reduce(
    (sum: number, item: any) => sum + item.amount,
    0
  );

  // Calculate total with discounts and charges
  let total = salesOrder.subTotal;

  if (salesOrder.discount) {
    if (salesOrder.discount.type === "percentage") {
      total -= (total * salesOrder.discount.value) / 100;
    } else {
      total -= salesOrder.discount.value;
    }
  }

  if (salesOrder.shippingCharges) {
    total += salesOrder.shippingCharges;
  }

  if (salesOrder.adjustment) {
    total += salesOrder.adjustment;
  }

  salesOrder.total = total;
  next();
});

export const SalesOrder = mongoose.model<ISalesOrder, TSalesOrderModel>(
  "SalesOrder",
  salesOrderSchema
);
