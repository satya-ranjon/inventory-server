import mongoose, { Schema } from "mongoose";
import { IItem, TItemModel } from "./item.interface";

const itemSchema = new Schema<IItem>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
    },
    warranty: {
      type: String,
      default: null,
    },
    entryBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    price: {
      type: Number,
      required: true,
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
itemSchema.index({ name: 1 });

export const Item = mongoose.model<IItem, TItemModel>("Item", itemSchema);
