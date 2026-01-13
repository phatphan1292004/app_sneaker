import api from "../api";

export type VoucherType = "percent" | "fixed";
export type VoucherStatus = "active" | "expired";

export type VoucherDTO = {
  _id: string;
  code: string;
  type: VoucherType;
  value: number;

  minOrder?: number;
  maxDiscount?: number;
  usageLimit?: number;
  used?: number;

  startAt: string;
  endAt: string;

  status: VoucherStatus;
  createdAt: string;
  updatedAt: string;
};

export type ListMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export async function fetchAdminVouchers(params: {
  q?: string;
  status?: "all" | VoucherStatus;
  page?: number;
  limit?: number;
  sort?: string;
}) {
  const res = await api.get("/admin/vouchers", { params });
  return res.data as {
    success: boolean;
    data: VoucherDTO[];
    meta: ListMeta;
    message?: string;
  };
}

export async function createAdminVoucher(payload: Partial<VoucherDTO>) {
  const res = await api.post("/admin/vouchers", payload);
  return res.data as {
    success: boolean;
    data?: VoucherDTO;
    message?: string;
    field?: string;
  };
}

export async function updateAdminVoucher(
  id: string,
  payload: Partial<VoucherDTO>
) {
  const res = await api.patch(`/admin/vouchers/${id}`, payload);
  return res.data as {
    success: boolean;
    data?: VoucherDTO;
    message?: string;
    field?: string;
  };
}

export async function deleteAdminVoucher(id: string) {
  const res = await api.delete(`/admin/vouchers/${id}`);
  return res.data as {
    success: boolean;
    data?: VoucherDTO;
    message?: string;
  };
}

export async function fetchAdminVoucherById(id: string) {
  const res = await api.get(`/admin/vouchers/${id}`);
  return res.data as { success: boolean; data?: VoucherDTO; message?: string };
}
