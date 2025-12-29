import BrandFilter from "@/components/home/BrandFilter";
import HomeBanner from "@/components/home/HomeBanner";
import ProductSection from "@/components/product/product_section";
import { useBrands } from "@/hooks/useBrands";
import { useProducts } from "@/hooks/useProducts";
import { useProductSearch } from "@/hooks/useProductSearch";
import { Ionicons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function HomeScreen() {
  const { brands, loading: brandsLoading } = useBrands();
  const {
    forYouProducts,
    popularProducts,
    newestProducts,
    loading: productsLoading,
  } = useProducts();

  const [searchText, setSearchText] = useState("");
  const { results: searchResults, loading: searchLoading } =
    useProductSearch(searchText);

  const loading = brandsLoading || productsLoading;

  const isSearching = useMemo(() => searchText.trim().length > 0, [searchText]);

  if (loading) {
    return (
      <View className="flex-1 bg-gray-100 items-center justify-center">
        <ActivityIndicator size="large" color="#000" />
        <Text className="mt-2 text-gray-600">Loading...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-100 mt-5">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-5 pt-3 pb-2 flex-row items-center justify-between">
          <View className="flex-row items-center">
            <Image
              source={{
                uri: "https://cdn.dribbble.com/userupload/31584578/file/original-050b602625e120a96798e483b9199f46.png?format=webp&resize=450x338&vertical=center",
              }}
              className="w-14 h-14 rounded-lg"
            />
            <View className="ml-3">
              <Text className="text-sm text-gray-500">Welcome, Jelly 👋</Text>
            </View>
          </View>
          <TouchableOpacity>
            <Ionicons name="notifications-outline" size={24} color="#000" />
          </TouchableOpacity>
        </View>

        {/* Banner */}
        <HomeBanner />

        {/* Search Bar */}
        <View className="mx-5 mb-4">
          <View className="flex-row items-center bg-white rounded-xl px-4 py-3">
            <Ionicons name="search" size={20} color="#9ca3af" />
            <TextInput
              value={searchText}
              onChangeText={setSearchText}
              placeholder="Search products..."
              placeholderTextColor="#9ca3af"
              className="flex-1 ml-2 text-gray-900"
              autoCorrect={false}
              autoCapitalize="none"
              returnKeyType="search"
            />
            {!!searchText && (
              <TouchableOpacity onPress={() => setSearchText("")}>
                <Ionicons name="close-circle" size={20} color="#9ca3af" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Nếu đang search thì hiển thị kết quả, không thì hiển thị home sections */}
        {isSearching ? (
          <View className="px-0">
            <View className="px-5 mb-2 flex-row items-center justify-between">
              <Text className="text-base font-semibold text-gray-900">
                Results for “{searchText.trim()}”
              </Text>
              {searchLoading && <ActivityIndicator size="small" color="#000" />}
            </View>

            {!searchLoading && searchResults.length === 0 ? (
              <View className="px-5 py-6">
                <Text className="text-gray-500">No products found.</Text>
              </View>
            ) : (
              <ProductSection title="Search results" products={searchResults} />
            )}
          </View>
        ) : (
          <>
            {/* Popular Brand */}
            <BrandFilter brands={brands} />

            {/* Product Sections */}
            <ProductSection title="For you" products={forYouProducts} />
            <ProductSection title="Popular" products={popularProducts} />
            <ProductSection title="Newest" products={newestProducts} />
          </>
        )}
      </ScrollView>
    </View>
  );
}
