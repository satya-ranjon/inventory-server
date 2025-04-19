import mongoose from "mongoose";
import {
  TOrderItem,
  TSalesOrder,
  TSalesOrderFilters,
} from "./salesOrder.interface";
import { SalesOrder } from "./salesOrder.model";
import { Item } from "../Item/item.model";
import { Customer } from "../Customer/customer.model";
import QueryBuilder from "../../builder/QueryBuilder";
import { salesOrderSearchableFields } from "./salesOrder.constant";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import { isValidObjectId } from "mongoose";

// Generate unique order number
const generateOrderNumber = async (): Promise<string> => {
  const today = new Date();
  const prefix = "SO";
  const year = today.getFullYear().toString().substr(-2);
  const month = (today.getMonth() + 1).toString().padStart(2, "0");

  // Find the latest order number with this prefix
  const latestOrder = await SalesOrder.findOne({
    orderNumber: new RegExp(`^${prefix}${year}${month}`),
  }).sort({ orderNumber: -1 });

  let nextNumber = 1;
  if (latestOrder) {
    // Extract the number part from the latest order number
    const latestNumberStr = latestOrder.orderNumber.slice(-4); // assuming 4 digits
    nextNumber = parseInt(latestNumberStr) + 1;
  }

  // Format with leading zeros (4 digits)
  const numberStr = nextNumber.toString().padStart(4, "0");

  return `${prefix}${year}${month}${numberStr}`;
};

// Create sales order
const createSalesOrder = async (payload: TSalesOrder) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Check if customer exists
    const customer = await Customer.findById(payload.customer).session(session);
    if (!customer) {
      throw new AppError(httpStatus.NOT_FOUND, "Customer not found");
    }

    // Process items and check inventory
    const processedItems: TOrderItem[] = [];

    for (const item of payload.items) {
      // Check if item exists
      const itemDoc = await Item.findById(item.item).session(session);
      if (!itemDoc) {
        throw new AppError(
          httpStatus.NOT_FOUND,
          `Item not found: ${item.item}`
        );
      }

      // Check inventory - removed type check
      if (item.quantity > (itemDoc.openingStock || 0)) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          `Not enough stock for item: ${itemDoc.name}. Available: ${
            itemDoc.openingStock || 0
          }, Requested: ${item.quantity}`
        );
      }

      // Calculate amount if not provided
      const amount = item.amount || item.quantity * item.rate;

      // Apply item-level discount if provided
      let finalAmount = amount;
      if (item.discount && item.discount > 0) {
        finalAmount = amount - item.discount;
      }

      processedItems.push({
        ...item,
        amount: finalAmount,
      });

      // Update inventory - removed type check
      await Item.findByIdAndUpdate(
        item.item,
        { $inc: { openingStock: -item.quantity } },
        { session }
      );
    }

    // Generate order number if not provided
    if (!payload.orderNumber) {
      payload.orderNumber = await generateOrderNumber();
    }

    // Calculate initial subtotal
    const subTotal = processedItems.reduce((sum, item) => sum + item.amount, 0);

    // Calculate total
    let total = subTotal;
    if (payload.discount) {
      if (payload.discount.type === "percentage") {
        total -= (total * payload.discount.value) / 100;
      } else {
        total -= payload.discount.value;
      }
    }

    if (payload.shippingCharges) {
      total += payload.shippingCharges;
    }

    if (payload.adjustment) {
      total += payload.adjustment;
    }

    // Create sales order
    const newOrder = {
      ...payload,
      items: processedItems,
      subTotal,
      total,
      status: payload.status || "Draft",
    };

    const salesOrder = await SalesOrder.create([newOrder], { session });

    await session.commitTransaction();
    session.endSession();

    // Return complete sales order with populated references
    return SalesOrder.findById(salesOrder[0]._id)
      .populate("customer")
      .populate("items.item");
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

