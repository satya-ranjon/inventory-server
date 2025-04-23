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
exports.SalesOrder = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const orderItemSchema = new mongoose_1.Schema({
    item: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Item",
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        min: 0,
    },
    rate: {
        type: Number,
        required: true,
        min: 0,
    },
    amount: {
        type: Number,
        required: true,
        min: 0,
    },
    discount: {
        type: Number,
        min: 0,
    },
}, { _id: false });
const discountSchema = new mongoose_1.Schema({
    type: {
        type: String,
        enum: ["percentage", "amount"],
        required: true,
    },
    value: {
        type: Number,
        required: true,
        min: 0,
    },
}, { _id: false });
const salesOrderSchema = new mongoose_1.Schema({
    orderNumber: {
        type: String,
        required: true,
        unique: true,
    },
    customer: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Customer",
        required: true,
    },
    reference: String,
    salesOrderDate: {
        type: Date,
        required: true,
        default: Date.now,
    },
    paymentTerms: {
        type: String,
        required: true,
    },
    deliveryMethod: String,
    salesPerson: String,
    items: [orderItemSchema],
    subTotal: {
        type: Number,
        required: true,
        min: 0,
    },
    discount: discountSchema,
    shippingCharges: {
        type: Number,
        min: 0,
    },
    adjustment: Number,
    total: {
        type: Number,
        required: true,
        min: 0,
    },
    customerNotes: String,
    termsAndConditions: String,
    status: {
        type: String,
        enum: ["Draft", "Confirmed", "Shipped", "Delivered", "Cancelled"],
        default: "Draft",
    },
    payment: {
        type: Number,
        default: 0,
        min: 0,
    },
    previousDue: {
        type: Number,
        default: 0,
        min: 0,
    },
    due: {
        type: Number,
        min: 0,
    },
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
    },
});
salesOrderSchema.index({ orderNumber: 1 });
salesOrderSchema.index({ customer: 1 });
salesOrderSchema.index({ status: 1 });
salesOrderSchema.index({ salesOrderDate: -1 });
salesOrderSchema.index({ total: 1 });
salesOrderSchema.pre("save", function (next) {
    const salesOrder = this;
    salesOrder.subTotal = salesOrder.items.reduce((sum, item) => sum + item.amount, 0);
    let total = salesOrder.subTotal;
    if (salesOrder.discount) {
        if (salesOrder.discount.type === "percentage") {
            total -= (total * salesOrder.discount.value) / 100;
        }
        else {
            total -= salesOrder.discount.value;
        }
    }
    if (salesOrder.shippingCharges) {
        total += salesOrder.shippingCharges;
    }
    if (salesOrder.adjustment) {
        total += salesOrder.adjustment;
    }
    salesOrder.total = total;
    if (salesOrder.payment !== undefined) {
        salesOrder.due = total - salesOrder.payment;
        if (salesOrder.previousDue !== undefined) {
            salesOrder.due += salesOrder.previousDue;
        }
    }
    else {
        salesOrder.due = total;
        if (salesOrder.previousDue !== undefined) {
            salesOrder.due += salesOrder.previousDue;
        }
    }
    next();
});
exports.SalesOrder = mongoose_1.default.model("SalesOrder", salesOrderSchema);
//# sourceMappingURL=salesOrder.model.js.map