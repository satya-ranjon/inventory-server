import mongoose, { Document, Schema } from "mongoose";

export interface IItem extends Document {
  type: "Goods" | "Service";
  name: string;
  sku: string;
  unit: string;
  isReturnable: boolean;
  dimensions?: {
    length: number;
    width: number;
    height: number;
    unit: string;
  };
  weight?: {
    value: number;
    unit: string;
  };
  manufacturer?: string;
  brand?: string;
  upc?: string;
  ean?: string;
  isbn?: string;
  mpn?: string;

  // Sales Information
  sellingPrice: number;
  salesAccount: string;
  description?: string;
  tax?: string;

  // Purchase Information
  costPrice: number;
  costAccount: string;
  preferredVendor?: string;

  // Inventory Tracking
  inventoryAccount?: string;
  openingStock?: number;
  reorderPoint?: number;
  inventoryValuationMethod?: string;

  createdAt: Date;
  updatedAt: Date;
}

const ItemSchema: Schema = new Schema(
  {
    type: {
      type: String,
      enum: ["Goods", "Service"],
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    sku: {
      type: String,
      unique: true,
      sparse: true,
    },
    unit: {
      type: String,
      required: true,
    },
    isReturnable: {
      type: Boolean,
      default: false,
    },
    dimensions: {
      length: Number,
      width: Number,
      height: Number,
      unit: String,
    },
    weight: {
      value: Number,
      unit: String,
    },
    manufacturer: String,
    brand: String,
    upc: String,
    ean: String,
    isbn: String,
    mpn: String,

    // Sales Information
    sellingPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    salesAccount: {
      type: String,
      required: true,
    },
    description: String,
    tax: String,

    // Purchase Information
    costPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    costAccount: {
      type: String,
      required: true,
    },
    preferredVendor: String,

    // Inventory Tracking
    inventoryAccount: String,
    openingStock: {
      type: Number,
      min: 0,
    },
    reorderPoint: {
      type: Number,
      min: 0,
    },
    inventoryValuationMethod: String,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IItem>("Item", ItemSchema);
