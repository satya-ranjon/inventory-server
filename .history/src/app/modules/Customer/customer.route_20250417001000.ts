import express from "express";
import { CustomerController } from "./customer.controller";
import validateRequest from "../../middlewares/validateRequest";
import { CustomerValidation } from "./customer.validation";

const router = express.Router();

// Get all customers
router.get("/", CustomerController.getAllCustomers);

// Create a new customer
router.post(
  "/",
  validateRequest(CustomerValidation.createCustomerValidationSchema),
  CustomerController.createCustomer
);

// Get a single customer
router.get("/:id", CustomerController.getCustomerById);

// Update a customer
router.put(
  "/:id",
  validateRequest(CustomerValidation.updateCustomerValidationSchema),
  CustomerController.updateCustomer
);

// Delete a customer
router.delete("/:id", CustomerController.deleteCustomer);

export const CustomerRoutes = router;
