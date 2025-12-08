import SimpleTabBar from "@/components/tabbar/SimpleTabBar";
import { useCart } from "@/contexts/CartContext";
import { useProductDetail } from "@/hooks/useProductDetail";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

const { width } = Dimensions.get("window");

export default function ProductDetailScreen() {
  const params = useLocalSearchParams();
  const productId = params.id as string;

  const { product, loading, error } = useProductDetail(productId);
  const { addItem } = useCart();

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState<"description" | "review">(
    "description"
  );

  // Get unique colors from variants
  const availableColors = useMemo(() => {
    if (!product?.variants) return [];
    return [...new Set(product.variants.map((v) => v.color))];
  }, [product]);

  // Get sizes filtered by selected color
  const availableSizes = useMemo(() => {
    if (!product?.variants) return [];

    // If a color is selected, only show sizes for that color
    if (selectedColor) {
      return [
        ...new Set(
          product.variants
            .filter((v) => v.color === selectedColor)
            .map((v) => v.size)
        ),
      ].sort();
    }

    // If no color selected, show all sizes
    return [...new Set(product.variants.map((v) => v.size))].sort();
  }, [product, selectedColor]);

  // Reset selected size when color changes
  useEffect(() => {
    if (selectedColor && !availableSizes.includes(selectedSize)) {
      setSelectedSize("");
    }
  }, [selectedColor, availableSizes, selectedSize]);

  // Get brand name
  const brandName = useMemo(() => {
    if (!product) return "";
    return typeof product.brand_id === "object" ? product.brand_id.name : "";
  }, [product]);

  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  // Get selected variant
  const selectedVariant = useMemo(() => {
    if (!product?.variants || !selectedColor || !selectedSize) return null;
    return product.variants.find(
      (v) => v.color === selectedColor && v.size === selectedSize
    );
  }, [product, selectedColor, selectedSize]);

  // Handle add to cart
  const handleAddToCart = () => {
    if (!product) return;

    if (!selectedVariant) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Selected variant not available",
        position: "bottom",
      });
      return;
    }

    if (selectedVariant.stock <= 0) {
      Toast.show({
        type: "error",
        text1: "Out of Stock",
        text2: "This variant is currently unavailable",
        position: "bottom",
      });
      return;
    }

    addItem({
      productId: product._id,
      variantId: selectedVariant._id,
      name: product.name,
      brand: brandName,
      image: product.images[0],
      color: selectedColor,
      size: selectedSize,
      price: selectedVariant.price,
    });

    Toast.show({
      type: "success",
      text1: "Added to Cart",
      text2: `${product.name} (${selectedColor}, Size ${selectedSize}) has been added.`,
      position: "bottom",
    });
  };

  if (loading) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#496c60" />
        <Text className="mt-2 text-gray-600">Loading product</Text>
      </View>
    );
  }

  if (error || !product) {
    return (
      <View className="flex-1 bg-white items-center justify-center px-5">
        <Ionicons name="alert-circle-outline" size={64} color="#ef4444" />
        <Text className="text-lg font-semibold text-gray-900 mt-4">
          {error || "Product not found"}
        </Text>
        <TouchableOpacity
          onPress={() => router.back()}
          className="mt-6 px-6 py-3 rounded-full"
          style={{ backgroundColor: "#496c60" }}
        >
          <Text className="text-white font-semibold">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white mt-5">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-5 py-4 flex-row items-center justify-between">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center"
          >
            <Ionicons name="chevron-back" size={24} color="#000" />
          </TouchableOpacity>

          <Image
            source={{
              uri: "https://cdn.dribbble.com/userupload/31584578/file/original-050b602625e120a96798e483b9199f46.png?format=webp&resize=450x338&vertical=center",
            }}
            className="w-14 h-14 rounded-lg"
          />

          <TouchableOpacity
            onPress={() => setIsFavorite(!isFavorite)}
            className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center"
          >
            <Ionicons
              name={isFavorite ? "heart" : "heart-outline"}
              size={24}
              color={isFavorite ? "#FF4757" : "#000"}
            />
          </TouchableOpacity>
        </View>

        {/* Product Image with Overlapping Thumbnails */}
        <View className="mb-6 relative">
          <Image
            source={{ uri: product.images[selectedImageIndex] }}
            style={{ width: "100%", height: 320, borderRadius: 12 }}
            resizeMode="cover"
          />

          {/* Dark Overlay */}
          <View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              borderRadius: 12,
              backgroundColor: "rgba(0, 0, 0, 0.15)",
            }}
          />

          {/* Image Selector Overlay */}
          <View
            className="absolute -bottom-8 left-0 right-0 px-5"
            style={{
              flexDirection: "row",
              justifyContent: "center",
              gap: 12,
            }}
          >
            {product.images.map((image, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => setSelectedImageIndex(index)}
                className="rounded-xl overflow-hidden"
                style={{
                  borderWidth: selectedImageIndex === index ? 2 : 0,
                  borderColor: "#496c60",
                  backgroundColor: "rgba(255, 255, 255, 0.9)",
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.25,
                  shadowRadius: 3.84,
                  elevation: 5,
                }}
              >
                <Image
                  source={{ uri: image }}
                  className="w-20 h-20"
                  resizeMode="cover"
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Product Info */}
        <View className="px-5 pt-10">
          <Text className="text-sm text-gray-500 mb-2 font-semibold color-[#496c60]">
            {brandName}
          </Text>
          <Text className="text-2xl font-bold text-gray-900 mb-6">
            {product.name}
          </Text>

          {/* Select Color */}
          {availableColors.length > 0 && (
            <>
              <Text className="text-base font-semibold text-gray-900 mb-3">
                Select Color
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                className="mb-6"
                contentContainerStyle={{ gap: 12 }}
              >
                {availableColors.map((color) => (
                  <TouchableOpacity
                    key={color}
                    onPress={() => setSelectedColor(color)}
                    className="px-3 h-10 rounded-full text-sm items-center justify-center"
                    style={{
                      backgroundColor:
                        selectedColor === color ? "#496c60" : "#f3f4f6",
                      borderWidth: selectedColor === color ? 2 : 0,
                      borderColor: "#496c60",
                    }}
                  >
                    <Text
                      className="font-semibold"
                      style={{
                        color: selectedColor === color ? "#fff" : "#6b7280",
                      }}
                    >
                      {color}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </>
          )}

          {/* Select Size */}
          {availableSizes.length > 0 && (
            <>
              <Text className="text-base font-semibold text-gray-900 mb-3">
                Select Size
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                className="mb-6"
                contentContainerStyle={{ gap: 12 }}
              >
                {availableSizes.map((size) => (
                  <TouchableOpacity
                    key={size}
                    onPress={() => setSelectedSize(size)}
                    className="w-10 h-10 rounded-full items-center justify-center"
                    style={{
                      backgroundColor:
                        selectedSize === size ? "#496c60" : "#f3f4f6",
                    }}
                  >
                    <Text
                      className="font-semibold"
                      style={{
                        color: selectedSize === size ? "#fff" : "#6b7280",
                      }}
                    >
                      {size}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </>
          )}

          {/* Tabs */}
          <View className="flex-row mb-4 border-b border-gray-200">
            <TouchableOpacity
              onPress={() => setActiveTab("description")}
              className="flex-1 pb-3"
              style={{
                borderBottomWidth: activeTab === "description" ? 2 : 0,
                borderBottomColor: "#496c60",
              }}
            >
              <Text
                className="text-center font-semibold"
                style={{
                  color: activeTab === "description" ? "#496c60" : "#9ca3af",
                }}
              >
                Description
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setActiveTab("review")}
              className="flex-1 pb-3"
              style={{
                borderBottomWidth: activeTab === "review" ? 2 : 0,
                borderBottomColor: "#496c60",
              }}
            >
              <Text
                className="text-center font-semibold"
                style={{
                  color: activeTab === "review" ? "#496c60" : "#9ca3af",
                }}
              >
                Review
              </Text>
            </TouchableOpacity>
          </View>

          {/* Tab Content */}
          {activeTab === "description" ? (
            <Text className="text-sm text-gray-600 leading-6 mb-8">
              {product.description}
            </Text>
          ) : (
            <View className="mb-8">
              <View className="flex-row items-center mb-4">
                <View className="flex-row items-center mr-4">
                  <Ionicons name="star" size={20} color="#FFC107" />
                  <Text className="text-lg font-bold text-gray-900 ml-1">
                    4.5
                  </Text>
                  <Text className="text-sm text-gray-500 ml-1">
                    (120 reviews)
                  </Text>
                </View>
              </View>

              {/* Sample Review */}
              <View className="bg-gray-50 rounded-xl p-4 mb-3">
                <View className="flex-row items-center justify-between mb-2">
                  <Text className="font-semibold text-gray-900">John Doe</Text>
                  <View className="flex-row">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Ionicons
                        key={star}
                        name="star"
                        size={14}
                        color="#FFC107"
                      />
                    ))}
                  </View>
                </View>
                <Text className="text-sm text-gray-600">
                  Great shoes! Very comfortable and stylish. Highly recommend
                  for running.
                </Text>
              </View>

              <View className="bg-gray-50 rounded-xl p-4">
                <View className="flex-row items-center justify-between mb-2">
                  <Text className="font-semibold text-gray-900">
                    Jane Smith
                  </Text>
                  <View className="flex-row">
                    {[1, 2, 3, 4].map((star) => (
                      <Ionicons
                        key={star}
                        name="star"
                        size={14}
                        color="#FFC107"
                      />
                    ))}
                    <Ionicons name="star-outline" size={14} color="#FFC107" />
                  </View>
                </View>
                <Text className="text-sm text-gray-600">
                  Good quality but a bit pricey. Worth it for the comfort level.
                </Text>
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <View
        className="py-2 pr-5 flex-row items-center gap-3 bg-white"
        style={{
          borderTopWidth: 1,
          borderTopColor: "#e5e7eb",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.05,
          shadowRadius: 4,
          elevation: 5,
        }}
      >
        <View className="flex-1 px-5 py-4" style={{ borderColor: "#496c60" }}>
          <Text className="font-bold text-lg" style={{ color: "#496c60" }}>
            {formatPrice(product.base_price)}
          </Text>
        </View>
        <TouchableOpacity
          onPress={handleAddToCart}
          disabled={!selectedVariant || selectedVariant.stock <= 0}
          className="flex-1 rounded-full px-5 py-3 flex-row items-center justify-center"
          style={{
            backgroundColor:
              !selectedVariant || selectedVariant.stock <= 0
                ? "#9ca3af"
                : "#496c60",
          }}
        >
          <Ionicons name="cart-outline" size={20} color="#fff" />
          <Text className="text-white font-semibold text-base ml-2">
            {!selectedVariant
              ? "Select Options"
              : selectedVariant.stock <= 0
                ? "Out of Stock"
                : "Add to Cart"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Simple Tab Bar */}
      <SimpleTabBar />
    </View>
  );
}
