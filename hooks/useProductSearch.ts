import { productService } from "@/services/productService";
import { useEffect, useRef, useState } from "react";

export function useProductSearch(keyword: string, mapForSuggestions = true) {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const timerRef = useRef<any>(null);
  const lastReqRef = useRef(0);

  useEffect(() => {
    const q = keyword.trim();

    // reset nếu rỗng
    if (!q) {
      setResults([]);
      setLoading(false);
      setError(null);
      return;
    }

    // debounce
    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(async () => {
      const reqId = Date.now();
      lastReqRef.current = reqId;

      try {
        setLoading(true);
        setError(null);

        const res = await productService.searchProducts(q, 1, 20);

        // bỏ qua response cũ
        if (lastReqRef.current !== reqId) return;

        if (mapForSuggestions) {
          // Map data to correct format for SearchSuggestions
          const mappedResults = (res.data || []).map((product: any) => ({
            id: product._id,
            name: product.name,
            price: product.base_price,
            image: product.images?.[0] || '',
            brand: typeof product.brand_id === 'object' ? product.brand_id.name : '',
            discount: product.discount || 0,
          }));
          setResults(mappedResults);
        } else {
          // Return raw data for ProductSection
          setResults(res.data || []);
        }
      } catch (e: any) {
        if (lastReqRef.current !== reqId) return;
        setError(e?.message || "Search failed");
        setResults([]);
      } finally {
        if (lastReqRef.current !== reqId) return;
        setLoading(false);
      }
    }, 400);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [keyword]);

  return { results, loading, error };
}
