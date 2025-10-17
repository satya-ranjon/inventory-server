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
    amount: zod_1.z.number().nonnegative().optional(),
    discount: zod_1.z.number().nonnegative().optional(),
});
const discountValidationSchema = zod_1.z.object({
    type: zod_1.z.enum(["percentage", "amount"]),
    value: zod_1.z.number().nonnegative().optional(),
});
const createSalesOrderValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        orderNumber: zod_1.z.string().optional(),
        customer: zod_1.z.string().refine((val) => val.length === 24, {
            message: "Invalid customer ID format",
        }),
        reference: zod_1.z.string().optional(),
        salesOrderDate: zod_1.z.string().datetime().optional(),
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
        payment: zod_1.z.number().nonnegative().optional(),
        due: zod_1.z.number().optional(),
    }),
});
const updateSalesOrderValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        reference: zod_1.z.string().optional(),
        paymentTerms: zod_1.z.string().optional(),
        deliveryMethod: zod_1.z.string().optional(),
        salesPerson: zod_1.z.string().optional(),
        items: zod_1.z.array(orderItemValidationSchema).optional(),
        discount: discountValidationSchema.optional(),
        shippingCharges: zod_1.z.number().nonnegative().optional(),
        adjustment: zod_1.z.number().optional(),
        customerNotes: zod_1.z.string().optional(),
        termsAndConditions: zod_1.z.string().optional(),
        payment: zod_1.z.number().nonnegative().optional(),
    }),
});
const updateOrderStatusValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        status: zod_1.z.enum(["Draft", "Confirmed", "Shipped", "Delivered", "Cancelled"]),
    }),
});
const updatePaymentValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        payment: zod_1.z.number().nonnegative(),
    }),
});
const getSalesOrdersQueryValidationSchema = zod_1.z.object({
    query: zod_1.z.object({
        searchTerm: zod_1.z.string().optional(),
        orderNumber: zod_1.z.string().optional(),
        customer: zod_1.z.string().optional(),
        status: zod_1.z.enum(["Draft", "Confirmed", "Shipped", "Delivered", "Cancelled"]).optional(),
        fromDate: zod_1.z.string().datetime().optional(),
        toDate: zod_1.z.string().datetime().optional(),
        minAmount: zod_1.z.string().transform((val) => Number(val)).pipe(zod_1.z.number().nonnegative()).optional(),
        maxAmount: zod_1.z.string().transform((val) => Number(val)).pipe(zod_1.z.number().nonnegative()).optional(),
        payment: zod_1.z.string().transform((val) => Number(val)).pipe(zod_1.z.number().nonnegative()).optional(),
        previousDue: zod_1.z.string().transform((val) => Number(val)).pipe(zod_1.z.number()).optional(),
        due: zod_1.z.string().transform((val) => Number(val)).pipe(zod_1.z.number()).optional(),
        page: zod_1.z.string().transform((val) => Number(val)).pipe(zod_1.z.number().positive()).optional(),
        limit: zod_1.z.string().transform((val) => Number(val)).pipe(zod_1.z.number().positive()).optional(),
        sort: zod_1.z.string().optional(),
        fields: zod_1.z.string().optional(),
    }),
});
exports.SalesOrderValidation = {
    createSalesOrderValidationSchema,
    updateSalesOrderValidationSchema,
    updateOrderStatusValidationSchema,
    updatePaymentValidationSchema,
    getSalesOrdersQueryValidationSchema,
};
//# sourceMappingURL=salesOrder.validation.js.map