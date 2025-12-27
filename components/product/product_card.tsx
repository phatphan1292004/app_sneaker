import { router } from "expo-router";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

interface ProductCardProps {
  id: string;
  name: string;
  brand: string;
  price: number;
  image: string;
  discount?: number;
}

export default function ProductCard({
  id,
  name,
  brand,
  price,
  image,
  discount,
}: ProductCardProps) {
  const finalPrice =
    discount && discount > 0 ? Math.round(price * (1 - discount / 100)) : price;

  return (
    <TouchableOpacity
      className="w-[48%] bg-white rounded-2xl p-2 mb-4 flex"
      onPress={() =>
        router.push({
          pathname: "/product/[id]" as any,
          params: { id },
        })
      }
    >
      {/* IMAGE */}
      <Image
        source={{ uri: image }}
        className="w-full h-32 rounded-xl mb-2"
        resizeMode="cover"
      />

      {/* CONTENT */}
      <View className="flex-1">
        {brand && (
          <Text className="text-xs text-gray-500 mb-1 uppercase font-medium">
            {brand}
          </Text>
        )}

        <Text className="text-sm font-semibold text-gray-900" numberOfLines={2}>
          {name}
        </Text>
      </View>

      {/* PRICE - ALWAYS AT BOTTOM */}
      <View className="flex-row items-center justify-between mt-2">
        <Text className="text-base font-bold" style={{ color: "#496c60" }}>
          {finalPrice.toLocaleString()} đ
        </Text>

        {discount && discount > 0 && (
          <View className="bg-[#d1e7dd] px-2 py-1 rounded">
            <Text
              className="text-xs font-semibold"
              style={{ color: "#496c60" }}
            >
              -{discount}%
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}
