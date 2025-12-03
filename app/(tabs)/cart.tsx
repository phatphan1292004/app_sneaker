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

export default function CartScreen({ router }: { router?: any }) {
  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View
        className="px-5 py-4 border-b border-gray-200 flex-row items-center"
        style={{ paddingTop: StatusBar.currentHeight || 20 }}
      >
        <TouchableOpacity
          onPress={() => router?.back()}
          className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center"
        >
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>

        <Text className="text-xl font-bold text-gray-900 flex-1 text-center">
          Cart
        </Text>

        <View className="w-10 h-10" />
      </View>

      {/* Scroll danh sách sản phẩm */}
      <ScrollView
        contentContainerStyle={{ paddingBottom: 250 }}
        className="p-5"
      >
        {[
          {
            name: "Nike Air Max 90 Premium",
            size: 37,
            price: 150,
            image:
              "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=500&auto=format&fit=crop&q=60",
          },
          {
            name: "Puma Plexus Sneakers",
            size: 37,
            price: 140,
            image:
              "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=500&auto=format&fit=crop&q=60",
          },
          {
            name: "Adidas NMD_R1 SHOES",
            size: 37,
            price: 160,
            image:
              "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=500&auto=format&fit=crop&q=60",
          },
          {
            name: "Adidas NMD_R1 SHOES",
            size: 37,
            price: 160,
            image:
              "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=500&auto=format&fit=crop&q=60",
          },
          {
            name: "Adidas NMD_R1 SHOES",
            size: 37,
            price: 160,
            image:
              "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=500&auto=format&fit=crop&q=60",
          },
          {
            name: "Adidas NMD_R1 SHOES",
            size: 37,
            price: 160,
            image:
              "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=500&auto=format&fit=crop&q=60",
          },
          {
            name: "Adidas NMD_R1 SHOES",
            size: 37,
            price: 160,
            image:
              "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=500&auto=format&fit=crop&q=60",
          },
        ].map((item, index) => (
          <View
            key={index}
            className="flex-row items-center justify-between mb-4 bg-gray-50 p-3 rounded-lg"
          >
            <Image
              source={{ uri: item.image }}
              className="w-16 h-16 rounded"
              resizeMode="contain"
            />
            <View className="flex-1 ml-3">
              <Text className="font-medium text-gray-900">{item.name}</Text>
              <Text className="text-sm text-gray-500">Size: {item.size}</Text>
              <Text className="font-bold text-gray-900">${item.price}</Text>
            </View>
            <View className="flex-row items-center">
              <TouchableOpacity className="p-2 bg-gray-200 rounded-l">
                <Text>-</Text>
              </TouchableOpacity>
              <Text className="px-3">1</Text>
              <TouchableOpacity className="p-2 bg-blue-500 rounded-r">
                <Text className="text-white">+</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Coupon & Checkout cố định */}
      <View
        className="bg-white px-5 py-4 border-t border-gray-200"
        style={{ position: "absolute", bottom: 0, width: "100%" }}
      >
        {/* Coupon */}
        <View className="mb-4">
          <Text className="text-sm text-gray-500 mb-1">
            Have a coupon code?
          </Text>
          <View className="flex-row items-center border border-blue-500 rounded-lg overflow-hidden">
            <TextInput
              value="SUMMER15OFF"
              className="flex-1 px-3 py-2"
              placeholder="Enter coupon"
            />
            <TouchableOpacity className="bg-blue-500 px-4 py-2">
              <Text className="text-white font-semibold">✔</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Summary */}
        <View className="mb-6">
          <View className="flex-row justify-between mb-1">
            <Text className="text-gray-600">Subtotal:</Text>
            <Text className="text-gray-900">$450.00</Text>
          </View>
          <View className="flex-row justify-between mb-1">
            <Text className="text-gray-600">Delivery Fee:</Text>
            <Text className="text-gray-900">$10.00</Text>
          </View>
          <View className="flex-row justify-between mb-1">
            <Text className="text-gray-600">Discount:</Text>
            <Text className="text-gray-900">15% OFF</Text>
          </View>
          <View className="flex-row justify-between mt-2">
            <Text className="font-bold text-gray-900">Total:</Text>
            <Text className="font-bold text-gray-900">$382.50</Text>
          </View>
        </View>

        {/* Checkout Button */}
        <TouchableOpacity className="bg-blue-500 py-3 rounded-xl items-center">
          <Text className="text-white font-bold text-lg">Checkout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
