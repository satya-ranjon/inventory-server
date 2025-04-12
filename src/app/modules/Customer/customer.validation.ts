import { z } from "zod";

const addressValidationSchema = z.object({
  attention: z.string().optional(),
  country: z.string().min(1, { message: "Country is required" }),
  address: z.string().min(1, { message: "Address is required" }),
  street2: z.string().optional(),
  city: z.string().min(1, { message: "City is required" }),
  state: z.string().min(1, { message: "State is required" }),
  zipCode: z.string().min(1, { message: "ZIP/Postal code is required" }),
  phone: z.string().optional(),
  faxNumber: z.string().optional(),
});

const primaryContactValidationSchema = z.object({
  salutation: z.string().optional(),
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
});

const phoneValidationSchema = z.object({
  workPhone: z.string().optional(),
  mobile: z.string().optional(),
});

const contactPersonValidationSchema = z.object({
  salutation: z.string().optional(),
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  email: z.string().email().optional(),
  workPhone: z.string().optional(),
  mobile: z.string().optional(),
});

const createCustomerValidationSchema = z.object({
  body: z.object({
    customerType: z.enum(["Business", "Individual"]),
    primaryContact: primaryContactValidationSchema,
    companyName: z.string().optional(),
    displayName: z.string().min(1, { message: "Display name is required" }),
    email: z.string().email({ message: "Valid email is required" }),
    phone: phoneValidationSchema,

    billingAddress: addressValidationSchema,
    shippingAddress: addressValidationSchema.optional(),
    contactPersons: z.array(contactPersonValidationSchema).optional(),

    taxId: z.string().optional(),
    companyId: z.string().optional(),
    currency: z.string().min(1, { message: "Currency is required" }),
    paymentTerms: z.string().min(1, { message: "Payment terms are required" }),
    enablePortal: z.boolean().optional(),
    portalLanguage: z.string().optional(),

    customFields: z.record(z.string(), z.any()).optional(),
    reportingTags: z.array(z.string()).optional(),
    remarks: z.string().optional(),
  }),
});

const updateCustomerValidationSchema = z.object({
  body: z.object({
    customerType: z.enum(["Business", "Individual"]).optional(),
    primaryContact: primaryContactValidationSchema.optional(),
    companyName: z.string().optional(),
    displayName: z
      .string()
      .min(1, { message: "Display name is required" })
      .optional(),
    email: z.string().email({ message: "Valid email is required" }).optional(),
    phone: phoneValidationSchema.optional(),

    billingAddress: addressValidationSchema.optional(),
    shippingAddress: addressValidationSchema.optional(),
    contactPersons: z.array(contactPersonValidationSchema).optional(),

    taxId: z.string().optional(),
    companyId: z.string().optional(),
    currency: z.string().min(1, { message: "Currency is required" }).optional(),
    paymentTerms: z
      .string()
      .min(1, { message: "Payment terms are required" })
      .optional(),
    enablePortal: z.boolean().optional(),
    portalLanguage: z.string().optional(),

    customFields: z.record(z.string(), z.any()).optional(),
    reportingTags: z.array(z.string()).optional(),
    remarks: z.string().optional(),
  }),
});

const addContactPersonValidationSchema = z.object({
  body: contactPersonValidationSchema,
});

export const CustomerValidation = {
  createCustomerValidationSchema,
  updateCustomerValidationSchema,
  addContactPersonValidationSchema,
};
