import { brandService } from "@/services/brandService";
import { useEffect, useState } from "react";
export function useBrands() {
  const [brands, setBrands] = useState<any[]>([]);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const res = await brandService.getAllBrands();
        setBrands([
          {
            _id: "ALL",
            name: "ALL",
            logo: "",
          },
          ...res.data,
        ]);
      } catch (error) {
        console.error("Failed to fetch brands", error);
      }
    };
    fetchBrands();
  }, []);

  return brands;
}
