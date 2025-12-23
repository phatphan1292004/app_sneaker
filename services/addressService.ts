import api from "./api";

export interface Address {
  id?: string;
  _id?: string;
  user_id: string;
  type: string;
  street: string;
  province: string;
  district: string;
  ward: string;
  isDefault: boolean;
}

interface AddressResponse {
  success: boolean;
  data?: Address[];
  message?: string;
  error?: string;
}

export const addressService = {
  addAddress: async (payload: Address): Promise<AddressResponse> => {
    const response = await api.post("/address", payload);
    return response.data;
  },

  getAddressesByUserId: async (user_id: string): Promise<AddressResponse> => {
    const response = await api.get(`/address/user/${user_id}`);
    return response.data;
  },

  deleteAddress: async (id: string): Promise<AddressResponse> => {
    const response = await api.delete(`/address/${id}`);
    return response.data;
  },

  setDefaultAddress: async (
    user_id: string,
    addressId: string
  ): Promise<AddressResponse> => {
    const response = await api.put(`/address/${addressId}/set-default`, {
      user_id,
    });
    return response.data;
  },
};
