import mongoose from "mongoose";
import { TItem, TItemFilters } from "./item.interface";
import { Item } from "./item.model";
import QueryBuilder from "../../builder/QueryBuilder";
import { itemSearchableFields } from "./item.constant";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import { isValidObjectId } from "mongoose";

const createItem = async (payload: TItem) => {
  const result = await Item.create(payload);
  return result;
};

const getAllItems = async (filters: TItemFilters) => {
  const { searchTerm, minPrice, maxPrice, ...filterData } = filters;

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      $or: itemSearchableFields.map((field) => ({
        [field]: {
          $regex: searchTerm,
          $options: "i",
        },
      })),
    });
  }

  if (Object.keys(filterData).length) {
    andConditions.push({
      $and: Object.entries(filterData).map(([field, value]) => ({
        [field]: value,
      })),
    });
  }

  if (minPrice !== undefined) {
    andConditions.push({ sellingPrice: { $gte: minPrice } });
  }

  if (maxPrice !== undefined) {
    andConditions.push({ sellingPrice: { $lte: maxPrice } });
  }

  const whereConditions =
    andConditions.length > 0 ? { $and: andConditions } : {};

  const itemQuery = Item.find(whereConditions);

  const queryBuilder = new QueryBuilder(itemQuery, filters)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await queryBuilder.modelQuery;
  const total = await Item.countDocuments(whereConditions);

  return {
    meta: {
      page: queryBuilder.query.page || 1,
      limit: queryBuilder.query.limit || 10,
      total,
    },
    data: result,
  };
};

const getItemById = async (id: string) => {
  const result = await Item.findById(id);

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Item not found");
  }

  return result;
};

const updateItem = async (id: string, payload: Partial<TItem>) => {
  const result = await Item.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Item not found");
  }

  return result;
};

const deleteItem = async (id: string) => {
  // Add validation to check if item is used in sales orders before deletion
  const result = await Item.findByIdAndDelete(id);

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Item not found");
  }

  return result;
};

const updateInventory = async (id: string, quantity: number) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const item = await Item.findById(id).session(session);

    if (!item) {
      throw new AppError(httpStatus.NOT_FOUND, "Item not found");
    }

    const currentStock = item.openingStock || 0;
    const updatedItem = await Item.findByIdAndUpdate(
      id,
      { openingStock: currentStock + quantity },
      { new: true, runValidators: true, session }
    );

    await session.commitTransaction();
    session.endSession();

    return updatedItem;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const getLowStockItems = async () => {
  const items = await Item.find({
    type: "Goods",
    $expr: {
      $and: [
        { $ne: [{ $ifNull: ["$reorderPoint", 0] }, 0] },
        { $lt: [{ $ifNull: ["$openingStock", 0] }, "$reorderPoint"] },
      ],
    },
  });

  return items;
};

const getSingleItem = async (id: string): Promise<TItem | null> => {
  if (!isValidObjectId(id)) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid item ID");
  }

  const item = await Item.findById(id);

  if (!item) {
    throw new AppError(httpStatus.NOT_FOUND, "Item not found");
  }

  return item;
};

export const ItemService = {
  createItem,
  getAllItems,
  getSingleItem,
  getItemById,
  updateItem,
  deleteItem,
  updateInventory,
  getLowStockItems,
};
