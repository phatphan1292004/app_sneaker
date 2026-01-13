import api from "../api";

export type BrandDTO = {
  _id: string;
  name: string;
  slug: string;
  logo: string;
  description: string;
  createdAt: string;
  updatedAt: string;
};

export type ListMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export async function fetchAdminBrands(params: {
  q?: string;
  page?: number;
  limit?: number;
  sort?: string;
}) {
  const res = await api.get("/admin/brands", { params });
  return res.data as { success: boolean; data: BrandDTO[]; meta: ListMeta };
}

export async function createAdminBrand(payload: {
  name: string;
  slug: string;
  logo: string;
  description?: string;
}) {
  const res = await api.post("/admin/brands", payload);
  return res.data as { success: boolean; data?: BrandDTO; message?: string };
}

export async function updateAdminBrand(
  id: string,
  payload: Partial<{
    name: string;
    slug: string;
    logo: string;
    description: string;
  }>
) {
  const res = await api.patch(`/admin/brands/${id}`, payload);
  return res.data as { success: boolean; data?: BrandDTO; message?: string };
}

export async function deleteAdminBrand(id: string) {
  const res = await api.delete(`/admin/brands/${id}`);
  return res.data as { success: boolean; data?: BrandDTO; message?: string };
}
