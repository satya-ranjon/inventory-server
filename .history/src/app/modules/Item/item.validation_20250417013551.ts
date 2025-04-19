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
    name: z.string().min(1),
    quantity: z.number().min(0),
    warranty: z.string().nullable().optional(),
    entryBy: z.string(),
    price: z.number().min(0),
  }),
});

const updateItemValidationSchema = z.object({
  body: z.object({
    name: z.string().min(1).optional(),
    quantity: z.number().min(0).optional(),
    warranty: z.string().nullable().optional(),
    entryBy: z.string().optional(),
    price: z.number().min(0).optional(),
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
