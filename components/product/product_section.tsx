import ProductCard from "@/components/product/product_card";
import { Product } from "@/services/product_service";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface ProductSectionProps {
  title: string;
  products: Product[];
}

export default function ProductSection({
  title,
  products,
}: ProductSectionProps) {
  return (
    <View className="mb-6">
      <View className="px-5 mb-3 flex-row items-center justify-between">
        <Text className="text-lg font-bold text-gray-900">{title}</Text>
        <TouchableOpacity>
          <Text className="text-sm" style={{ color: "#496c60" }}>
            View All →
          </Text>
        </TouchableOpacity>
      </View>
      <View className="px-5">
        <View className="flex-row flex-wrap justify-between">
          {products.map((product) => {
            const brandName = typeof product.brand_id === 'object' 
              ? product.brand_id.name 
              : '';
            
            return (
              <ProductCard
                key={product._id}
                id={product._id}
                brand={brandName}
                name={product.name}
                price={product.base_price}
                image={product.images[0]}
              />
            );
          })}
        </View>
      </View>
    </View>
  );
}
