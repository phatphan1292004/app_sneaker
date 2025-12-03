import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Image,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface Order {
  id: string;
  orderDate: string;
  status: string;
  itemCount: number;
  productName: string;
  productDescription: string;
  productImage: string;
}

export default function OrdersHistoryScreen() {
  const orders: Order[] = [
    {
      id: "#10110433",
      orderDate: "10 November 2026",
      status: "Shipped",
      itemCount: 1,
      productName: "Nike Air Max 270",
      productDescription:
        "Stay comfortable and stylish with this casual Nike Hoodie.",
      productImage:
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200",
    },
    {
      id: "#10115050",
      orderDate: "07 November 2026",
      status: "Shipped",
      itemCount: 1,
      productName: "Adidas Ultraboost 22",
      productDescription:
        "The ASUS ROG Strix G16 is built for gamers who demand power, speed, and stunning graphics.",
      productImage:
        "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=200",
    },
    {
      id: "#10110555",
      orderDate: "08 November 2026",
      status: "Delivered",
      itemCount: 2,
      productName: "Puma RS-X Running Shoes",
      productDescription:
        "Premium running shoes with excellent cushioning and support.",
      productImage:
        "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=200",
    },
  ];

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View
        className="px-5 py-4 flex-row items-center justify-between"
        style={{ paddingTop: StatusBar.currentHeight || 20 }}
      >

      </View>

      {/* Search Bar */}
      <View className="px-5 py-3 border-b border-gray-200">
        <View className="flex-row items-center bg-gray-50 rounded-xl px-4 py-3">
          <Ionicons name="search-outline" size={20} color="#9CA3AF" />
          <TextInput
            placeholder="Search Your Orders..."
            placeholderTextColor="#9CA3AF"
            className="flex-1 ml-2 text-gray-900"
          />
        </View>
      </View>

      <ScrollView className="flex-1 px-5 py-4">
        {orders.map((order) => (
          <View key={order.id} className="mb-4 bg-white rounded-2xl border border-gray-200 p-4">
            {/* Order Header */}
            <View className="flex-row items-center justify-between mb-3">
              <View>
                <Text className="font-bold text-gray-900 text-base mb-1">
                  {order.id}
                </Text>
                <Text className="text-gray-500 text-xs">
                  Ordered on {order.orderDate}
                </Text>
              </View>
              <TouchableOpacity>
                <Text
                  className="text-sm font-semibold"
                  style={{ color: "#496c60" }}
                >
                  Order Details
                </Text>
              </TouchableOpacity>
            </View>

            {/* Product Info */}
            <View className="flex-row mb-4">
              <View className="w-20 h-20 bg-gray-100 rounded-xl overflow-hidden mr-3">
                <Image
                  source={{ uri: order.productImage }}
                  className="w-full h-full"
                  resizeMode="cover"
                />
              </View>
              <View className="flex-1">
                <Text className="font-semibold text-gray-900 mb-1">
                  {order.productName}
                </Text>
                <Text className="text-gray-500 text-xs" numberOfLines={2}>
                  {order.productDescription}
                </Text>
              </View>
            </View>

            {/* Status and Items */}
            <View className="flex-row items-center justify-between mb-3">
              <View className="flex-row items-center">
                <Ionicons
                  name="cube-outline"
                  size={16}
                  color="#6B7280"
                  style={{ marginRight: 4 }}
                />
                <Text className="text-gray-600 text-xs">{order.status}</Text>
              </View>
              <Text className="text-gray-600 text-xs">
                {order.itemCount}x items
              </Text>
            </View>

            {/* Track Order Button */}
            <TouchableOpacity
              className="rounded-xl py-3 items-center"
              style={{ backgroundColor: "#496c60" }}
            >
              <Text className="text-white font-semibold text-sm">
                My order track
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
