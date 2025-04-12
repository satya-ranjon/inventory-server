import express from "express";
import {
  getAllCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  addContactPerson,
  updateContactPerson,
  searchCustomers,
  getCustomerOrders,
} from "../controllers/customerController";

const router = express.Router();

// Get all customers
router.get("/", getAllCustomers);

// Search customers
router.get("/search", searchCustomers);

// Get single customer
router.get("/:id", getCustomerById);

// Get customer orders
router.get("/:id/orders", getCustomerOrders);

// Create customer
router.post("/", createCustomer);

// Update customer
router.put("/:id", updateCustomer);

// Delete customer
router.delete("/:id", deleteCustomer);

// Add contact person
router.post("/:id/contacts", addContactPerson);

// Update contact person
router.put("/:id/contacts/:contactIndex", updateContactPerson);

export default router;
