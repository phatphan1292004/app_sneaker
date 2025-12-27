import api from "./api";
import { Product } from "./productService";

interface FavoriteResponse {
    success: boolean;
    message: string;
    isFavorite?: boolean;
}

interface FavoritesListResponse {
    success: boolean;
    data: Product[];
}

export const favoriteService = {
    // Toggle favorite status for a product
    toggleFavorite: async (
        firebaseUid: string,
        productId: string
    ): Promise<FavoriteResponse> => {
        const response = await api.post("/product/favorite", {
            firebaseUid,
            productId,
        });
        return response.data;
    },

    // Get user's favorite products
    getUserFavorites: async (firebaseUid: string): Promise<FavoritesListResponse> => {
        const response = await api.get(`/product/favorite/${firebaseUid}`);
        return response.data;
    },
};
