"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItemValidation = void 0;
const zod_1 = require("zod");
const createItemValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(1),
        quantity: zod_1.z.number().min(0),
        warranty: zod_1.z.string().nullable().optional(),
        price: zod_1.z.number().min(0),
    }),
});
const updateItemValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(1).optional(),
        quantity: zod_1.z.number().min(0).optional(),
        warranty: zod_1.z.string().nullable().optional(),
        price: zod_1.z.number().min(0).optional(),
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