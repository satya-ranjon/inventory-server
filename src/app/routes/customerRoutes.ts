import express from "express";
import { CustomerController } from "../modules/Customer/customer.controller";
import validateRequest from "../middlewares/validateRequest";
import { CustomerValidation } from "../modules/Customer/customer.validation";
import auth from "../middlewares/auth";

const router = express.Router();

// GET all customers
router.get("/", CustomerController.getAllCustomers);

// GET single customer
router.get("/:id", CustomerController.getSingleCustomer);

// CREATE new customer - protected route
router.post(
  "/create",
  auth("admin", "manager"),
  validateRequest(CustomerValidation.createCustomerValidationSchema),
  CustomerController.createCustomer
);

// UPDATE customer - protected route
router.patch(
  "/:id",
  auth("admin", "manager"),
  validateRequest(CustomerValidation.updateCustomerValidationSchema),
  CustomerController.updateCustomer
);

// DELETE customer - protected route
router.delete("/:id", auth("admin"), CustomerController.deleteCustomer);

export default router;
