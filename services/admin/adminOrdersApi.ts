import api from "../api";

export type OrderStatus =
  | "pending"
  | "paid"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export type OrderItemDTO = {
  brand?: string;

  product_id: string | { _id: string; name: string; images: string[] };

  variant_id: string | { _id: string; color: string; size: string };

  quantity: number;
  price: number;
};

export type ShippingAddressDTO = {
  street: string;
  ward: string;
  district: string;
  province: string;
  country: string;
};

export type OrderDTO = {
  _id: string;
  user_id: string;
  user_name?: string;
  items: OrderItemDTO[];
  shipping_address: ShippingAddressDTO;
  payment_method: string;
  total_amount: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
};

export type ListMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export async function fetchAdminOrders(params: {
  q?: string;
  status?: "all" | OrderStatus;
  page?: number;
  limit?: number;
  sort?: string;
}) {
  const res = await api.get("/admin/orders", { params });
  return res.data as {
    success: boolean;
    data: OrderDTO[];
    meta: ListMeta;
    message?: string;
  };
}

export async function fetchAdminOrderById(id: string) {
  const res = await api.get(`/admin/orders/${id}`);
  return res.data as { success: boolean; data?: OrderDTO; message?: string };
}

export async function updateAdminOrder(
  id: string,
  payload: Partial<{
    status: OrderStatus;
    payment_method: string;
    shipping_address: ShippingAddressDTO;
    items: OrderItemDTO[];
    total_amount: number;
  }>,
) {
  const res = await api.patch(`/admin/orders/${id}`, payload);
  return res.data as {
    success: boolean;
    data?: OrderDTO;
    message?: string;
    field?: string;
  };
}

export async function deleteAdminOrder(id: string) {
  const res = await api.delete(`/admin/orders/${id}`);
  return res.data as { success: boolean; data?: OrderDTO; message?: string };
}
export async function updateAdminOrderStatus(
  id: string,
  status: OrderDTO["status"],
) {
  const res = await api.patch(`/admin/orders/${id}/status`, { status });
  return res.data as {
    success: boolean;
    data?: OrderDTO;
    message?: string;
    field?: string;
  };
}
