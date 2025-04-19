import express from "express";
import { SalesOrderController } from "./salesOrder.controller";
import validateRequest from "../../middlewares/validateRequest";
import { SalesOrderValidation } from "./salesOrder.validation";

const router = express.Router();

// Get all sales orders
router.get("/", SalesOrderController.getAllSalesOrders);

// Create a new sales order
router.post(
  "/",
  validateRequest(SalesOrderValidation.createSalesOrderValidationSchema),
  SalesOrderController.createSalesOrder
);

// Get a single sales order
router.get("/:id", SalesOrderController.getSalesOrderById);

// Update a sales order
router.put(
  "/:id",
  validateRequest(SalesOrderValidation.updateSalesOrderValidationSchema),
  SalesOrderController.updateSalesOrder
);

// Update sales order status
router.patch(
  "/:id/status",
  validateRequest(SalesOrderValidation.updateOrderStatusValidationSchema),
  SalesOrderController.updateOrderStatus
);

// Update payment
router.patch("/:id/payment", SalesOrderController.updatePayment);

// Delete a sales order
router.delete("/:id", SalesOrderController.deleteSalesOrder);

export const SalesOrderRoutes = router;
