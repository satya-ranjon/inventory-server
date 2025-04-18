import { Model, Document, Types } from "mongoose";

export type TOrderStatus =
  | "Draft"
  | "Confirmed"
  | "Shipped"
  | "Delivered"
  | "Cancelled";

export type TOrderItem = {
  item: Types.ObjectId;
  quantity: number;
  rate: number;
  // tax field removed
  amount: number;
};

export type TDiscount = {
  type: "percentage" | "amount";
  value: number;
};

export type TAttachment = {
  fileName: string;
  fileUrl: string;
};

export type TSalesOrder = {
  orderNumber: string;
  customer: Types.ObjectId;
  reference?: string;
  salesOrderDate: Date;
  expectedShipmentDate?: Date;
  paymentTerms: string;
  deliveryMethod?: string;
  salesPerson?: string;

  items: TOrderItem[];

  subTotal: number;
  discount?: TDiscount;
  shippingCharges?: number;
  adjustment?: number;
  total: number;

  customerNotes?: string;
  termsAndConditions?: string;

  status: TOrderStatus;
  attachments?: TAttachment[];
};

export interface ISalesOrder
  extends Document,
    Omit<TSalesOrder, "customer" | "items"> {
  customer: Types.ObjectId;
  items: Types.DocumentArray<TOrderItem & Document>;
  createdAt: Date;
  updatedAt: Date;
}

export type TSalesOrderModel = Model<ISalesOrder>;

export type TSalesOrderFilters = {
  searchTerm?: string;
  orderNumber?: string;
  customer?: string;
  status?: TOrderStatus;
  fromDate?: Date;
  toDate?: Date;
  minAmount?: number;
  maxAmount?: number;
};
