import { useState } from "react";

export function useFilters() {
  const [selectedBrand, setSelectedBrand] = useState("ALL");
  const [selectedPrice, setSelectedPrice] = useState("ALL");
  const [selectedSort, setSelectedSort] = useState("NONE");
  const [selectedSize, setSelectedSize] = useState("ALL");
  const [selectedColor, setSelectedColor] = useState("ALL");

  return {
    selectedBrand,
    setSelectedBrand,
    selectedPrice,
    setSelectedPrice,
    selectedSort,
    setSelectedSort,
    selectedSize,
    setSelectedSize,
    selectedColor,
    setSelectedColor,
  };
}
