import { router } from "expo-router";
import React from "react";
import { Image, Text, TouchableOpacity } from "react-native";

interface ProductCardProps {
  id: string;
  name: string;
  brand: string;
  price: number;
  image: string;
}

export default function ProductCard({
  id,
  name,
  brand,
  price,
  image,
}: ProductCardProps) {
  return (
    <TouchableOpacity
      className="w-[48%] bg-white rounded-2xl p-2 mb-4"
      onPress={() =>
        router.push({
          pathname: "/product/[id]" as any,
          params: { id },
        })
      }
    >
      <Image
        source={{ uri: image }}
        className="w-full h-32 rounded-xl mb-3"
        resizeMode="cover"
      />
      <Text className="text-xs text-gray-500 mb-1">{brand}</Text>
      <Text
        className="text-sm font-semibold text-gray-900 mb-2"
        numberOfLines={2}
      >
        {name}
      </Text>
      <Text className="text-base font-bold text-gray-900">USD {price}</Text>
    </TouchableOpacity>
  );
}
