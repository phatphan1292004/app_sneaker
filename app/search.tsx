import ProductSection from "@/components/product/product_section";
import { useProductSearch } from "@/hooks/useProductSearch";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function SearchScreen() {
  const params = useLocalSearchParams();
  const initialQuery = params.query as string || "";
  
  const [searchText, setSearchText] = useState(initialQuery);
  const [currentQuery, setCurrentQuery] = useState(initialQuery);
  
  const { results: searchResults, loading: searchLoading } =
    useProductSearch(currentQuery, false);

  useEffect(() => {
    if (initialQuery) {
      setSearchText(initialQuery);
      setCurrentQuery(initialQuery);
    }
  }, [initialQuery]);

  const handleSearch = () => {
    if (searchText.trim()) {
      setCurrentQuery(searchText.trim());
    }
  };

  return (
    <View className="flex-1 bg-gray-100 mt-5">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-5 pt-3 pb-2 flex-row items-center">
          <TouchableOpacity
            onPress={() => router.back()}
            className="mr-3"
          >
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text className="text-lg font-semibold flex-1">Search</Text>
        </View>

        {/* Search Bar */}
        <View className="mx-5 mb-4">
          <View className="flex-row items-center bg-white rounded-xl px-4 py-3">
            <Ionicons name="search" size={20} color="#9ca3af" />
            <TextInput
              value={searchText}
              onChangeText={setSearchText}
              onSubmitEditing={handleSearch}
              placeholder="Search products..."
              placeholderTextColor="#9ca3af"
              className="flex-1 ml-2 text-gray-900"
              autoCorrect={false}
              autoCapitalize="none"
              returnKeyType="search"
              autoFocus
            />
            {!!searchText && (
              <TouchableOpacity onPress={() => {
                setSearchText("");
                setCurrentQuery("");
              }}>
                <Ionicons name="close-circle" size={20} color="#9ca3af" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Search Results */}
        {currentQuery ? (
          <View className="px-0">
            <View className="px-5 mb-2 flex-row items-center justify-between">
              <Text className="text-base font-semibold text-gray-900">
                Results for {currentQuery}
              </Text>
              {searchLoading && <ActivityIndicator size="small" color="#000" />}
            </View>

            {!searchLoading && searchResults.length === 0 ? (
              <View className="px-5 py-6">
                <Text className="text-gray-500 text-center">
                  No products found.
                </Text>
                <Text className="text-gray-400 text-center mt-2">
                  Try different keywords
                </Text>
              </View>
            ) : (
              <ProductSection title="Search results" products={searchResults} />
            )}
          </View>
        ) : (
          <View className="px-5 py-6">
            <Text className="text-gray-500 text-center">
              Enter a search term to find products
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
