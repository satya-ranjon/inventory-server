import express from "express";
import {
  getAllSalesOrders,
  getSalesOrderById,
  createSalesOrder,
  updateSalesOrder,
  deleteSalesOrder,
  updateOrderStatus,
  searchSalesOrders,
} from "../controllers/salesOrderController";

const router = express.Router();

// Get all sales orders
router.get("/", getAllSalesOrders);

// Search sales orders
router.get("/search", searchSalesOrders);

// Get single sales order
router.get("/:id", getSalesOrderById);

// Create sales order
router.post("/", createSalesOrder);

// Update sales order
router.put("/:id", updateSalesOrder);

// Update sales order status
router.patch("/:id/status", updateOrderStatus);

// Delete sales order
router.delete("/:id", deleteSalesOrder);

export default router;
