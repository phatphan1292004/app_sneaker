import api from "./api";

// OrderItem for creating order (sending to API)
export interface OrderItem {
  brand?: string;
  product_id: string;
  variant_id: string;
  quantity: number;
  price: number;
}

// OrderItem for API response (nested object)
export interface ApiOrderItem {
  product_id: {
    _id: string;
    name: string;
    description: string;
    images: string[];
    brand?: string;
    id: string;
  };
  variant_id: {
    _id: string;
    color: string;
    size: string;
    price: number;
  };
  brand?: string;
  quantity: number;
  price: number;
  _id: string;
}

export interface ApiOrder {
  _id: string;
  user_id: string;
  items: ApiOrderItem[];
  shipping_address: {
    street: string;
    ward: string;
    district: string;
    province: string;
    country: string;
    _id: string;
  };
  payment_method: string;
  total_amount: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

export interface CreateOrderData {
  user_id: string;
  items: OrderItem[];
  shipping_address: {
    street: string;
    province: string;
    district: string;
    ward: string;
  };
  payment_method: string;
  total_amount: number;
}

// Order for API response (should match ApiOrder)
export interface Order {
  _id: string;
  user_id: string;
  items: ApiOrderItem[];
  shipping_address: {
    street: string;
    ward: string;
    district: string;
    province: string;
    country: string;
    _id: string;
  };
  payment_method: string;
  total_amount: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

interface OrderResponse {
  success: boolean;
  data: ApiOrder;
  message?: string;
}

// Order Service
export const orderService = {
  // Tạo order mới
  createOrder: async (orderData: CreateOrderData): Promise<OrderResponse> => {
    const response = await api.post("/order", orderData);
    return response.data;
  },

  // Lấy danh sách orders của user
  getUserOrders: async (
    userId: string
  ): Promise<{ success: boolean; data: ApiOrder[] }> => {
    const response = await api.get(`/order/user/${userId}`);
    return response.data;
  },

  // Lấy chi tiết order
  getOrderById: async (orderId: string): Promise<OrderResponse> => {
    const response = await api.get(`/order/${orderId}`);
    return response.data;
  },

  // Tạo URL thanh toán VNPay
  createVNPayPayment: async (
    orderId: string
  ): Promise<{ success: boolean; url?: string; message?: string }> => {
    const response = await api.post("/api/vnpay", { orderId });
    return response.data;
  },

  // Kiểm tra trạng thái order (nếu cần)
  getOrderStatus: async (
    orderId: string
  ): Promise<{ success: boolean; status?: string }> => {
    const response = await api.get(`/order/${orderId}`);
    return response.data;
  },

  cancelOrder: async (orderId: string) => {
    const { data } = await api.post(`/order/${orderId}/cancel`);
    return data;
  },

  reorder: async (orderId: string) => {
    const { data } = await api.post(`/order/${orderId}/reorder`);
    return data;
  },
};
