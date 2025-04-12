import express from "express";
import { CustomerController } from "../modules/Customer/customer.controller";
import validateRequest from "../middlewares/validateRequest";
import { CustomerValidation } from "../modules/Customer/customer.validation";

const router = express.Router();

// GET all customers
router.get("/", CustomerController.getAllCustomers);

// GET single customer
router.get("/:id", CustomerController.getSingleCustomer);

// CREATE new customer
router.post(
  "/create",
  validateRequest(CustomerValidation.createCustomerValidationSchema),
  CustomerController.createCustomer
);

// UPDATE customer
router.patch(
  "/:id",
  validateRequest(CustomerValidation.updateCustomerValidationSchema),
  CustomerController.updateCustomer
);

// DELETE customer
router.delete("/:id", CustomerController.deleteCustomer);

export default router;
