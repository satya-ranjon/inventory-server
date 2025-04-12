import express from "express";
import { SalesOrderController } from "../modules/SalesOrder/salesOrder.controller";
import validateRequest from "../middlewares/validateRequest";
import { SalesOrderValidation } from "../modules/SalesOrder/salesOrder.validation";

const router = express.Router();

// GET all sales orders
router.get("/", SalesOrderController.getAllSalesOrders);

// GET single sales order
router.get("/:id", SalesOrderController.getSingleSalesOrder);

// CREATE new sales order
router.post(
  "/create",
  validateRequest(SalesOrderValidation.createSalesOrderValidationSchema),
  SalesOrderController.createSalesOrder
);

// UPDATE sales order
router.patch(
  "/:id",
  validateRequest(SalesOrderValidation.updateSalesOrderValidationSchema),
  SalesOrderController.updateSalesOrder
);

// DELETE sales order
router.delete("/:id", SalesOrderController.deleteSalesOrder);

export default router;
