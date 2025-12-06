import { Product, productService } from '@/services/product_service';
import { useEffect, useState } from 'react';

interface UseProductDetailReturn {
  product: Product | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useProductDetail = (productId: string): UseProductDetailReturn => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await productService.getProductById(productId);
      
      if (response.success) {
        setProduct(response.data);
      } else {
        setError('Product not found');
      }
    } catch (err) {
      console.error('Error fetching product:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch product');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  return {
    product,
    loading,
    error,
    refetch: fetchProduct,
  };
};
