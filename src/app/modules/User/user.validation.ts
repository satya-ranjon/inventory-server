import { z } from "zod";

const createEmployeeValidationSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: "Name is required",
    }),
    email: z
      .string({
        required_error: "Email is required",
      })
      .email("Invalid email format"),
    password: z
      .string({
        required_error: "Password is required",
      })
      .min(6, "Password must be at least 6 characters"),
    permissions: z.array(
      z.enum(["item", "customer", "sales", "dashboard"], {
        required_error: "Valid permission is required",
      })
    ),
  }),
});

const updateProfileValidationSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: "Name is required",
    }),
    email: z
      .string({
        required_error: "Email is required",
      })
      .email("Invalid email format"),
  }),
});

export const UserValidation = {
  createEmployeeValidationSchema,
  updateProfileValidationSchema,
};
