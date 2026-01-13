import api from "../api";

/* =======================
   TYPES
======================= */

export type ProductDTO = {
  _id: string;
  brand_id: string;
  name: string;
  description: string;
  base_price: number;
  views: number;
  sold: number;
  favorites: number;
  images: string[];
  discount: number;
  createdAt: string;
  updatedAt: string;
};

export type ListMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

/* =======================
   PRODUCTS API
======================= */
export async function fetchAdminProductById(id: string) {
  const res = await api.get(`/admin/products/${id}`);
  return res.data as { success: boolean; data?: ProductDTO; message?: string };
}

// GET /admin/products
export async function fetchAdminProducts(params: {
  q?: string;
  page?: number;
  limit?: number;
  sort?: string;
}) {
  const res = await api.get("/admin/products", { params });
  return res.data as {
    success: boolean;
    data: ProductDTO[];
    meta: ListMeta;
  };
}

// POST /admin/products
export async function createAdminProduct(payload: {
  brand_id: string;
  name: string;
  description: string;
  base_price: number;
  discount?: number;
  images: string[];
}) {
  const res = await api.post("/admin/products", payload);
  return res.data as {
    success: boolean;
    data?: ProductDTO;
    message?: string;
  };
}

// PATCH /admin/products/:id
export async function updateAdminProduct(
  id: string,
  payload: Partial<{
    brand_id: string;
    name: string;
    description: string;
    base_price: number;
    discount: number;
    images: string[];
    views: number;
    sold: number;
    favorites: number;
  }>
) {
  const res = await api.patch(`/admin/products/${id}`, payload);
  return res.data as {
    success: boolean;
    data?: ProductDTO;
    message?: string;
  };
}

// DELETE /admin/products/:id
export async function deleteAdminProduct(id: string) {
  const res = await api.delete(`/admin/products/${id}`);
  return res.data as {
    success: boolean;
    data?: ProductDTO;
    message?: string;
  };
}
