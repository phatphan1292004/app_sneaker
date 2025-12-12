import api from './api';

export interface OrderItem {
  product_id: string;
  variant_id: string;
  quantity: number;
  price: number;
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

export interface Order {
  _id: string;
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
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface OrderResponse {
  success: boolean;
  data: Order;
  message?: string;
}

// Order Service
export const orderService = {
  // Tạo order mới
  createOrder: async (orderData: CreateOrderData): Promise<OrderResponse> => {
    const response = await api.post('/order', orderData);
    return response.data;
  },

  // Lấy danh sách orders của user
  getUserOrders: async (userId: string): Promise<{ success: boolean; data: Order[] }> => {
    const response = await api.get(`/order/user/${userId}`);
    return response.data;
  },

  // Lấy chi tiết order
  getOrderById: async (orderId: string): Promise<OrderResponse> => {
    const response = await api.get(`/order/${orderId}`);
    return response.data;
  },
};
