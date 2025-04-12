import mongoose, { Document, Schema } from "mongoose";

export interface ISalesOrder extends Document {
  orderNumber: string;
  customer: mongoose.Types.ObjectId;
  reference?: string;
  salesOrderDate: Date;
  expectedShipmentDate?: Date;
  paymentTerms: string;
  deliveryMethod?: string;
  salesPerson?: string;

  items: Array<{
    item: mongoose.Types.ObjectId;
    quantity: number;
    rate: number;
    tax?: string;
    amount: number;
  }>;

  subTotal: number;
  discount?: {
    type: "percentage" | "amount";
    value: number;
  };
  shippingCharges?: number;
  adjustment?: number;
  total: number;

  customerNotes?: string;
  termsAndConditions?: string;

  status: "Draft" | "Confirmed" | "Shipped" | "Delivered" | "Cancelled";
  attachments?: Array<{
    fileName: string;
    fileUrl: string;
  }>;

  createdAt: Date;
  updatedAt: Date;
}

const SalesOrderSchema: Schema = new Schema(
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

    items: [
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
        tax: String,
        amount: {
          type: Number,
          required: true,
          min: 0,
        },
      },
    ],

    subTotal: {
      type: Number,
      required: true,
      min: 0,
    },
    discount: {
      type: {
        type: String,
        enum: ["percentage", "amount"],
      },
      value: {
        type: Number,
        min: 0,
      },
    },
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
    attachments: [
      {
        fileName: String,
        fileUrl: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Add middleware to calculate totals
SalesOrderSchema.pre("save", function (next) {
  const salesOrder = this as ISalesOrder;

  // Calculate subtotal
  salesOrder.subTotal = salesOrder.items.reduce(
    (sum, item) => sum + item.amount,
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

export default mongoose.model<ISalesOrder>("SalesOrder", SalesOrderSchema);
