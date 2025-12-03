import ProductCard from "@/components/product/product_card";
import React, { useState } from "react";
import {
  Image,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface Brand {
  id: string;
  name: string;
  logo: string;
}

export default function BrandScreen() {
  const [selectedBrand, setSelectedBrand] = useState<string>("ALL");

  const brands: Brand[] = [
    {
      id: "ALL",
      name: "ALL",
      logo: "https://via.placeholder.com/60/e5e7eb/666666?text=ALL",
    },
    {
      id: "NIKE",
      name: "NIKE",
      logo: "https://via.placeholder.com/60/ffffff/000000?text=NIKE",
    },
    {
      id: "ADIDAS",
      name: "ADIDAS",
      logo: "https://via.placeholder.com/60/ffffff/0066b2?text=ADIDAS",
    },
    {
      id: "PUMA",
      name: "PUMA",
      logo: "https://via.placeholder.com/60/ffffff/000000?text=PUMA",
    },
    {
      id: "REEBOK",
      name: "REEBOK",
      logo: "https://via.placeholder.com/60/ffffff/ee1c25?text=REEBOK",
    },
    {
      id: "VANS",
      name: "VANS",
      logo: "https://via.placeholder.com/60/000000/ffffff?text=VANS",
    },
  ];

  const products = [
    {
      id: "1",
      name: "Nike Air Max 270",
      price: 150,
      brand: "NIKE",
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300",
    },
    {
      id: "2",
      name: "Adidas Ultraboost",
      price: 180,
      brand: "ADIDAS",
      image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=300",
    },
    {
      id: "3",
      name: "Puma RS-X",
      price: 120,
      brand: "PUMA",
      image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=300",
    },
    {
      id: "4",
      name: "Reebok Classic",
      price: 100,
      brand: "REEBOK",
      image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=300",
    },
    {
      id: "5",
      name: "Vans Old Skool",
      price: 65,
      brand: "VANS",
      image: "https://images.unsplash.com/photo-1543508282-6319a3e2621f?w=300",
    },
    {
      id: "6",
      name: "Nike React Infinity",
      price: 160,
      brand: "NIKE",
      image: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=300",
    },
  ];

  const filteredProducts =
    selectedBrand === "ALL"
      ? products
      : products.filter((p) => p.brand === selectedBrand);

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View
        className="px-5 py-4 border-b border-gray-200"
        style={{ paddingTop: StatusBar.currentHeight || 20 }}
      >
        <Text className="text-2xl font-bold text-gray-900">Brand</Text>
      </View>

      <ScrollView className="flex-1">
        {/* Brand Filter */}
        <View className="px-5 py-4">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-base font-semibold text-gray-900">
              Popular Brand
            </Text>
            <TouchableOpacity>
              <Text className="text-sm font-medium" style={{ color: "#496c60" }}>
                See all
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="flex-row"
          >
            {brands.map((brand) => (
              <TouchableOpacity
                key={brand.id}
                onPress={() => setSelectedBrand(brand.id)}
                className="items-center mr-4"
              >
                <View
                  className="w-16 h-16 rounded-full items-center justify-center mb-2"
                  style={{
                    backgroundColor:
                      selectedBrand === brand.id ? "#d1e7dd" : "#f3f4f6",
                    borderWidth: selectedBrand === brand.id ? 2 : 0,
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
                    color: selectedBrand === brand.id ? "#496c60" : "#6b7280",
                  }}
                >
                  {brand.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Products Grid */}
        <View className="px-5 pb-6">
          <Text className="text-base font-semibold text-gray-900 mb-4">
            {selectedBrand === "ALL" ? "All Products" : `${selectedBrand} Products`}
          </Text>

          <View className="flex-row flex-wrap justify-between">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                brand={product.brand}
                price={product.price}
                image={product.image}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
