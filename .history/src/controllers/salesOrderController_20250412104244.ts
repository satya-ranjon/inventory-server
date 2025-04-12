import { Request, Response } from "express";
import SalesOrder from "../models/SalesOrder";
import Customer from "../models/Customer";
import Item from "../models/Item";
import mongoose from "mongoose";

// Get all sales orders
export const getAllSalesOrders = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const salesOrders = await SalesOrder.find()
      .sort({ createdAt: -1 })
      .populate("customer", "displayName email")
      .populate("items.item", "name sku");

    res.status(200).json(salesOrders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching sales orders", error });
  }
};

// Get single sales order
export const getSalesOrderById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const salesOrder = await SalesOrder.findById(req.params.id)
      .populate("customer")
      .populate("items.item");

    if (!salesOrder) {
      res.status(404).json({ message: "Sales order not found" });
      return;
    }

    res.status(200).json(salesOrder);
  } catch (error) {
    res.status(500).json({ message: "Error fetching sales order", error });
  }
};

// Generate order number
async function generateOrderNumber(): Promise<string> {
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
}

// Create sales order
export const createSalesOrder = async (
  req: Request,
  res: Response
): Promise<void> => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Check if customer exists
    const customer = await Customer.findById(req.body.customer).session(
      session
    );
    if (!customer) {
      await session.abortTransaction();
      session.endSession();
      res.status(404).json({ message: "Customer not found" });
      return;
    }

    // Validate and process items
    const itemsData = req.body.items;
    const processedItems = [];

    for (const itemData of itemsData) {
      // Check if item exists
      const item = await Item.findById(itemData.item).session(session);
      if (!item) {
        await session.abortTransaction();
        session.endSession();
        res.status(404).json({ message: `Item not found: ${itemData.item}` });
        return;
      }

      // For goods items, check if there's enough stock
      if (
        item.type === "Goods" &&
        itemData.quantity > (item.openingStock || 0)
      ) {
        await session.abortTransaction();
        session.endSession();
        res.status(400).json({
          message: `Not enough stock for item: ${item.name}. Available: ${
            item.openingStock || 0
          }, Requested: ${itemData.quantity}`,
        });
        return;
      }

      // Calculate amount if not provided
      const amount = itemData.amount || itemData.quantity * itemData.rate;

      processedItems.push({
        item: itemData.item,
        quantity: itemData.quantity,
        rate: itemData.rate,
        tax: itemData.tax,
        amount,
      });

      // Update inventory for goods items
      if (item.type === "Goods") {
        const currentStock = item.openingStock || 0;
        await Item.findByIdAndUpdate(
          itemData.item,
          { openingStock: currentStock - itemData.quantity },
          { session }
        );
      }
    }

    // Generate order number if not provided
    if (!req.body.orderNumber) {
      req.body.orderNumber = await generateOrderNumber();
    }

    // Create sales order
    const salesOrderData = {
      ...req.body,
      items: processedItems,
      // Calculate initial subtotal
      subTotal: processedItems.reduce((sum, item) => sum + item.amount, 0),
    };

    const salesOrder = new SalesOrder(salesOrderData);
    await salesOrder.save({ session });

    await session.commitTransaction();
    session.endSession();

    // Fetch the complete sales order with populated references
    const createdSalesOrder = await SalesOrder.findById(salesOrder._id)
      .populate("customer", "displayName email")
      .populate("items.item", "name sku");

    res.status(201).json(createdSalesOrder);
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(400).json({ message: "Error creating sales order", error });
  }
};

