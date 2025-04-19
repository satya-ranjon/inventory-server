"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerValidation = void 0;
const zod_1 = require("zod");
const addressValidationSchema = zod_1.z.object({
    address: zod_1.z.string().min(1, { message: "Address is required" }),
    city: zod_1.z.string().min(1, { message: "City is required" }),
    state: zod_1.z.string().min(1, { message: "State is required" }),
    zipCode: zod_1.z.string().min(1, { message: "ZIP/Postal code is required" }),
});
const createCustomerValidationSchema = zod_1.z.object({
    body: zod_1.z
        .object({
        customerName: zod_1.z.string().min(1, { message: "Customer name is required" }),
        contactNumber: zod_1.z
            .string()
            .min(1, { message: "Contact number is required" }),
        email: zod_1.z.string().email().optional(),
        address: addressValidationSchema.optional(),
        customerType: zod_1.z.enum(["Business", "Individual"]),
        due: zod_1.z.number().optional(),
    })
        .refine((data) => {
        if (data.customerType === "Business" && !data.email) {
            return false;
        }
        return true;
    }, {
        message: "Email is required for Business customers",
        path: ["email"],
    })
        .refine((data) => {
        if (data.customerType === "Business" && !data.address) {
            return false;
        }
        return true;
    }, {
        message: "Address is required for Business customers",
        path: ["address"],
    }),
});
const updateCustomerValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        customerName: zod_1.z
            .string()
            .min(1, { message: "Customer name is required" })
            .optional(),
        contactNumber: zod_1.z
            .string()
            .min(1, { message: "Contact number is required" })
            .optional(),
        email: zod_1.z.string().email().optional(),
        address: addressValidationSchema.optional(),
        customerType: zod_1.z.enum(["Business", "Individual"]).optional(),
        due: zod_1.z.number().optional(),
    }),
});
exports.CustomerValidation = {
    createCustomerValidationSchema,
    updateCustomerValidationSchema,
};
//# sourceMappingURL=customer.validation.js.map