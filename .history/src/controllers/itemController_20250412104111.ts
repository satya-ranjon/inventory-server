import { Request, Response } from "express";
import Item, { IItem } from "../models/Item";

// Get all items
export const getAllItems = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const items = await Item.find().sort({ createdAt: -1 });
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: "Error fetching items", error });
  }
};

// Get single item
export const getItemById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      res.status(404).json({ message: "Item not found" });
      return;
    }
    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ message: "Error fetching item", error });
  }
};

// Create item
export const createItem = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const item = new Item(req.body);
    const savedItem = await item.save();
    res.status(201).json(savedItem);
  } catch (error) {
    res.status(400).json({ message: "Error creating item", error });
  }
};

// Update item
export const updateItem = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const item = await Item.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!item) {
      res.status(404).json({ message: "Item not found" });
      return;
    }
    res.status(200).json(item);
  } catch (error) {
    res.status(400).json({ message: "Error updating item", error });
  }
};

// Delete item
export const deleteItem = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const item = await Item.findByIdAndDelete(req.params.id);
    if (!item) {
      res.status(404).json({ message: "Item not found" });
      return;
    }
    res.status(200).json({ message: "Item deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting item", error });
  }
};

// Update inventory
export const updateInventory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { quantity } = req.body;

    if (typeof quantity !== "number") {
      res.status(400).json({ message: "Quantity must be a number" });
      return;
    }

    const item = await Item.findById(req.params.id);
    if (!item) {
      res.status(404).json({ message: "Item not found" });
      return;
    }

    // For service type items, don't allow inventory tracking
    if (item.type === "Service") {
      res
        .status(400)
        .json({ message: "Cannot update inventory for service items" });
      return;
    }

    // Update opening stock (or create if it doesn't exist)
    const currentStock = item.openingStock || 0;
    const updatedItem = await Item.findByIdAndUpdate(
      req.params.id,
      { openingStock: currentStock + quantity },
      { new: true, runValidators: true }
    );

    res.status(200).json(updatedItem);
  } catch (error) {
    res.status(500).json({ message: "Error updating inventory", error });
  }
};

// Get low stock items (below reorder point)
export const getLowStockItems = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const items = await Item.find({
      type: "Goods",
      $expr: {
        $and: [
          { $ne: [{ $ifNull: ["$reorderPoint", 0] }, 0] },
          { $lt: [{ $ifNull: ["$openingStock", 0] }, "$reorderPoint"] },
        ],
      },
    });

    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: "Error fetching low stock items", error });
  }
};

// Search items by name, SKU, or description
export const searchItems = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const searchTerm = req.query.term;

    if (!searchTerm) {
      res.status(400).json({ message: "Search term is required" });
      return;
    }

    const items = await Item.find({
      $or: [
        { name: { $regex: searchTerm, $options: "i" } },
        { sku: { $regex: searchTerm, $options: "i" } },
        { description: { $regex: searchTerm, $options: "i" } },
      ],
    });

    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: "Error searching items", error });
  }
};
