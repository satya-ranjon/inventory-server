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
      payment: payload.payment || 0,
      due: payload.payment ? total - payload.payment : total,
    };

    const salesOrder = await SalesOrder.create([newOrder], { session });

    // Update customer due amount
    await Customer.findByIdAndUpdate(
      payload.customer,
      { $inc: { due: newOrder.due } },
      { session }
    );

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
