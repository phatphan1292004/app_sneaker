import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

// Mock product detail data
const PRODUCT_DETAIL = {
  id: "1",
  name: "Nike Zoom Invincible",
  brand: "Nike",
  category: "Men's running shoe",
  price: 180,
  images: [
    "https://images.unsplash.com/photo-1686039804006-5322dedd3ffc?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8b25pdHN1a2ElMjB0aWdlciUyMHNob2VzfGVufDB8fDB8fHww",
    "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8c25lYWtlcnxlbnwwfHwwfHx8MA%3D%3D",
    "https://images.unsplash.com/flagged/photo-1556637640-2c80d3201be8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8c25lYWtlcnxlbnwwfHwwfHx8MA%3D%3D",
    "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHNuZWFrZXJ8ZW58MHx8MHx8fDA%3D",
  ],
  colors: ["#2C5F4A", "#87CEEB", "#FFB6C1", "#9370DB"],
  sizes: [38, 39, 40, 41, 42],
  description:
    "When users select an item, they are taken to a sleek cart interface where they can review their chosen products, view detailed descriptions, and check size, color, etc. Learn more",
};

export default function ProductDetailScreen() {
  const params = useLocalSearchParams();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState(38);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState<"description" | "review">("description");

  return (
    <View className="flex-1 bg-white">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-5 py-4 flex-row items-center justify-between">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center"
          >
            <Ionicons name="chevron-back" size={24} color="#000" />
          </TouchableOpacity>
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
            source={{ uri: PRODUCT_DETAIL.images[selectedImageIndex] }}
            style={{ width: '100%', height: 320, borderRadius: 12 }}
            resizeMode="cover"
          />
          
          {/* Dark Overlay */}
          <View 
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              borderRadius: 12,
              backgroundColor: 'rgba(0, 0, 0, 0.15)',
            }}
          />
          
          {/* Image Selector Overlay */}
          <View 
            className="absolute -bottom-8 left-0 right-0 px-5"
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              gap: 12
            }}
          >
            {PRODUCT_DETAIL.images.map((image, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => setSelectedImageIndex(index)}
                className="rounded-xl overflow-hidden"
                style={{
                  borderWidth: selectedImageIndex === index ? 2 : 0,
                  borderColor: "#496c60",
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
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
          <Text className="text-2xl font-bold text-gray-900 mb-1">
            {PRODUCT_DETAIL.name}
          </Text>
          <Text className="text-sm text-gray-500 mb-4">
            {PRODUCT_DETAIL.category}
          </Text>

          {/* Select Size */}
          <Text className="text-base font-semibold text-gray-900 mb-3">
            Select Size
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="mb-6"
            contentContainerStyle={{ gap: 12 }}
          >
            {PRODUCT_DETAIL.sizes.map((size) => (
              <TouchableOpacity
                key={size}
                onPress={() => setSelectedSize(size)}
                className="w-14 h-14 rounded-full items-center justify-center"
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
              {PRODUCT_DETAIL.description}
            </Text>
          ) : (
            <View className="mb-8">
              <View className="flex-row items-center mb-4">
                <View className="flex-row items-center mr-4">
                  <Ionicons name="star" size={20} color="#FFC107" />
                  <Text className="text-lg font-bold text-gray-900 ml-1">
                    4.5
                  </Text>
                  <Text className="text-sm text-gray-500 ml-1">(120 reviews)</Text>
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
                  Great shoes! Very comfortable and stylish. Highly recommend for running.
                </Text>
              </View>

              <View className="bg-gray-50 rounded-xl p-4">
                <View className="flex-row items-center justify-between mb-2">
                  <Text className="font-semibold text-gray-900">Jane Smith</Text>
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
        className="py-2 pr-5 flex-row items-center gap-3"
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
        <View className="flex-1 bg-white px-5 py-4" style={{ borderColor: "#496c60" }}>
          <Text className="font-bold text-lg" style={{ color: "#496c60" }}>
            $ {PRODUCT_DETAIL.price}
          </Text>
        </View>
        <TouchableOpacity
          className="flex-1 rounded-full px-5 py-4 flex-row items-center justify-center"
          style={{ backgroundColor: "#496c60" }}
        >
          <Text className="text-white font-semibold text-base mr-2">
            Add to Cart
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
