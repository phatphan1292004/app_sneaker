import api from "../api";

/* =======================
   TYPES
======================= */

export type VariantDTO = {
  _id: string;
  product_id: string;
  color: string;
  size: string | number;
  stock: number;
  price: number;
  createdAt: string;
  updatedAt: string;
};

/* =======================
   VARIANTS API
======================= */

// GET /admin/products/:productId/variants
export async function fetchAdminVariants(productId: string) {
  const res = await api.get(`/admin/products/${productId}/variants`);
  return res.data as {
    success: boolean;
    data: VariantDTO[];
  };
}

// POST /admin/products/:productId/variants
export async function createAdminVariant(
  productId: string,
  payload: {
    color: string;
    size: string | number;
    stock: number;
    price: number;
  }
) {
  const res = await api.post(`/admin/products/${productId}/variants`, payload);

  return res.data as {
    success: boolean;
    data?: VariantDTO;
    message?: string;
    field?: "color" | "size" | "price"; // ✅ thêm
  };
}

// PATCH /admin/variants/:id
export async function updateAdminVariant(
  id: string,
  payload: Partial<{
    color: string;
    size: string | number;
    stock: number;
    price: number;
  }>
) {
  const res = await api.patch(`/admin/variants/${id}`, payload);
  return res.data as {
    success: boolean;
    data?: VariantDTO;
    message?: string;
    field?: "color" | "size" | "price"; // ✅ thêm
  };
}

// DELETE /admin/variants/:id
export async function deleteAdminVariant(id: string) {
  const res = await api.delete(`/admin/variants/${id}`);
  return res.data as {
    success: boolean;
    data?: VariantDTO;
    message?: string;
  };
}
