import api from './api';

export interface Brand {
  _id: string;
  name: string;
  logo?: string;
  description?: string;
}

// Brand Service
export const brandService = {
  // Lấy tất cả brands
  getAllBrands: async (): Promise<Brand[]> => {
    const response = await api.get('/brands');
    return response.data;
  },
};
