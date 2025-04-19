import { z } from "zod";

const orderItemValidationSchema = z.object({
  item: z.string().refine((val) => val.length === 24, {
    message: "Invalid item ID format",
  }),
  quantity: z.number().positive(),
  rate: z.number().nonnegative(),
  amount: z.number().nonnegative().optional(),
  discount: z.number().nonnegative().optional(),
});

const discountValidationSchema = z.object({
  type: z.enum(["percentage", "amount"]),
  value: z.number().nonnegative(),
});

const attachmentValidationSchema = z.object({
  fileName: z.string(),
  fileUrl: z.string().url({ message: "Invalid URL format" }),
});

const createSalesOrderValidationSchema = z.object({
  body: z.object({
    orderNumber: z.string().optional(),
    customer: z.string().refine((val) => val.length === 24, {
      message: "Invalid customer ID format",
    }),
    reference: z.string().optional(),
    salesOrderDate: z.string().datetime().optional(),
    expectedShipmentDate: z.string().datetime().optional(),
    paymentTerms: z.string(),
    deliveryMethod: z.string().optional(),
    salesPerson: z.string().optional(),

    items: z.array(orderItemValidationSchema).nonempty({
      message: "At least one item is required",
    }),

    discount: discountValidationSchema.optional(),
    shippingCharges: z.number().nonnegative().optional(),
    adjustment: z.number().optional(),

    customerNotes: z.string().optional(),
    termsAndConditions: z.string().optional(),

    status: z
      .enum(["Draft", "Confirmed", "Shipped", "Delivered", "Cancelled"])
      .optional(),
    payment: z.number().nonnegative().optional(),
    due: z.number().optional(),
    attachments: z.array(attachmentValidationSchema).optional(),
  }),
});

const updateSalesOrderValidationSchema = z.object({
  body: z.object({
    reference: z.string().optional(),
    expectedShipmentDate: z.string().datetime().optional(),
    paymentTerms: z.string().optional(),
    deliveryMethod: z.string().optional(),
    salesPerson: z.string().optional(),

    items: z.array(orderItemValidationSchema).optional(),

    discount: discountValidationSchema.optional(),
    shippingCharges: z.number().nonnegative().optional(),
    adjustment: z.number().optional(),

    customerNotes: z.string().optional(),
    termsAndConditions: z.string().optional(),

    payment: z.number().nonnegative().optional(),

    attachments: z.array(attachmentValidationSchema).optional(),
  }),
});

const updateOrderStatusValidationSchema = z.object({
  body: z.object({
    status: z.enum(["Draft", "Confirmed", "Shipped", "Delivered", "Cancelled"]),
  }),
});

const updatePaymentValidationSchema = z.object({
  body: z.object({
    payment: z.number().nonnegative(),
  }),
});

export const SalesOrderValidation = {
  createSalesOrderValidationSchema,
  updateSalesOrderValidationSchema,
  updateOrderStatusValidationSchema,
  updatePaymentValidationSchema,
};
