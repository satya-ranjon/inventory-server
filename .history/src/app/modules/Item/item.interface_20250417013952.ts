import { Model, Document, Types } from "mongoose";

export type TItem = {
  name: string;
  quantity: number;
  warranty: string | null;
  entryBy: Types.ObjectId; // User ID reference
  price: number;
};

export interface IItem extends Document, TItem {
  createdAt: Date;
  updatedAt: Date;
}

export type TItemModel = Model<IItem>;

export type TItemFilters = {
  searchTerm?: string;
  name?: string;
  minPrice?: number;
  maxPrice?: number;
};