// Update sales order
export const updateSalesOrder = async (
  req: Request,
  res: Response
): Promise<void> => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Find the original sales order
    const originalOrder = await SalesOrder.findById(req.params.id).session(
      session
    );
    if (!originalOrder) {
      await session.abortTransaction();
      session.endSession();
      res.status(404).json({ message: "Sales order not found" });
      return;
    }

    // Prevent updates if status is Delivered or Cancelled
    if (
      originalOrder.status === "Delivered" ||
      originalOrder.status === "Cancelled"
    ) {
      await session.abortTransaction();
      session.endSession();
      res
        .status(400)
        .json({
          message: `Cannot update order with status: ${originalOrder.status}`,
        });
      return;
    }

    // Restore original inventory quantities first
    for (const item of originalOrder.items) {
      const itemDoc = await Item.findById(item.item).session(session);
      if (itemDoc && itemDoc.type === "Goods") {
        const currentStock = itemDoc.openingStock || 0;
        await Item.findByIdAndUpdate(
          item.item,
          { openingStock: currentStock + item.quantity },
          { session }
        );
      }
    }

    // Process updated items
    if (req.body.items) {
      const itemsData = req.body.items;
      const processedItems = [];

      for (const itemData of itemsData) {
        // Check if item exists
        const item = await Item.findById(itemData.item).session(session);
        if (!item) {
          await session.abortTransaction();
          session.endSession();
          res.status(404).json({ message: `Item not found: ${itemData.item}` });
          return;
        }

        // For goods items, check if there's enough stock
        if (
          item.type === "Goods" &&
          itemData.quantity > (item.openingStock || 0)
        ) {
          await session.abortTransaction();
          session.endSession();
          res.status(400).json({
            message: `Not enough stock for item: ${item.name}. Available: ${
              item.openingStock || 0
            }, Requested: ${itemData.quantity}`,
          });
          return;
        }

        // Calculate amount if not provided
        const amount = itemData.amount || itemData.quantity * itemData.rate;

        processedItems.push({
          item: itemData.item,
          quantity: itemData.quantity,
          rate: itemData.rate,
          tax: itemData.tax,
          amount,
        });

        // Update inventory for goods items
        if (item.type === "Goods") {
          const currentStock = item.openingStock || 0;
          await Item.findByIdAndUpdate(
            itemData.item,
            { openingStock: currentStock - itemData.quantity },
            { session }
          );
        }
      }

      req.body.items = processedItems;
      req.body.subTotal = processedItems.reduce(
        (sum, item) => sum + item.amount,
        0
      );
    }

    // Update sales order
    const updatedSalesOrder = await SalesOrder.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true, session }
    )
      .populate("customer", "displayName email")
      .populate("items.item", "name sku");

    await session.commitTransaction();
    session.endSession();

    res.status(200).json(updatedSalesOrder);
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(400).json({ message: "Error updating sales order", error });
  }
};

// Update sales order status
export const updateOrderStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { status } = req.body;

    if (!status) {
      res.status(400).json({ message: "Status is required" });
      return;
    }

    const validStatuses = [
      "Draft",
      "Confirmed",
      "Shipped",
      "Delivered",
      "Cancelled",
    ];
    if (!validStatuses.includes(status)) {
      res.status(400).json({ message: "Invalid status" });
      return;
    }

    const salesOrder = await SalesOrder.findById(req.params.id);
    if (!salesOrder) {
      res.status(404).json({ message: "Sales order not found" });
      return;
    }

    // Handle cancellation
    if (status === "Cancelled" && salesOrder.status !== "Cancelled") {
      // Restore inventory for cancelled orders
      for (const item of salesOrder.items) {
        const itemDoc = await Item.findById(item.item);
        if (itemDoc && itemDoc.type === "Goods") {
          const currentStock = itemDoc.openingStock || 0;
          await Item.findByIdAndUpdate(item.item, {
            openingStock: currentStock + item.quantity,
          });
        }
      }
    }

    // Update status
    const updatedOrder = await SalesOrder.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: "Error updating order status", error });
  }
};

// Delete sales order
export const deleteSalesOrder = async (
  req: Request,
  res: Response
): Promise<void> => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const salesOrder = await SalesOrder.findById(req.params.id).session(
      session
    );
    if (!salesOrder) {
      await session.abortTransaction();
      session.endSession();
      res.status(404).json({ message: "Sales order not found" });
      return;
    }

    // Restore inventory quantities
    for (const item of salesOrder.items) {
      const itemDoc = await Item.findById(item.item).session(session);
      if (itemDoc && itemDoc.type === "Goods") {
        const currentStock = itemDoc.openingStock || 0;
        await Item.findByIdAndUpdate(
          item.item,
          { openingStock: currentStock + item.quantity },
          { session }
        );
      }
    }

    // Delete the sales order
    await SalesOrder.findByIdAndDelete(req.params.id).session(session);

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({ message: "Sales order deleted successfully" });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ message: "Error deleting sales order", error });
  }
};

// Search sales orders
export const searchSalesOrders = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { term, status, customer, dateFrom, dateTo } = req.query;

    const query: any = {};

    // Search by term
    if (term) {
      query.orderNumber = { $regex: term, $options: "i" };
    }

    // Filter by status
    if (status) {
      query.status = status;
    }

    // Filter by customer
    if (customer) {
      query.customer = customer;
    }

    // Filter by date range
    if (dateFrom || dateTo) {
      query.salesOrderDate = {};
      if (dateFrom) {
        query.salesOrderDate.$gte = new Date(dateFrom as string);
      }
      if (dateTo) {
        query.salesOrderDate.$lte = new Date(dateTo as string);
      }
    }

    const salesOrders = await SalesOrder.find(query)
      .sort({ createdAt: -1 })
      .populate("customer", "displayName email")
      .populate("items.item", "name sku");

    res.status(200).json(salesOrders);
  } catch (error) {
    res.status(500).json({ message: "Error searching sales orders", error });
  }
};
