import { productService } from "@/services/productService";
import { useEffect, useState } from "react";

export function useProducts(filters: any) {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (filters.selectedBrand !== "ALL") params.brand = filters.selectedBrand;
      if (filters.selectedPrice !== "ALL") params.price = filters.selectedPrice;
      if (filters.selectedSize !== "ALL") params.size = filters.selectedSize;
      if (filters.selectedColor !== "ALL") params.color = filters.selectedColor;
      if (filters.selectedSort !== "NONE") params.sort = filters.selectedSort;

      const res = await productService.getAllProducts(params);
      setProducts(res.data);
    } catch (error) {
      console.error("Failed to fetch products", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [
    filters.selectedBrand,
    filters.selectedPrice,
    filters.selectedSize,
    filters.selectedColor,
    filters.selectedSort,
  ]);

  return { products, loading };
}
