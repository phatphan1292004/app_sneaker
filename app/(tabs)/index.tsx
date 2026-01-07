import BrandFilter from "@/components/home/BrandFilter";
import HomeBanner from "@/components/home/HomeBanner";
import SearchSuggestions from "@/components/home/SearchSuggestions";
import NotificationModal from "@/components/notification/NotificationModal";
import ProductSection from "@/components/product/product_section";
import { useAuth } from "@/contexts/AuthContext";
import { useBrands } from "@/hooks/useBrands";
import { useProducts } from "@/hooks/useProducts";
import { useProductSearch } from "@/hooks/useProductSearch";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
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
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const { results: searchResults, loading: searchLoading } =
    useProductSearch(searchText);
  const loading = brandsLoading || productsLoading;
  const isSearching = useMemo(() => searchText.trim().length > 0, [searchText]);
  const { user } = useAuth();

  const handleSearchSubmit = () => {
    if (searchText.trim()) {
      setShowSuggestions(false);
      router.push({
        pathname: "/search",
        params: { query: searchText.trim() },
      });
    }
  };

  const handleProductSelect = (productId: string) => {
    setShowSuggestions(false);
    setSearchText("");
    router.push(`/product/${productId}`);
  };

  const handleSeeAllResults = () => {
    setShowSuggestions(false);
    router.push({
      pathname: "/search",
      params: { query: searchText.trim() },
    });
  };

  if (loading) {
    return (
      <View className="flex-1 bg-gray-100 items-center justify-center">
        <ActivityIndicator size="large" color="#000" />
        <Text className="mt-2 text-gray-600">Loading...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-100 pt-14">
      {/* Header */}
      <View className="px-5 pt-3 pb-2 flex-row items-center justify-between">
        <View className="flex-row items-center">
          <Image
            // source={{
            //   uri: "https://cdn.dribbble.com/userupload/31584578/file/original-050b602625e120a96798e483b9199f46.png?format=webp&resize=450x338&vertical=center",
            // }}

            source={{
              uri: "https://i.pinimg.com/736x/3f/c6/ba/3fc6bad36d735625e7bbb4a7e311ecd2.jpg",
            }}
            className="w-14 h-14 rounded-lg"
          />
          <View className="ml-3">
            <Text className="text-sm text-gray-500">
              Welcome, {user ? user.displayName : "Guest"} 👋
            </Text>
          </View>
        </View>
        <TouchableOpacity onPress={() => setShowNotificationModal(true)}>
          <Ionicons name="notifications-outline" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Notification Modal */}
      <NotificationModal
        visible={showNotificationModal}
        onClose={() => setShowNotificationModal(false)}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Banner */}
        <HomeBanner />

        {/* Search Bar */}
        <View className="mx-5 mb-4 z-50">
          <View className="flex-row items-center bg-white rounded-xl px-4 py-3">
            <Ionicons name="search" size={20} color="#9ca3af" />
            <TextInput
              value={searchText}
              onChangeText={(text) => {
                setSearchText(text);
                setShowSuggestions(text.trim().length > 0);
              }}
              onSubmitEditing={handleSearchSubmit}
              onFocus={() => {
                if (searchText.trim().length > 0) {
                  setShowSuggestions(true);
                }
              }}
              placeholder="Search products..."
              placeholderTextColor="#9ca3af"
              className="flex-1 ml-2 text-gray-900 py-3"
              autoCorrect={false}
              autoCapitalize="none"
              returnKeyType="search"
            />
            {!!searchText && (
              <TouchableOpacity
                onPress={() => {
                  setSearchText("");
                  setShowSuggestions(false);
                }}
              >
                <Ionicons name="close-circle" size={20} color="#9ca3af" />
              </TouchableOpacity>
            )}
          </View>

          {/* Search Suggestions Dropdown */}
          {showSuggestions && isSearching && (
            <SearchSuggestions
              results={searchResults}
              loading={searchLoading}
              onSelectProduct={handleProductSelect}
              onSeeAll={handleSeeAllResults}
            />
          )}
        </View>

        <>
          {/* Popular Brand */}
          <BrandFilter brands={brands} />

          {/* Product Sections */}
          <ProductSection title="For you" products={forYouProducts} />
          <ProductSection title="Popular" products={popularProducts} />
          <ProductSection title="Newest" products={newestProducts} />
        </>
      </ScrollView>
    </View>
  );
}
