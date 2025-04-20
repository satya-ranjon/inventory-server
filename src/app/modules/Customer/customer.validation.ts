import { z } from "zod";

const createCustomerValidationSchema = z.object({
  body: z
    .object({
      customerName: z.string().min(1, { message: "Customer name is required" }),
      contactNumber: z
        .string()
        .min(1, { message: "Contact number is required" }),
      email: z.string().email().optional(),
      address: z.string().optional(),
      customerType: z.enum(["Business", "Individual"]),
      due: z.number().optional(),
    })
    .refine(
      (data) => {
        if (data.customerType === "Business" && !data.email) {
          return false;
        }
        return true;
      },
      {
        message: "Email is required for Business customers",
        path: ["email"],
      }
    )
    .refine(
      (data) => {
        if (data.customerType === "Business" && !data.address) {
          return false;
        }
        return true;
      },
      {
        message: "Address is required for Business customers",
        path: ["address"],
      }
    ),
});

const updateCustomerValidationSchema = z.object({
  body: z.object({
    customerName: z
      .string()
      .min(1, { message: "Customer name is required" })
      .optional(),
    contactNumber: z
      .string()
      .min(1, { message: "Contact number is required" })
      .optional(),
    email: z.string().email().optional(),
    address: z.string().optional(),
    customerType: z.enum(["Business", "Individual"]).optional(),
    due: z.number().optional(),
  }),
});

export const CustomerValidation = {
  createCustomerValidationSchema,
  updateCustomerValidationSchema,
};
