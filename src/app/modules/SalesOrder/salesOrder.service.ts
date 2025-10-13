import mongoose from "mongoose";
import {
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

    // Validate items and update inventory
    for (const item of payload.items) {
      // Check if item exists
      const itemDoc = await Item.findById(item.item).session(session);
      if (!itemDoc) {
        throw new AppError(
          httpStatus.NOT_FOUND,
          `Item not found: ${item.item}`
        );
      }

      // Check if enough stock is available
      if (item.quantity > (itemDoc.quantity || 0)) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          `Not enough stock for item: ${itemDoc.name}. Available: ${
            itemDoc.quantity || 0
          }, Requested: ${item.quantity}`
        );
      }

      // Update inventory
      await Item.findByIdAndUpdate(
        item.item,
        { $inc: { quantity: -item.quantity } },
        { session }
      );
    }

    // Generate order number if not provided
    if (!payload.orderNumber) {
      payload.orderNumber = await generateOrderNumber();
    }

    // Calculate subTotal from items if not provided (safety fallback)
    if (!payload.subTotal) {
      payload.subTotal = payload.items.reduce((sum, item) => sum + (item.amount || 0), 0);
    }

    // Use the calculated values from the frontend
    // No recalculation - trust the frontend calculations
    const newOrder = {
      ...payload,
      status: payload.status || "Draft",
      payment: payload.payment || 0,
    };

    const salesOrder = await SalesOrder.create([newOrder], { session });

    // Update customer due amount with the final due from the order
    await Customer.findByIdAndUpdate(
      payload.customer,
      { $set: { due: newOrder.due || 0 } },
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    // Return complete sales order with populated references
    return SalesOrder.findById(salesOrder[0]._id)
      .populate(
        "customer",
        "customerName contactNumber email address customerType due"
      )
      .populate("items.item");
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

// Update sales order
const updateSalesOrder = async (id: string, payload: Partial<TSalesOrder>) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Check if sales order exists
    const existingSalesOrder = await SalesOrder.findById(id).session(session);
    if (!existingSalesOrder) {
      throw new AppError(httpStatus.NOT_FOUND, "Sales order not found");
    }

    // Store the original due amount to calculate the difference later
    const originalDue = existingSalesOrder.due || 0;

    // If items are being updated, validate and update inventory
    if (payload.items && payload.items.length > 0) {
      // Revert inventory changes from existing items
      for (const item of existingSalesOrder.items) {
        await Item.findByIdAndUpdate(
          item.item,
          { $inc: { quantity: item.quantity } },
          { session }
        );
      }

      // Validate new items and update inventory
      for (const item of payload.items) {
        // Check if item exists
        const itemDoc = await Item.findById(item.item).session(session);
        if (!itemDoc) {
          throw new AppError(
            httpStatus.NOT_FOUND,
            `Item not found: ${item.item}`
          );
        }

        // Check inventory
        if (item.quantity > (itemDoc.quantity || 0)) {
          throw new AppError(
            httpStatus.BAD_REQUEST,
            `Not enough stock for item: ${itemDoc.name}. Available: ${
              itemDoc.quantity || 0
            }, Requested: ${item.quantity}`
          );
        }

        // Update inventory
        await Item.findByIdAndUpdate(
          item.item,
          { $inc: { quantity: -item.quantity } },
          { session }
        );
      }
    }

    // Use the calculated values from the frontend
    // No recalculation - trust the frontend calculations
    // Update the sales order
    const updatedSalesOrder = await SalesOrder.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true,
      session,
    });

    // Calculate the change in due amount
    const dueDifference = (updatedSalesOrder?.due || 0) - originalDue;

    // Update the customer due amount if there's a change
    if (dueDifference !== 0) {
      await Customer.findByIdAndUpdate(
        existingSalesOrder.customer,
        { $inc: { due: dueDifference } },
        { session }
      );
    }

    await session.commitTransaction();
    session.endSession();

    // Return complete sales order with populated references
    return SalesOrder.findById(updatedSalesOrder?._id)
      .populate(
        "customer",
        "customerName contactNumber email address customerType due"
      )
      .populate("items.item");
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
      // Restore inventory for cancelled orders
      for (const item of salesOrder.items) {
        await Item.findByIdAndUpdate(
          item.item,
          { $inc: { quantity: item.quantity } },
          { session }
        );
      }

      // Reduce customer due amount when order is cancelled
      if (salesOrder.due && salesOrder.due > 0) {
        await Customer.findByIdAndUpdate(
          salesOrder.customer,
          { $inc: { due: -salesOrder.due } },
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

    // Restore inventory
    for (const item of salesOrder.items) {
      await Item.findByIdAndUpdate(
        item.item,
        { $inc: { quantity: item.quantity } },
        { session }
      );
    }

    // Reduce customer due amount when order is deleted
    if (salesOrder.due && salesOrder.due > 0) {
      await Customer.findByIdAndUpdate(
        salesOrder.customer,
        { $inc: { due: -salesOrder.due } },
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

// Get all sales orders with filtering
const getAllSalesOrders = async (filters: TSalesOrderFilters) => {
  const {
    searchTerm,
    fromDate,
    toDate,
    minAmount,
    maxAmount,
    payment,
    due,
    page,
    limit,
    sort,
    fields,
    ...filterData
  } = filters;

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

  // Payment filtering
  if (payment !== undefined) {
    andConditions.push({ payment });
  }

  // Due amount filtering
  if (due !== undefined) {
    andConditions.push({ due });
  }

  const whereConditions =
    andConditions.length > 0 ? { $and: andConditions } : {};

  const defaultLimit = 8;

  const salesOrderQuery = SalesOrder.find(whereConditions)
    .populate("customer")
    .populate("items.item", "name sku");

  const queryBuilder = new QueryBuilder(salesOrderQuery, {
    page,
    limit: limit || defaultLimit,
    sort,
    fields,
  })
    .sort()
    .paginate()
    .fields();

  const result = await queryBuilder.modelQuery;
  const total = await SalesOrder.countDocuments(whereConditions);

  // Calculate totals using aggregation
  const totals = await SalesOrder.aggregate([
    { $match: whereConditions },
    {
      $group: {
        _id: null,
        totalDue: { $sum: "$due" },
        totalPayment: { $sum: "$payment" },
        totalAmount: { $sum: "$total" },
      },
    },
  ]).exec();

  // Set default values if no records found
  const totalsDue = totals.length > 0 ? totals[0].totalDue : 0;
  const totalsPayment = totals.length > 0 ? totals[0].totalPayment : 0;
  const totalAmount = totals.length > 0 ? totals[0].totalAmount : 0;

  return {
    meta: {
      page: Number(page) || 1,
      limit: Number(limit) || defaultLimit,
      total,
      totalDue: totalsDue,
      totalPayment: totalsPayment,
      totalPaid: totalsPayment,
      totalAmount: totalAmount,
    },
    data: result,
  };
};

// Get a single sales order
const getSalesOrderById = async (id: string) => {
  const result = await SalesOrder.findById(id)
    .populate(
      "customer",
      "customerName contactNumber email address customerType due"
    )
    .populate("items.item");

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Sales order not found");
  }

  return result;
};

const getSingleSalesOrder = async (id: string): Promise<TSalesOrder | null> => {
  if (!isValidObjectId(id)) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid sales order ID");
  }

  const salesOrder = await SalesOrder.findById(id)
    .populate("customer")
    .populate("items.item");

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
