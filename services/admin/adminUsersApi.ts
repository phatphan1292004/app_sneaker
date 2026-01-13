import type { User } from "../../types/admin";
import api from "../api";

export type ListUsersParams = {
  q?: string;
  page?: number;
  limit?: number;
  sort?: string;
};

export type AdminUserPayload = {
  firebaseUid: string;
  username: string;
  email: string;
  avatar?: string;
  phoneNumber?: string;
  birthDate?: string; // "YYYY-MM-DD"
  gender?: string; // "male" | "female" | "other" | ...
};

export async function fetchAdminUsers(params: ListUsersParams) {
  const res = await api.get("/admin/users", { params });
  return res.data as {
    success: boolean;
    data: User[];
    meta: { page: number; limit: number; total: number; totalPages: number };
  };
}

export async function createAdminUser(payload: AdminUserPayload) {
  const res = await api.post("/admin/users", payload);
  return res.data as { success: boolean; data?: User; message?: string };
}

export async function updateAdminUser(
  id: string,
  payload: Partial<AdminUserPayload>
) {
  const res = await api.patch(`/admin/users/${id}`, payload);
  return res.data as { success: boolean; data?: User; message?: string };
}

export async function deleteAdminUser(id: string) {
  const res = await api.delete(`/admin/users/${id}`);
  return res.data as { success: boolean; data?: User; message?: string };
}
