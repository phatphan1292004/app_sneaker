import ProductCard from "@/components/product/product_card";
import React, { useState } from "react";

import FilterIcon from "@/components/icons/FilterIcon";
import { Image, Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";

import { useBrands } from "@/hooks/useBrandFilters";
import { useFilters } from "@/hooks/useFilters";
import { useProducts } from "@/hooks/useProductsFilters";

export default function BrandScreen() {
  const brands = useBrands();
  const filters = useFilters();
  const products = useProducts(filters);
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  
  // Temporary filters for modal
  const [tempFilters, setTempFilters] = useState({
    price: filters.selectedPrice,
    sort: filters.selectedSort,
    size: filters.selectedSize,
    color: filters.selectedColor,
  });

  const priceOptions = [
    { label: "ALL", id: "ALL" },
    { label: "Under 1.000.000đ", id: "UNDER_1000" },
    { label: "1.000.000đ - 3.000.000đ", id: "1000_3000" },
    { label: "Over 3.000.000đ", id: "OVER_3000" },
  ];

  const sortOptions = [
    { id: "NONE", label: "Default" },
    { id: "LOW_HIGH", label: "Price: Low → High" },
    { id: "HIGH_LOW", label: "Price: High → Low" },
  ];

  const sizeOptions = [
    { id: "ALL", label: "All Sizes" },
    { id: "40", label: "40" },
    { id: "41", label: "41" },
    { id: "42", label: "42" },
    { id: "43", label: "43" },
    { id: "44", label: "44" },
  ];

  const colorOptions = [
    { id: "ALL", label: "All Colors" },
    { id: "Black", label: "Black" },
    { id: "White", label: "White" },
    { id: "Red", label: "Red" },
    { id: "Blue", label: "Blue" },
    { id: "Green", label: "Green" },
  ];

  // Hàm render filter
  const renderFilterOptions = (
    options: any[],
    selectedId: string,
    onSelect: (id: string) => void
  ) => {
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="mb-3"
      >
        {options.map((opt) => (
          <TouchableOpacity
            key={opt.id}
            onPress={() => onSelect(opt.id)}
            className="px-4 py-2 mr-3 rounded-full border"
            style={{
              backgroundColor: selectedId === opt.id ? "#d1e7dd" : "white",
              borderColor: selectedId === opt.id ? "#496c60" : "#d1d5db",
            }}
          >
            <Text
              className="text-sm"
              style={{ color: selectedId === opt.id ? "#496c60" : "#6b7280" }}
            >
              {opt.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  };

  // Open modal and sync temp filters with current filters
  const openFilterModal = () => {
    setTempFilters({
      price: filters.selectedPrice,
      sort: filters.selectedSort,
      size: filters.selectedSize,
      color: filters.selectedColor,
    });
    setIsFilterModalVisible(true);
  };

  // Apply filters
  const applyFilters = () => {
    filters.setSelectedPrice(tempFilters.price);
    filters.setSelectedSort(tempFilters.sort);
    filters.setSelectedSize(tempFilters.size);
    filters.setSelectedColor(tempFilters.color);
    setIsFilterModalVisible(false);
  };

  return (
    <View className="flex-1 bg-gray-100">
      {/* Header */}
      <View className="px-5 py-4 flex-row items-center justify-between">
        <Image
          source={{
            uri: "https://cdn.dribbble.com/userupload/31584578/file/original-050b602625e120a96798e483b9199f46.png?format=webp&resize=450x338&vertical=center",
          }}
          className="w-14 h-14 rounded-lg"
        />
        <TouchableOpacity
          onPress={openFilterModal}
          className="px-4 py-2 rounded-full border border-gray-300 flex-row items-center"
          style={{ backgroundColor: "#f3f4f6" }}
        >
          <FilterIcon size={20} color="#496c60" style={{ marginRight: 6 }} />
          <Text className="text-sm font-medium text-gray-700">Filters</Text>
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1">
        {/* BRAND FILTER */}
        <View className="px-5 py-4">
          <Text className="text-base font-semibold text-gray-900 mb-3">
            Popular Brand
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {brands.map((brand) => (
              <TouchableOpacity
                key={brand._id}
                onPress={() => filters.setSelectedBrand(brand._id)}
                className="items-center mr-4"
              >
                <View
                  className="w-16 h-16 rounded-full items-center justify-center mb-2"
                  style={{
                    backgroundColor:
                      filters.selectedBrand === brand._id
                        ? "#d1e7dd"
                        : "#fff",
                    borderWidth: filters.selectedBrand === brand._id ? 2 : 0,
                    borderColor: "#496c60",
                  }}
                >
                  <Image
                    source={{ uri: brand.logo }}
                    className="w-10 h-10"
                    resizeMode="contain"
                  />
                </View>
                <Text
                  className="text-xs font-medium"
                  style={{
                    color:
                      filters.selectedBrand === brand._id
                        ? "#496c60"
                        : "#6b7280",
                  }}
                >
                  {brand.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* PRODUCT LIST */}
        <View className="px-5 pb-6">
          <View className="flex-row flex-wrap justify-between">
            {products.map((product) => (
              <ProductCard
                key={product._id}
                id={product._id}
                name={product.name}
                brand={product.brand_id?.name}
                price={product.base_price}
                image={product.images[0]}
              />
            ))}
          </View>
        </View>
      </ScrollView>

      {/* FILTER MODAL */}
      <Modal
        visible={isFilterModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsFilterModalVisible(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-3xl" style={{ maxHeight: '80%' }}>
            {/* Modal Header */}
            <View className="px-5 py-4 border-b border-gray-200 flex-row items-center justify-between">
              <Text className="text-lg font-bold text-gray-900">Filters</Text>
              <TouchableOpacity onPress={() => setIsFilterModalVisible(false)}>
                <Text className="text-base text-gray-500">✕</Text>
              </TouchableOpacity>
            </View>

            {/* Modal Content */}
            <ScrollView className="px-5 py-4">
              <Text className="text-base font-semibold text-gray-900 mb-2">
                Price
              </Text>
              {renderFilterOptions(
                priceOptions,
                tempFilters.price,
                (id) => setTempFilters({ ...tempFilters, price: id })
              )}

              <Text className="text-base font-semibold text-gray-900 mb-2">
                Sort
              </Text>
              {renderFilterOptions(
                sortOptions,
                tempFilters.sort,
                (id) => setTempFilters({ ...tempFilters, sort: id })
              )}

              <Text className="text-base font-semibold text-gray-900 mb-2">
                Size
              </Text>
              {renderFilterOptions(
                sizeOptions,
                tempFilters.size,
                (id) => setTempFilters({ ...tempFilters, size: id })
              )}

              <Text className="text-base font-semibold text-gray-900 mb-2">
                Color
              </Text>
              {renderFilterOptions(
                colorOptions,
                tempFilters.color,
                (id) => setTempFilters({ ...tempFilters, color: id })
              )}
            </ScrollView>

            {/* Modal Footer */}
            <View className="px-5 py-4 border-t border-gray-200">
              <TouchableOpacity
                onPress={applyFilters}
                className="py-3 rounded-full items-center"
                style={{ backgroundColor: "#496c60" }}
              >
                <Text className="text-white font-semibold text-base">
                  Apply Filters
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
