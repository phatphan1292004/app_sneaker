import ProductCard from "@/components/product/product_card";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  image: string;
}

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
          {products.map((product) => (
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
    </View>
  );
}
