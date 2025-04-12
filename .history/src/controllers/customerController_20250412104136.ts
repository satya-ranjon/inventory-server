import { Request, Response } from "express";
import Customer, { ICustomer } from "../models/Customer";
import SalesOrder from "../models/SalesOrder";

// Get all customers
export const getAllCustomers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const customers = await Customer.find().sort({ createdAt: -1 });
    res.status(200).json(customers);
  } catch (error) {
    res.status(500).json({ message: "Error fetching customers", error });
  }
};

// Get single customer
export const getCustomerById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      res.status(404).json({ message: "Customer not found" });
      return;
    }
    res.status(200).json(customer);
  } catch (error) {
    res.status(500).json({ message: "Error fetching customer", error });
  }
};

// Create customer
export const createCustomer = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Generate display name if not provided
    if (!req.body.displayName) {
      if (req.body.customerType === "Business" && req.body.companyName) {
        req.body.displayName = req.body.companyName;
      } else if (req.body.primaryContact) {
        const { firstName, lastName } = req.body.primaryContact;
        req.body.displayName = `${firstName} ${lastName}`;
      }
    }

    const customer = new Customer(req.body);
    const savedCustomer = await customer.save();
    res.status(201).json(savedCustomer);
  } catch (error) {
    res.status(400).json({ message: "Error creating customer", error });
  }
};

// Update customer
export const updateCustomer = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!customer) {
      res.status(404).json({ message: "Customer not found" });
      return;
    }
    res.status(200).json(customer);
  } catch (error) {
    res.status(400).json({ message: "Error updating customer", error });
  }
};

// Delete customer
export const deleteCustomer = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Check if customer has any sales orders
    const hasSalesOrders = await SalesOrder.exists({ customer: req.params.id });
    if (hasSalesOrders) {
      res.status(400).json({
        message:
          "Cannot delete customer with associated sales orders. Remove the sales orders first.",
      });
      return;
    }

    const customer = await Customer.findByIdAndDelete(req.params.id);
    if (!customer) {
      res.status(404).json({ message: "Customer not found" });
      return;
    }
    res.status(200).json({ message: "Customer deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting customer", error });
  }
};

// Add contact person to customer
export const addContactPerson = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      res.status(404).json({ message: "Customer not found" });
      return;
    }

    const contactPerson = req.body;

    // Validate required fields
    if (!contactPerson.firstName || !contactPerson.lastName) {
      res
        .status(400)
        .json({ message: "First name and last name are required" });
      return;
    }

    // Initialize contact persons array if it doesn't exist
    if (!customer.contactPersons) {
      customer.contactPersons = [];
    }

    customer.contactPersons.push(contactPerson);
    const updatedCustomer = await customer.save();

    res.status(200).json(updatedCustomer);
  } catch (error) {
    res.status(500).json({ message: "Error adding contact person", error });
  }
};

// Update contact person
export const updateContactPerson = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id, contactIndex } = req.params;
    const updatedContactPerson = req.body;

    const customer = await Customer.findById(id);
    if (!customer) {
      res.status(404).json({ message: "Customer not found" });
      return;
    }

    if (
      !customer.contactPersons ||
      !customer.contactPersons[parseInt(contactIndex)]
    ) {
      res.status(404).json({ message: "Contact person not found" });
      return;
    }

    // Update contact person
    customer.contactPersons[parseInt(contactIndex)] = {
      ...customer.contactPersons[parseInt(contactIndex)],
      ...updatedContactPerson,
    };

    const updatedCustomer = await customer.save();
    res.status(200).json(updatedCustomer);
  } catch (error) {
    res.status(500).json({ message: "Error updating contact person", error });
  }
};

// Search customers
export const searchCustomers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const searchTerm = req.query.term as string;

    if (!searchTerm) {
      res.status(400).json({ message: "Search term is required" });
      return;
    }

    const customers = await Customer.find({
      $or: [
        { "primaryContact.firstName": { $regex: searchTerm, $options: "i" } },
        { "primaryContact.lastName": { $regex: searchTerm, $options: "i" } },
        { displayName: { $regex: searchTerm, $options: "i" } },
        { companyName: { $regex: searchTerm, $options: "i" } },
        { email: { $regex: searchTerm, $options: "i" } },
        { "phone.workPhone": { $regex: searchTerm, $options: "i" } },
        { "phone.mobile": { $regex: searchTerm, $options: "i" } },
      ],
    });

    res.status(200).json(customers);
  } catch (error) {
    res.status(500).json({ message: "Error searching customers", error });
  }
};

// Get customer orders
export const getCustomerOrders = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const customerId = req.params.id;

    // Check if customer exists
    const customerExists = await Customer.exists({ _id: customerId });
    if (!customerExists) {
      res.status(404).json({ message: "Customer not found" });
      return;
    }

    const orders = await SalesOrder.find({ customer: customerId })
      .sort({ createdAt: -1 })
      .populate("items.item");

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching customer orders", error });
  }
};
