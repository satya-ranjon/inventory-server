"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SalesOrderValidation = void 0;
const zod_1 = require("zod");
const orderItemValidationSchema = zod_1.z.object({
    item: zod_1.z.string().refine((val) => val.length === 24, {
        message: "Invalid item ID format",
    }),
    quantity: zod_1.z.number().positive(),
    rate: zod_1.z.number().nonnegative(),
    tax: zod_1.z.string().optional(),
    amount: zod_1.z.number().nonnegative().optional(),
});
const discountValidationSchema = zod_1.z.object({
    type: zod_1.z.enum(["percentage", "amount"]),
    value: zod_1.z.number().nonnegative(),
});
const attachmentValidationSchema = zod_1.z.object({
    fileName: zod_1.z.string(),
    fileUrl: zod_1.z.string().url({ message: "Invalid URL format" }),
});
const createSalesOrderValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        orderNumber: zod_1.z.string().optional(),
        customer: zod_1.z.string().refine((val) => val.length === 24, {
            message: "Invalid customer ID format",
        }),
        reference: zod_1.z.string().optional(),
        salesOrderDate: zod_1.z.string().datetime().optional(),
        expectedShipmentDate: zod_1.z.string().datetime().optional(),
        paymentTerms: zod_1.z.string(),
        deliveryMethod: zod_1.z.string().optional(),
        salesPerson: zod_1.z.string().optional(),
        items: zod_1.z.array(orderItemValidationSchema).nonempty({
            message: "At least one item is required",
        }),
        discount: discountValidationSchema.optional(),
        shippingCharges: zod_1.z.number().nonnegative().optional(),
        adjustment: zod_1.z.number().optional(),
        customerNotes: zod_1.z.string().optional(),
        termsAndConditions: zod_1.z.string().optional(),
        status: zod_1.z
            .enum(["Draft", "Confirmed", "Shipped", "Delivered", "Cancelled"])
            .optional(),
        attachments: zod_1.z.array(attachmentValidationSchema).optional(),
    }),
});
const updateSalesOrderValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        reference: zod_1.z.string().optional(),
        expectedShipmentDate: zod_1.z.string().datetime().optional(),
        paymentTerms: zod_1.z.string().optional(),
        deliveryMethod: zod_1.z.string().optional(),
        salesPerson: zod_1.z.string().optional(),
        items: zod_1.z.array(orderItemValidationSchema).optional(),
        discount: discountValidationSchema.optional(),
        shippingCharges: zod_1.z.number().nonnegative().optional(),
        adjustment: zod_1.z.number().optional(),
        customerNotes: zod_1.z.string().optional(),
        termsAndConditions: zod_1.z.string().optional(),
        attachments: zod_1.z.array(attachmentValidationSchema).optional(),
    }),
});
const updateOrderStatusValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        status: zod_1.z.enum(["Draft", "Confirmed", "Shipped", "Delivered", "Cancelled"]),
    }),
});
exports.SalesOrderValidation = {
    createSalesOrderValidationSchema,
    updateSalesOrderValidationSchema,
    updateOrderStatusValidationSchema,
};
//# sourceMappingURL=salesOrder.validation.js.map