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
  "due",
];

export const orderStatusValues = [
  "Draft",
  "Confirmed",
  "Shipped",
  "Delivered",
  "Cancelled",
];