// Get all sales orders with filtering
const getAllSalesOrders = async (filters: TSalesOrderFilters) => {
  const { searchTerm, fromDate, toDate, minAmount, maxAmount, ...filterData } =
    filters;

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      $or: salesOrderSearchableFields.map((field) => ({
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

  // Date range filtering
  if (fromDate || toDate) {
    const dateFilter: any = {};
    if (fromDate) {
      dateFilter.$gte = new Date(fromDate);
    }
    if (toDate) {
      dateFilter.$lte = new Date(toDate);
    }
    andConditions.push({ salesOrderDate: dateFilter });
  }

  // Amount range filtering
  if (minAmount !== undefined || maxAmount !== undefined) {
    const amountFilter: any = {};
    if (minAmount !== undefined) {
      amountFilter.$gte = minAmount;
    }
    if (maxAmount !== undefined) {
      amountFilter.$lte = maxAmount;
    }
    andConditions.push({ total: amountFilter });
  }

  const whereConditions =
    andConditions.length > 0 ? { $and: andConditions } : {};

  const salesOrderQuery = SalesOrder.find(whereConditions)
    .populate("customer", "displayName email")
    .populate("items.item", "name sku");

  const queryBuilder = new QueryBuilder(salesOrderQuery, filters)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await queryBuilder.modelQuery;
  const total = await SalesOrder.countDocuments(whereConditions);

  return {
    meta: {
      page: queryBuilder.query.page || 1,
      limit: queryBuilder.query.limit || 10,
      total,
    },
    data: result,
  };
};

// Get a single sales order
const getSalesOrderById = async (id: string) => {
  const result = await SalesOrder.findById(id)
    .populate("customer")
    .populate("items.item");

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Sales order not found");
  }

  return result;
};

// Update sales order
const updateSalesOrder = async (id: string, payload: Partial<TSalesOrder>) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Find the original order
    const originalOrder = await SalesOrder.findById(id).session(session);
    if (!originalOrder) {
      throw new AppError(httpStatus.NOT_FOUND, "Sales order not found");
    }

    // Prevent updates if status is Delivered or Cancelled
    if (
      originalOrder.status === "Delivered" ||
      originalOrder.status === "Cancelled"
    ) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        `Cannot update order with status: ${originalOrder.status}`
      );
    }

    // Process items if provided
    if (payload.items) {
      // Restore original inventory first
      for (const item of originalOrder.items) {
        await Item.findByIdAndUpdate(
          item.item,
          { $inc: { openingStock: item.quantity } },
          { session }
        );
      }

      // Process new items
      const processedItems: TOrderItem[] = [];

      for (const item of payload.items) {
        // Check if item exists
        const itemDoc = await Item.findById(item.item).session(session);
        if (!itemDoc) {
          throw new AppError(
            httpStatus.NOT_FOUND,
            `Item not found: ${item.item}`
          );
        }

        // Check inventory - removed type check
        if (item.quantity > (itemDoc.openingStock || 0)) {
          throw new AppError(
            httpStatus.BAD_REQUEST,
            `Not enough stock for item: ${itemDoc.name}. Available: ${
              itemDoc.openingStock || 0
            }, Requested: ${item.quantity}`
          );
        }

        // Calculate amount if not provided
        const amount = item.amount || item.quantity * item.rate;

        // Apply item-level discount if provided
        let finalAmount = amount;
        if (item.discount && item.discount > 0) {
          finalAmount = amount - item.discount;
        }

        processedItems.push({
          ...item,
          amount: finalAmount,
        });

        // Update inventory - removed type check
        await Item.findByIdAndUpdate(
          item.item,
          { $inc: { openingStock: -item.quantity } },
          { session }
        );
      }

      payload.items = processedItems;

      // Recalculate subtotal
      payload.subTotal = processedItems.reduce(
        (sum, item) => sum + item.amount,
        0
      );

      // Recalculate total
      let total = payload.subTotal;

      const discount = payload.discount || originalOrder.discount;
      if (discount) {
        if (discount.type === "percentage") {
          total -= (total * discount.value) / 100;
        } else {
          total -= discount.value;
        }
      }

      const shippingCharges =
        payload.shippingCharges !== undefined
          ? payload.shippingCharges
          : originalOrder.shippingCharges;
      if (shippingCharges) {
        total += shippingCharges;
      }

      const adjustment =
        payload.adjustment !== undefined
          ? payload.adjustment
          : originalOrder.adjustment;
      if (adjustment) {
        total += adjustment;
      }

      payload.total = total;
    }

    // Update the order
    const result = await SalesOrder.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true,
      session,
    })
      .populate("customer", "displayName email")
      .populate("items.item", "name sku");

    await session.commitTransaction();
    session.endSession();

    return result;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

// Update order status
const updateOrderStatus = async (id: string, status: string) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const salesOrder = await SalesOrder.findById(id).session(session);
    if (!salesOrder) {
      throw new AppError(httpStatus.NOT_FOUND, "Sales order not found");
    }

    // Handle cancellation
    if (status === "Cancelled" && salesOrder.status !== "Cancelled") {
      // Restore inventory for cancelled orders - removed type check
      for (const item of salesOrder.items) {
        await Item.findByIdAndUpdate(
          item.item,
          { $inc: { openingStock: item.quantity } },
          { session }
        );
      }
    }

    // Update the status
    const result = await SalesOrder.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true, session }
    );

    await session.commitTransaction();
    session.endSession();

    return result;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

// Delete sales order
const deleteSalesOrder = async (id: string) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const salesOrder = await SalesOrder.findById(id).session(session);
    if (!salesOrder) {
      throw new AppError(httpStatus.NOT_FOUND, "Sales order not found");
    }

    // Restore inventory - removed type check
    for (const item of salesOrder.items) {
      await Item.findByIdAndUpdate(
        item.item,
        { $inc: { openingStock: item.quantity } },
        { session }
      );
    }

    // Delete the order
    await SalesOrder.findByIdAndDelete(id).session(session);

    await session.commitTransaction();
    session.endSession();

    return { success: true };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const getSingleSalesOrder = async (id: string): Promise<TSalesOrder | null> => {
  if (!isValidObjectId(id)) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid sales order ID");
  }

  const salesOrder = await SalesOrder.findById(id);

  if (!salesOrder) {
    throw new AppError(httpStatus.NOT_FOUND, "Sales order not found");
  }

  return salesOrder;
};

export const SalesOrderService = {
  createSalesOrder,
  getAllSalesOrders,
  getSalesOrderById,
  updateSalesOrder,
  updateOrderStatus,
  deleteSalesOrder,
  getSingleSalesOrder,
};
