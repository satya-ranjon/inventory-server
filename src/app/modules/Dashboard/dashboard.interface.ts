export type TSalesOverTimeData = {
  date: string;
  total: number;
};

export type TTopCustomersData = {
  customer: {
    _id: string;
    customerName: string;
  };
  totalOrders: number;
  totalSpent: number;
};

export type TTopItemsData = {
  item: {
    _id: string;
    name: string;
  };
  totalSold: number;
  revenue: number;
};

export type TSalesByStatusData = {
  status: string;
  count: number;
  total: number;
};

export type TDailySalesData = {
  date: string;
  amount: number;
};

export type TDashboardData = {
  totalCustomers: number;
  totalItems: number;
  totalOrders: number;
  totalRevenue: number;
  recentOrders: unknown[];
  salesOverTime: TSalesOverTimeData[];
  topCustomers: TTopCustomersData[];
  topItems: TTopItemsData[];
  salesByStatus: TSalesByStatusData[];
};
