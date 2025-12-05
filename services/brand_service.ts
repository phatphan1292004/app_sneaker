import api from './api';

export interface Brand {
  _id: string;
  name: string;
  slug: string;
  logo?: string;
  description?: string;
}

interface BrandResponse {
  success: boolean;
  data: Brand[];
}

// Brand Service
export const brandService = {
  getAllBrands: async (): Promise<BrandResponse> => {
    const response = await api.get('/brand');
    return response.data;
  },
};
