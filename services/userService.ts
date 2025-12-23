import api from "./api";

export interface User {
  _id: string;
  firebaseUid: string;
  username: string;
  email: string;
  avatar?: string;
  phoneNumber?: string;
  birthDate?: string;
  gender?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface UserResponse {
  success: boolean;
  data: User;
}

// User Service
export const userService = {
  // Tạo user mới trong MongoDB
  createUser: async (
    userData: Omit<User, "_id" | "createdAt" | "updatedAt">
  ): Promise<UserResponse> => {
    const response = await api.post("/user", userData);
    return response.data;
  },

  updateUser: async (
    id: string,
    payload: Partial<
      Pick<User, "username" | "phoneNumber" | "birthDate" | "gender">
    >
  ): Promise<UserResponse> => {
    const response = await api.put(`/user/${id}`, payload);
    return response.data;
  },
};
