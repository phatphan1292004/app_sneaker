import api from './api';

export interface Brand {
  _id: string;
  name: string;
  slug: string;
  logo?: string;
}

export interface ProductVariant {
  _id: string;
  product_id: string;
  color: string;
  size: string;
  stock: number;
  price: number;
}

export interface Product {
  _id: string;
  brand_id: string | Brand;
  name: string;
  description: string;
  base_price: number;
  views: number;
  sold: number;
  favorites: number;
  images: string[];
  createdAt: string;
  variants?: ProductVariant[];
}

interface ProductResponse {
  success: boolean;
  data: Product[];
}

interface ProductDetailResponse {
  success: boolean;
  data: Product;
}

// Product Service
export const productService = {
  // Lấy sản phẩm For You (4 sản phẩm có views cao nhất)
  getForYouProducts: async (): Promise<ProductResponse> => {
    const response = await api.get('/product/foryou');
    return response.data;
  },

  // Lấy sản phẩm Popular (4 sản phẩm được yêu thích nhất)
  getPopularProducts: async (): Promise<ProductResponse> => {
    const response = await api.get('/product/popular');
    return response.data;
  },

  // Lấy sản phẩm Newest (4 sản phẩm mới nhất)
  getNewestProducts: async (): Promise<ProductResponse> => {
    const response = await api.get('/product/newest');
    return response.data;
  },

  // Lấy chi tiết sản phẩm theo ID
  getProductById: async (productId: string): Promise<ProductDetailResponse> => {
    const response = await api.get(`/product/${productId}`);
    return response.data;
  },
};
