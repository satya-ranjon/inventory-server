import mongoose from "mongoose";
import { SalesOrder } from "../SalesOrder/salesOrder.model";
import { Customer } from "../Customer/customer.model";
import { Item } from "../Item/item.model";
import { TDashboardData } from "./dashboard.interface";

// Get dashboard analytics data
const getDashboardData = async (): Promise<TDashboardData> => {
  // Get total counts and summaries
  const totalCustomers = await Customer.countDocuments();
  const totalItems = await Item.countDocuments();
  const totalOrders = await SalesOrder.countDocuments();

  const totalRevenueResult = await SalesOrder.aggregate([
    { $match: { status: { $in: ["Confirmed", "Shipped", "Delivered"] } } },
    { $group: { _id: null, total: { $sum: "$total" } } },
  ]);
  const totalRevenue =
    totalRevenueResult.length > 0 ? totalRevenueResult[0].total : 0;

  // Get recent orders
  const recentOrders = await SalesOrder.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .populate("customer", "customerName")
    .select("orderNumber customer total status salesOrderDate");

  // Get sales over time (last 6 months)
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const salesOverTime = await SalesOrder.aggregate([
    { $match: { salesOrderDate: { $gte: sixMonthsAgo } } },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m", date: "$salesOrderDate" } },
        total: { $sum: "$total" },
      },
    },
    { $sort: { _id: 1 } },
    { $project: { date: "$_id", total: 1, _id: 0 } },
  ]);

  // Get top customers
  const topCustomers = await SalesOrder.aggregate([
    {
      $group: {
        _id: "$customer",
        totalOrders: { $sum: 1 },
        totalSpent: { $sum: "$total" },
      },
    },
    { $sort: { totalSpent: -1 } },
    { $limit: 5 },
    {
      $lookup: {
        from: "customers",
        localField: "_id",
        foreignField: "_id",
        as: "customerInfo",
      },
    },
    {
      $project: {
        customer: {
          _id: "$_id",
          customerName: { $arrayElemAt: ["$customerInfo.customerName", 0] },
        },
        totalOrders: 1,
        totalSpent: 1,
        _id: 0,
      },
    },
  ]);

  // Get top selling items
  const topItems = await SalesOrder.aggregate([
    { $unwind: "$items" },
    {
      $group: {
        _id: "$items.item",
        totalSold: { $sum: "$items.quantity" },
        revenue: { $sum: "$items.amount" },
      },
    },
    { $sort: { revenue: -1 } },
    { $limit: 5 },
    {
      $lookup: {
        from: "items",
        localField: "_id",
        foreignField: "_id",
        as: "itemInfo",
      },
    },
    {
      $project: {
        item: {
          _id: "$_id",
          name: { $arrayElemAt: ["$itemInfo.name", 0] },
        },
        totalSold: 1,
        revenue: 1,
        _id: 0,
      },
    },
  ]);

  // Get sales by status
  const salesByStatus = await SalesOrder.aggregate([
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
        total: { $sum: "$total" },
      },
    },
    {
      $project: {
        status: "$_id",
        count: 1,
        total: 1,
        _id: 0,
      },
    },
    { $sort: { total: -1 } },
  ]);

  return {
    totalCustomers,
    totalItems,
    totalOrders,
    totalRevenue,
    recentOrders,
    salesOverTime,
    topCustomers,
    topItems,
    salesByStatus,
  };
};

// Get data filtered by date range
const getDashboardDataByDateRange = async (
  startDate: Date,
  endDate: Date
): Promise<TDashboardData> => {
  // Convert string dates to Date objects if needed
  const start = new Date(startDate);
  const end = new Date(endDate);

  // Get total orders and revenue within date range
  const ordersWithinRange = await SalesOrder.find({
    salesOrderDate: { $gte: start, $lte: end },
  });

  const totalOrders = ordersWithinRange.length;
  const totalRevenue = ordersWithinRange.reduce(
    (sum, order) => sum + order.total,
    0
  );

  // Count customers and items (all-time stats still relevant)
  const totalCustomers = await Customer.countDocuments();
  const totalItems = await Item.countDocuments();

  // Get recent orders within date range
  const recentOrders = await SalesOrder.find({
    salesOrderDate: { $gte: start, $lte: end },
  })
    .sort({ salesOrderDate: -1 })
    .limit(5)
    .populate("customer", "customerName")
    .select("orderNumber customer total status salesOrderDate");

  // Get sales over time within range (grouped by month or day depending on range)
  const diffInDays = Math.ceil(
    (end.getTime() - start.getTime()) / (1000 * 3600 * 24)
  );
  const groupFormat = diffInDays > 31 ? "%Y-%m" : "%Y-%m-%d";

  const salesOverTime = await SalesOrder.aggregate([
    { $match: { salesOrderDate: { $gte: start, $lte: end } } },
    {
      $group: {
        _id: {
          $dateToString: { format: groupFormat, date: "$salesOrderDate" },
        },
        total: { $sum: "$total" },
      },
    },
    { $sort: { _id: 1 } },
    { $project: { date: "$_id", total: 1, _id: 0 } },
  ]);

  // Get top customers within date range
  const topCustomers = await SalesOrder.aggregate([
    { $match: { salesOrderDate: { $gte: start, $lte: end } } },
    {
      $group: {
        _id: "$customer",
        totalOrders: { $sum: 1 },
        totalSpent: { $sum: "$total" },
      },
    },
    { $sort: { totalSpent: -1 } },
    { $limit: 5 },
    {
      $lookup: {
        from: "customers",
        localField: "_id",
        foreignField: "_id",
        as: "customerInfo",
      },
    },
    {
      $project: {
        customer: {
          _id: "$_id",
          customerName: { $arrayElemAt: ["$customerInfo.customerName", 0] },
        },
        totalOrders: 1,
        totalSpent: 1,
        _id: 0,
      },
    },
  ]);

  // Get top selling items within date range
  const topItems = await SalesOrder.aggregate([
    { $match: { salesOrderDate: { $gte: start, $lte: end } } },
    { $unwind: "$items" },
    {
      $group: {
        _id: "$items.item",
        totalSold: { $sum: "$items.quantity" },
        revenue: { $sum: "$items.amount" },
      },
    },
    { $sort: { revenue: -1 } },
    { $limit: 5 },
    {
      $lookup: {
        from: "items",
        localField: "_id",
        foreignField: "_id",
        as: "itemInfo",
      },
    },
    {
      $project: {
        item: {
          _id: "$_id",
          name: { $arrayElemAt: ["$itemInfo.name", 0] },
        },
        totalSold: 1,
        revenue: 1,
        _id: 0,
      },
    },
  ]);

  // Get sales by status within date range
  const salesByStatus = await SalesOrder.aggregate([
    { $match: { salesOrderDate: { $gte: start, $lte: end } } },
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
        total: { $sum: "$total" },
      },
    },
    {
      $project: {
        status: "$_id",
        count: 1,
        total: 1,
        _id: 0,
      },
    },
    { $sort: { total: -1 } },
  ]);

  return {
    totalCustomers,
    totalItems,
    totalOrders,
    totalRevenue,
    recentOrders,
    salesOverTime,
    topCustomers,
    topItems,
    salesByStatus,
  };
};

export const DashboardService = {
  getDashboardData,
  getDashboardDataByDateRange,
};
