import { z } from "zod";

const dimensionsValidationSchema = z.object({
  length: z.number().optional(),
  width: z.number().optional(),
  height: z.number().optional(),
  unit: z.string().optional(),
});

const weightValidationSchema = z.object({
  value: z.number().optional(),
  unit: z.string().optional(),
});

const createItemValidationSchema = z.object({
  body: z.object({
    type: z.enum(["Goods", "Service"]),
    name: z.string().min(1),
    sku: z.string().optional(),
    unit: z.string(),
    isReturnable: z.boolean().optional(),
    dimensions: dimensionsValidationSchema.optional(),
    weight: weightValidationSchema.optional(),
    manufacturer: z.string().optional(),
    brand: z.string().optional(),
    upc: z.string().optional(),
    ean: z.string().optional(),
    isbn: z.string().optional(),
    mpn: z.string().optional(),

    sellingPrice: z.number().min(0),
    salesAccount: z.string(),
    description: z.string().optional(),
    tax: z.string().optional(),

    costPrice: z.number().min(0),
    costAccount: z.string(),
    preferredVendor: z.string().optional(),

    inventoryAccount: z.string().optional(),
    openingStock: z.number().min(0).optional(),
    reorderPoint: z.number().min(0).optional(),
    inventoryValuationMethod: z.string().optional(),
  }),
});

const updateItemValidationSchema = z.object({
  body: z.object({
    type: z.enum(["Goods", "Service"]).optional(),
    name: z.string().min(1).optional(),
    sku: z.string().optional(),
    unit: z.string().optional(),
    isReturnable: z.boolean().optional(),
    dimensions: dimensionsValidationSchema.optional(),
    weight: weightValidationSchema.optional(),
    manufacturer: z.string().optional(),
    brand: z.string().optional(),
    upc: z.string().optional(),
    ean: z.string().optional(),
    isbn: z.string().optional(),
    mpn: z.string().optional(),

    sellingPrice: z.number().min(0).optional(),
    salesAccount: z.string().optional(),
    description: z.string().optional(),
    tax: z.string().optional(),

    costPrice: z.number().min(0).optional(),
    costAccount: z.string().optional(),
    preferredVendor: z.string().optional(),

    inventoryAccount: z.string().optional(),
    openingStock: z.number().min(0).optional(),
    reorderPoint: z.number().min(0).optional(),
    inventoryValuationMethod: z.string().optional(),
  }),
});

const updateInventoryValidationSchema = z.object({
  body: z.object({
    quantity: z.number(),
  }),
});

export const ItemValidation = {
  createItemValidationSchema,
  updateItemValidationSchema,
  updateInventoryValidationSchema,
};
