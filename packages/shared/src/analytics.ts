export interface SalesKpiData {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  conversionRate: number;
  activeUsers: number;
  revenueGrowthPercent: number;
  ordersGrowthPercent: number;
}

export interface RevenueTrendPoint {
  date: string;
  revenue: number;
  ordersCount: number;
}

export interface FunnelStepData {
  step: string;
  visitors: number;
  dropoffRate: number;
}

export interface TopProductMetric {
  productId: string;
  title: string;
  sku: string;
  unitsSold: number;
  revenue: number;
  stockRemaining: number;
}

export interface ChannelMixMetric {
  channel: string;
  percentage: number;
  revenue: number;
}
