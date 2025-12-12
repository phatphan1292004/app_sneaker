import { Product, productService } from '@/services/productService';
import { useEffect, useState } from 'react';

interface UseProductsReturn {
  forYouProducts: Product[];
  popularProducts: Product[];
  newestProducts: Product[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useProducts = (): UseProductsReturn => {
  const [forYouProducts, setForYouProducts] = useState<Product[]>([]);
  const [popularProducts, setPopularProducts] = useState<Product[]>([]);
  const [newestProducts, setNewestProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const [forYouRes, popularRes, newestRes] = await Promise.all([
        productService.getForYouProducts(),
        productService.getPopularProducts(),
        productService.getNewestProducts(),
      ]);

      setForYouProducts(forYouRes.data);
      setPopularProducts(popularRes.data);
      setNewestProducts(newestRes.data);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return {
    forYouProducts,
    popularProducts,
    newestProducts,
    loading,
    error,
    refetch: fetchProducts,
  };
};
