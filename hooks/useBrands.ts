import { Brand, brandService } from '@/services/brand_service';
import { useEffect, useState } from 'react';

interface FormattedBrand {
  name: string;
  slug: string;
  logo: string | null;
}

export const useBrands = () => {
  const [brands, setBrands] = useState<FormattedBrand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await brandService.getAllBrands();
        
        // The API returns { success, data: [...] }
        const brandsData = response.data || [];
        
        // Transform API data to match component format
        const formattedBrands = brandsData.map((brand: Brand) => ({
          name: brand.name,
          slug: brand.slug,
          logo: brand.logo || null,
        }));
        
        setBrands(formattedBrands);
      } catch (err) {
        console.error("Error fetching brands:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch brands");
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, []);

  return { brands, loading, error };
};
