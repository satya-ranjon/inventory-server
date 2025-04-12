"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerValidation = void 0;
const zod_1 = require("zod");
const addressValidationSchema = zod_1.z.object({
    attention: zod_1.z.string().optional(),
    country: zod_1.z.string().min(1, { message: "Country is required" }),
    address: zod_1.z.string().min(1, { message: "Address is required" }),
    street2: zod_1.z.string().optional(),
    city: zod_1.z.string().min(1, { message: "City is required" }),
    state: zod_1.z.string().min(1, { message: "State is required" }),
    zipCode: zod_1.z.string().min(1, { message: "ZIP/Postal code is required" }),
    phone: zod_1.z.string().optional(),
    faxNumber: zod_1.z.string().optional(),
});
const primaryContactValidationSchema = zod_1.z.object({
    salutation: zod_1.z.string().optional(),
    firstName: zod_1.z.string().min(1, { message: "First name is required" }),
    lastName: zod_1.z.string().min(1, { message: "Last name is required" }),
});
const phoneValidationSchema = zod_1.z.object({
    workPhone: zod_1.z.string().optional(),
    mobile: zod_1.z.string().optional(),
});
const contactPersonValidationSchema = zod_1.z.object({
    salutation: zod_1.z.string().optional(),
    firstName: zod_1.z.string().min(1, { message: "First name is required" }),
    lastName: zod_1.z.string().min(1, { message: "Last name is required" }),
    email: zod_1.z.string().email().optional(),
    workPhone: zod_1.z.string().optional(),
    mobile: zod_1.z.string().optional(),
});
const createCustomerValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        customerType: zod_1.z.enum(["Business", "Individual"]),
        primaryContact: primaryContactValidationSchema,
        companyName: zod_1.z.string().optional(),
        displayName: zod_1.z.string().min(1, { message: "Display name is required" }),
        email: zod_1.z.string().email({ message: "Valid email is required" }),
        phone: phoneValidationSchema,
        billingAddress: addressValidationSchema,
        shippingAddress: addressValidationSchema.optional(),
        contactPersons: zod_1.z.array(contactPersonValidationSchema).optional(),
        taxId: zod_1.z.string().optional(),
        companyId: zod_1.z.string().optional(),
        currency: zod_1.z.string().min(1, { message: "Currency is required" }),
        paymentTerms: zod_1.z.string().min(1, { message: "Payment terms are required" }),
        enablePortal: zod_1.z.boolean().optional(),
        portalLanguage: zod_1.z.string().optional(),
        customFields: zod_1.z.record(zod_1.z.string(), zod_1.z.any()).optional(),
        reportingTags: zod_1.z.array(zod_1.z.string()).optional(),
        remarks: zod_1.z.string().optional(),
    }),
});
const updateCustomerValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        customerType: zod_1.z.enum(["Business", "Individual"]).optional(),
        primaryContact: primaryContactValidationSchema.optional(),
        companyName: zod_1.z.string().optional(),
        displayName: zod_1.z
            .string()
            .min(1, { message: "Display name is required" })
            .optional(),
        email: zod_1.z.string().email({ message: "Valid email is required" }).optional(),
        phone: phoneValidationSchema.optional(),
        billingAddress: addressValidationSchema.optional(),
        shippingAddress: addressValidationSchema.optional(),
        contactPersons: zod_1.z.array(contactPersonValidationSchema).optional(),
        taxId: zod_1.z.string().optional(),
        companyId: zod_1.z.string().optional(),
        currency: zod_1.z.string().min(1, { message: "Currency is required" }).optional(),
        paymentTerms: zod_1.z
            .string()
            .min(1, { message: "Payment terms are required" })
            .optional(),
        enablePortal: zod_1.z.boolean().optional(),
        portalLanguage: zod_1.z.string().optional(),
        customFields: zod_1.z.record(zod_1.z.string(), zod_1.z.any()).optional(),
        reportingTags: zod_1.z.array(zod_1.z.string()).optional(),
        remarks: zod_1.z.string().optional(),
    }),
});
const addContactPersonValidationSchema = zod_1.z.object({
    body: contactPersonValidationSchema,
});
exports.CustomerValidation = {
    createCustomerValidationSchema,
    updateCustomerValidationSchema,
    addContactPersonValidationSchema,
};
//# sourceMappingURL=customer.validation.js.map