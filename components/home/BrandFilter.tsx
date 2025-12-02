import React from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";

interface Brand {
  name: string;
  logo: string | null;
}

interface BrandFilterProps {
  brands: Brand[];
  selectedBrand: string;
  onBrandSelect: (brandName: string) => void;
}

export default function BrandFilter({
  brands,
  selectedBrand,
  onBrandSelect,
}: BrandFilterProps) {
  return (
    <View className="mb-4 px-5">
      <View className="flex-row items-center justify-between mb-3">
        <Text className="text-lg font-bold text-gray-900">Popular Brand</Text>
        <TouchableOpacity>
          <Text className="text-sm" style={{ color: "#496c60" }}>
            See all
          </Text>
        </TouchableOpacity>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {brands.map((brand) => (
          <TouchableOpacity
            key={brand.name}
            onPress={() => onBrandSelect(brand.name)}
            className="mr-3 items-center"
          >
            <View
              className="rounded-full p-3 items-center justify-center"
              style={{
                width: 55,
                height: 55,
                backgroundColor:
                  selectedBrand === brand.name ? "#e8f5e9" : "#f5f5f5",
                borderWidth: selectedBrand === brand.name ? 1 : 0,
                borderColor: "#496c60",
              }}
            >
              {brand.logo ? (
                <Image
                  source={{ uri: brand.logo }}
                  style={{ width: 40, height: 40 }}
                  resizeMode="contain"
                />
              ) : (
                <Text className="text-xl font-bold text-gray-400">All</Text>
              )}
            </View>
            <Text
              className="text-xs mt-1 font-medium"
              style={{
                color: selectedBrand === brand.name ? "#496c60" : "#6b7280",
              }}
            >
              {brand.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}
