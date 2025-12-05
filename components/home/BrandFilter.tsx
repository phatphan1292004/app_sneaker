import { useRouter } from "expo-router";
import React from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";

interface Brand {
  name: string;
  slug: string;
  logo: string | null;
}

interface BrandFilterProps {
  brands: Brand[];
}

export default function BrandFilter({ brands }: BrandFilterProps) {
  const router = useRouter();

  const handleBrandPress = (slug: string) => {
    router.push({
      pathname: "/(tabs)/brand",
      params: { slug },
    });
  };

  return (
    <View className="mb-4 px-5">
      <View className="flex-row items-center justify-between mb-3">
        <Text className="text-lg font-bold text-gray-900">Popular Brand</Text>
        <TouchableOpacity onPress={() => router.push("/(tabs)/brand")}>
          <Text className="text-sm" style={{ color: "#496c60" }}>
            See all →
          </Text>
        </TouchableOpacity>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {brands.map((brand) => (
          <TouchableOpacity
            key={brand.slug}
            onPress={() => handleBrandPress(brand.slug)}
            className="mr-3 items-center"
          >
            <View
              className="rounded-full p-3 items-center justify-center"
              style={{
                width: 55,
                height: 55,
                backgroundColor: "#f5f5f5",
              }}
            >
              {brand.logo && (
                <Image
                  source={{ uri: brand.logo }}
                  style={{ width: 40, height: 40 }}
                  resizeMode="contain"
                />
              )}
            </View>
            <Text className="text-xs mt-1 font-medium text-gray-700">
              {brand.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}
