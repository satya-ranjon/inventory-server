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
exports.Customer = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const addressSchema = new mongoose_1.Schema({
    attention: String,
    country: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    street2: String,
    city: {
        type: String,
        required: true,
    },
    state: {
        type: String,
        required: true,
    },
    zipCode: {
        type: String,
        required: true,
    },
    phone: String,
    faxNumber: String,
}, { _id: false });
const primaryContactSchema = new mongoose_1.Schema({
    salutation: String,
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
}, { _id: false });
const phoneSchema = new mongoose_1.Schema({
    workPhone: String,
    mobile: String,
}, { _id: false });
const contactPersonSchema = new mongoose_1.Schema({
    salutation: String,
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: String,
    workPhone: String,
    mobile: String,
}, { _id: false });
const customerSchema = new mongoose_1.Schema({
    customerType: {
        type: String,
        enum: ["Business", "Individual"],
        required: true,
    },
    primaryContact: primaryContactSchema,
    companyName: String,
    displayName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    phone: phoneSchema,
    billingAddress: addressSchema,
    shippingAddress: addressSchema,
    contactPersons: [contactPersonSchema],
    taxId: String,
    companyId: String,
    currency: {
        type: String,
        required: true,
    },
    paymentTerms: {
        type: String,
        required: true,
    },
    enablePortal: {
        type: Boolean,
        default: false,
    },
    portalLanguage: {
        type: String,
        default: "English",
    },
    customFields: {
        type: Map,
        of: mongoose_1.Schema.Types.Mixed,
    },
    reportingTags: [String],
    remarks: String,
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
    },
});
customerSchema.index({ displayName: 1 });
customerSchema.index({ email: 1 });
customerSchema.index({ customerType: 1 });
customerSchema.index({ "phone.mobile": 1 });
customerSchema.index({ "phone.workPhone": 1 });
customerSchema.index({ companyName: 1 });
exports.Customer = mongoose_1.default.model("Customer", customerSchema);
//# sourceMappingURL=customer.model.js.map