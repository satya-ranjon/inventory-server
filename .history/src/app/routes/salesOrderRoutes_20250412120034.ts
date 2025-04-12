import express from "express";
import { SalesOrderController } from "../modules/SalesOrder/salesOrder.controller";
import validateRequest from "../middlewares/validateRequest";
import { SalesOrderValidation } from "../modules/SalesOrder/salesOrder.validation";
import auth from "../middlewares/auth";

const router = express.Router();

// GET all sales orders
router.get("/", SalesOrderController.getAllSalesOrders);

// GET single sales order
router.get("/:id", SalesOrderController.getSingleSalesOrder);

// CREATE new sales order - protected route
router.post(
  "/create",
  auth("admin", "manager", "employee"),
  validateRequest(SalesOrderValidation.createSalesOrderValidationSchema),
  SalesOrderController.createSalesOrder
);

// UPDATE sales order - protected route
router.patch(
  "/:id",
  auth("admin", "manager"),
  validateRequest(SalesOrderValidation.updateSalesOrderValidationSchema),
  SalesOrderController.updateSalesOrder
);

// DELETE sales order - protected route
router.delete("/:id", auth("admin"), SalesOrderController.deleteSalesOrder);

export default router;
