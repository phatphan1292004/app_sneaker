import ProductCard from "@/components/product/product_card";
import { useAuth } from "@/contexts/AuthContext";
import { favoriteService } from "@/services/favoriteService";
import { Product } from "@/services/productService";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function FavScreen() {
  const { user, loading: authLoading } = useAuth();
  const [favorites, setFavorites] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch favorites
  const fetchFavorites = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setError(null);
      const result = await favoriteService.getUserFavorites(user.uid);
      if (result.success) {
        setFavorites(result.data);
      } else {
        setError("Failed to load favorites");
      }
    } catch (err: any) {
      console.error("Error fetching favorites:", err);
      setError(err.message || "Failed to load favorites");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Refresh favorites
  const onRefresh = () => {
    setRefreshing(true);
    fetchFavorites();
  };

  // Load favorites on mount
  useEffect(() => {
    if (!authLoading) {
      fetchFavorites();
    }
  }, [user, authLoading]);

  // Loading state
  if (authLoading || loading) {
    return (
      <View className="flex-1 bg-gray-100 items-center justify-center">
        <ActivityIndicator size="large" color="#496c60" />
        <Text className="mt-2 text-gray-600">Loading favorites...</Text>
      </View>
    );
  }

  // Not logged in state
  if (!user) {
    return (
      <View className="flex-1 bg-gray-100 items-center justify-center px-5">
        <Ionicons name="heart-outline" size={80} color="#9ca3af" />
        <Text className="text-xl font-bold text-gray-900 mt-4 mb-2">
          Login Required
        </Text>
        <Text className="text-sm text-gray-600 text-center mb-6">
          Please log in to view your favorite products
        </Text>
        <TouchableOpacity
          onPress={() => router.push("/(tabs)/profile")}
          className="px-6 py-3 rounded-full"
          style={{ backgroundColor: "#496c60" }}
        >
          <Text className="text-white font-semibold">Go to Profile</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Error state
  if (error) {
    return (
      <View className="flex-1 bg-gray-100 items-center justify-center px-5">
        <Ionicons name="alert-circle-outline" size={80} color="#ef4444" />
        <Text className="text-xl font-bold text-gray-900 mt-4 mb-2">
          Error Loading Favorites
        </Text>
        <Text className="text-sm text-gray-600 text-center mb-6">{error}</Text>
        <TouchableOpacity
          onPress={fetchFavorites}
          className="px-6 py-3 rounded-full"
          style={{ backgroundColor: "#496c60" }}
        >
          <Text className="text-white font-semibold">Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Empty state
  if (favorites.length === 0) {
    return (
      <View className="flex-1 bg-gray-100">
        {/* Header */}
        <View className="px-5 py-4 bg-white">
          <Text className="text-2xl font-bold text-gray-900">My Favorites</Text>
          <Text className="text-sm text-gray-600 mt-1">
            Your favorite products
          </Text>
        </View>

        {/* Empty State */}
        <View className="flex-1 items-center justify-center px-5">
          <Ionicons name="heart-outline" size={80} color="#9ca3af" />
          <Text className="text-xl font-bold text-gray-900 mt-4 mb-2">
            No Favorites Yet
          </Text>
          <Text className="text-sm text-gray-600 text-center mb-6">
            Start adding products to your favorites by tapping the heart icon
          </Text>
          <TouchableOpacity
            onPress={() => router.push("/(tabs)")}
            className="px-6 py-3 rounded-full"
            style={{ backgroundColor: "#496c60" }}
          >
            <Text className="text-white font-semibold">Browse Products</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Favorites list
  return (
    <View className="flex-1 bg-gray-100 pt-12">
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#496c60"]}
            tintColor="#496c60"
          />
        }
      >
        {/* Header */}
        <View className="px-5 py-4 bg-gray-100 flex-row items-center">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center mr-3"
          >
            <Ionicons name="chevron-back" size={24} color="#000" />
          </TouchableOpacity>
          <View className="flex-1">
            <Text className="text-2xl font-bold text-gray-900">My Favorites</Text>
            <Text className="text-sm text-gray-600 mt-1">
              {favorites.length} {favorites.length === 1 ? "product" : "products"}
            </Text>
          </View>
        </View>

        {/* Products Grid */}
        <View className="px-5 py-4">
          <View className="flex-row flex-wrap justify-between">
            {favorites.map((product) => (
              <ProductCard
                key={product._id}
                id={product._id}
                brand={
                  typeof product.brand_id === "object"
                    ? product.brand_id.name
                    : ""
                }
                name={product.name}
                price={product.base_price}
                image={product.images[0]}
                discount={product.discount}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}