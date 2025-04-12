import mongoose, { Schema } from "mongoose";
import { IItem, TItemModel } from "./item.interface";

const dimensionsSchema = new Schema(
  {
    length: { type: Number },
    width: { type: Number },
    height: { type: Number },
    unit: { type: String },
  },
  { _id: false }
);

const weightSchema = new Schema(
  {
    value: { type: Number },
    unit: { type: String },
  },
  { _id: false }
);

const itemSchema = new Schema<IItem>(
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
    dimensions: dimensionsSchema,
    weight: weightSchema,
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
    toJSON: {
      virtuals: true,
    },
  }
);

// Create indexes for frequently searched fields
itemSchema.index({ name: 1 });
itemSchema.index({ sku: 1 });
itemSchema.index({ type: 1 });

export const Item = mongoose.model<IItem, TItemModel>("Item", itemSchema);
