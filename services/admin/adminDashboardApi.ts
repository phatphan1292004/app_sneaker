import api from "../api";
import type { OrderDTO } from "./adminOrdersApi";
import type { ProductDTO } from "./adminProductsApi";

export type DashboardDTO = {
  stats: {
    users: number;
    brands: number;
    products: number;
    orders: number;
  };
  revenuePaid: number;
  revenueLastDays: { date: string; total: number }[];
  topSelling: ProductDTO[];
  recentOrders: OrderDTO[];
};

export async function fetchAdminDashboard(params?: { days?: number }) {
  const res = await api.get("/admin/dashboard", { params });
  return res.data as {
    success: boolean;
    data?: DashboardDTO;
    message?: string;
  };
}
