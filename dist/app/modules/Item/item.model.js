"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Item = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const dimensionsSchema = new mongoose_1.Schema({
    length: { type: Number },
    width: { type: Number },
    height: { type: Number },
    unit: { type: String },
}, { _id: false });
const weightSchema = new mongoose_1.Schema({
    value: { type: Number },
    unit: { type: String },
}, { _id: false });
const itemSchema = new mongoose_1.Schema({
    type: {
        type: String,
        enum: ["Goods", "Service"],
        required: true,
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    sku: {
        type: String,
        unique: true,
        sparse: true,
    },
    unit: {
        type: String,
        required: true,
    },
    isReturnable: {
        type: Boolean,
        default: false,
    },
    dimensions: dimensionsSchema,
    weight: weightSchema,
    manufacturer: String,
    brand: String,
    upc: String,
    ean: String,
    isbn: String,
    mpn: String,
    sellingPrice: {
        type: Number,
        required: true,
        min: 0,
    },
    salesAccount: {
        type: String,
        required: true,
    },
    description: String,
    tax: String,
    costPrice: {
        type: Number,
        required: true,
        min: 0,
    },
    costAccount: {
        type: String,
        required: true,
    },
    preferredVendor: String,
    inventoryAccount: String,
    openingStock: {
        type: Number,
        min: 0,
    },
    reorderPoint: {
        type: Number,
        min: 0,
    },
    inventoryValuationMethod: String,
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
    },
});
itemSchema.index({ name: 1 });
itemSchema.index({ sku: 1 });
itemSchema.index({ type: 1 });
exports.Item = mongoose_1.default.model("Item", itemSchema);
//# sourceMappingURL=item.model.js.map