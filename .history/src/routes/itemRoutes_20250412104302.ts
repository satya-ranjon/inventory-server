import express from "express";
import {
  getAllItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
  updateInventory,
  getLowStockItems,
  searchItems,
} from "../controllers/itemController";

const router = express.Router();

// Get all items
router.get("/", getAllItems);

// Search items
router.get("/search", searchItems);

// Get low stock items
router.get("/low-stock", getLowStockItems);

// Get single item
router.get("/:id", getItemById);

// Create item
router.post("/", createItem);

// Update item
router.put("/:id", updateItem);

// Update inventory
router.patch("/:id/inventory", updateInventory);

// Delete item
router.delete("/:id", deleteItem);

export default router;
