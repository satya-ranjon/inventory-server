"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderStatusValues = exports.salesOrderFilterableFields = exports.salesOrderSearchableFields = void 0;
exports.salesOrderSearchableFields = ["orderNumber", "reference"];
exports.salesOrderFilterableFields = [
    "searchTerm",
    "orderNumber",
    "customer",
    "status",
    "fromDate",
    "toDate",
    "minAmount",
    "maxAmount",
    "payment",
    "previousDue",
    "due",
    "page",
    "limit",
    "sort",
    "fields",
];
exports.orderStatusValues = [
    "Draft",
    "Confirmed",
    "Shipped",
    "Delivered",
    "Cancelled",
];
//# sourceMappingURL=salesOrder.constant.js.map