import { Model, Document } from "mongoose";

export type TDimensions = {
  length: number;
  width: number;
  height: number;
  unit: string;
};

export type TWeight = {
  value: number;
  unit: string;
};

export type TItem = {
  name: string;
  sku: string;
  isReturnable: boolean;
  dimensions?: TDimensions;
  weight?: TWeight;
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
  costAccount: string;
  preferredVendor?: string;

  // Inventory Tracking
  inventoryAccount?: string;
  openingStock?: number;
  reorderPoint?: number;
  inventoryValuationMethod?: string;
};

export interface IItem extends Document, TItem {
  createdAt: Date;
  updatedAt: Date;
}

export type TItemModel = Model<IItem>;

export type TItemFilters = {
  searchTerm?: string;
  name?: string;
  sku?: string;
  minPrice?: number;
  maxPrice?: number;
};
