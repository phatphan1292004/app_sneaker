import api from "./api";

export type VoucherType = "percent" | "fixed";

export interface ApplyVoucherResponse {
  success: boolean;
  message?: string;
  field?: string;
  data?: {
    code: string;
    type: VoucherType;
    value: number;
    minOrder: number | null;
    maxDiscount: number | null;
    usageLimit: number | null;
    used: number;
    startAt: string;
    endAt: string;
    discount: number;
    subtotal: number;
    total: number;
  };
}
export async function applyVoucher(code: string, subtotal: number) {
  const res = await api.post<ApplyVoucherResponse>(`/vouchers/apply`, {
    code,
    subtotal,
  });
  return res.data;
}
