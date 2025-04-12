"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItemValidation = void 0;
const zod_1 = require("zod");
const dimensionsValidationSchema = zod_1.z.object({
    length: zod_1.z.number().optional(),
    width: zod_1.z.number().optional(),
    height: zod_1.z.number().optional(),
    unit: zod_1.z.string().optional(),
});
const weightValidationSchema = zod_1.z.object({
    value: zod_1.z.number().optional(),
    unit: zod_1.z.string().optional(),
});
const createItemValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        type: zod_1.z.enum(["Goods", "Service"]),
        name: zod_1.z.string().min(1),
        sku: zod_1.z.string().optional(),
        unit: zod_1.z.string(),
        isReturnable: zod_1.z.boolean().optional(),
        dimensions: dimensionsValidationSchema.optional(),
        weight: weightValidationSchema.optional(),
        manufacturer: zod_1.z.string().optional(),
        brand: zod_1.z.string().optional(),
        upc: zod_1.z.string().optional(),
        ean: zod_1.z.string().optional(),
        isbn: zod_1.z.string().optional(),
        mpn: zod_1.z.string().optional(),
        sellingPrice: zod_1.z.number().min(0),
        salesAccount: zod_1.z.string(),
        description: zod_1.z.string().optional(),
        tax: zod_1.z.string().optional(),
        costPrice: zod_1.z.number().min(0),
        costAccount: zod_1.z.string(),
        preferredVendor: zod_1.z.string().optional(),
        inventoryAccount: zod_1.z.string().optional(),
        openingStock: zod_1.z.number().min(0).optional(),
        reorderPoint: zod_1.z.number().min(0).optional(),
        inventoryValuationMethod: zod_1.z.string().optional(),
    }),
});
const updateItemValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        type: zod_1.z.enum(["Goods", "Service"]).optional(),
        name: zod_1.z.string().min(1).optional(),
        sku: zod_1.z.string().optional(),
        unit: zod_1.z.string().optional(),
        isReturnable: zod_1.z.boolean().optional(),
        dimensions: dimensionsValidationSchema.optional(),
        weight: weightValidationSchema.optional(),
        manufacturer: zod_1.z.string().optional(),
        brand: zod_1.z.string().optional(),
        upc: zod_1.z.string().optional(),
        ean: zod_1.z.string().optional(),
        isbn: zod_1.z.string().optional(),
        mpn: zod_1.z.string().optional(),
        sellingPrice: zod_1.z.number().min(0).optional(),
        salesAccount: zod_1.z.string().optional(),
        description: zod_1.z.string().optional(),
        tax: zod_1.z.string().optional(),
        costPrice: zod_1.z.number().min(0).optional(),
        costAccount: zod_1.z.string().optional(),
        preferredVendor: zod_1.z.string().optional(),
        inventoryAccount: zod_1.z.string().optional(),
        openingStock: zod_1.z.number().min(0).optional(),
        reorderPoint: zod_1.z.number().min(0).optional(),
        inventoryValuationMethod: zod_1.z.string().optional(),
    }),
});
const updateInventoryValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        quantity: zod_1.z.number(),
    }),
});
exports.ItemValidation = {
    createItemValidationSchema,
    updateItemValidationSchema,
    updateInventoryValidationSchema,
};
//# sourceMappingURL=item.validation.js.map