export const salesOrderSearchableFields = ["orderNumber", "reference"];

export const salesOrderFilterableFields = [
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

export const orderStatusValues = [
  "Draft",
  "Confirmed",
  "Shipped",
  "Delivered",
  "Cancelled",
];
