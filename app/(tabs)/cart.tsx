import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

interface CartItem {
  id: number;
  name: string;
  color: string;
  size: string;
  price: number;
  quantity: number;
  image: string;
}

export default function CartScreen() {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: 1,
      name: "Nike Air Max",
      color: "Black",
      size: "8",
      price: 79.28,
      quantity: 1,
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200",
    },
    {
      id: 2,
      name: "T-Shirt Black",
      color: "Black",
      size: "XS",
      price: 49.69,
      quantity: 1,
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200",
    },
  ]);

  const [couponCode, setCouponCode] = useState("");

  const updateQuantity = (id: number, delta: number) => {
    setCartItems((items) =>
      items.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const removeItem = (id: number) => {
    setCartItems((items) => items.filter((item) => item.id !== id));
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = 0; // Free shipping
  const total = subtotal + shipping;

  const CartItem = ({ item }: { item: CartItem }) => {
    return (
      <View className="mb-4 bg-gray-50 rounded-2xl p-4 flex-row items-center relative">
        {/* Delete Button - Top Right */}
        <TouchableOpacity
          onPress={() => removeItem(item.id)}
          className="absolute top-3 right-3 z-10"
        >
          <Ionicons name="trash-outline" size={22} color="#EF4444" />
        </TouchableOpacity>

        {/* Product Image */}
        <View className="rounded-xl mr-4 overflow-hidden">
          <Image
            source={{ uri: item.image }}
            className="w-20 h-20"
            resizeMode="cover"
          />
        </View>

        {/* Product Info */}
        <View className="flex-1 pr-8">
          <Text className="font-bold text-gray-900 text-base mb-2">
            {item.name}
          </Text>
          <View className="flex-row items-center mb-3">
            <View className="flex-row items-center mr-4">
              <Text className="text-gray-500 text-xs mr-2">Color:</Text>
              <Text className="text-gray-900 text-xs">{item.color}</Text>
            </View>
            <View className="flex-row items-center">
              <Text className="text-gray-500 text-xs mr-2">Size:</Text>
              <Text className="text-gray-900 text-xs">{item.size}</Text>
            </View>
          </View>

          <View className="flex-row items-center justify-between">
            {/* Quantity Controls */}
            <View className="flex-row items-center">
              <TouchableOpacity
                onPress={() => updateQuantity(item.id, -1)}
                className="w-8 h-8 bg-gray-200 rounded items-center justify-center"
              >
                <Text className="text-gray-900 text-lg font-bold">−</Text>
              </TouchableOpacity>

              <View className="mx-3 min-w-[30px] items-center">
                <Text className="text-gray-900 font-semibold">
                  {item.quantity}
                </Text>
              </View>

              <TouchableOpacity
                onPress={() => updateQuantity(item.id, 1)}
                className="w-8 h-8 rounded items-center justify-center"
                style={{ backgroundColor: "#496c60" }}
              >
                <Text className="text-white text-lg font-bold">+</Text>
              </TouchableOpacity>
            </View>

            {/* Price */}
            <Text className="font-bold text-gray-900 text-lg">
              ${(item.price * item.quantity).toFixed(2)}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View
        className="px-5 py-4 border-b border-gray-200 flex-row items-center"
        style={{ paddingTop: StatusBar.currentHeight || 20 }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 items-center justify-center"
        >
          <Ionicons name="chevron-back" size={28} color="#000" />
        </TouchableOpacity>

        <Text className="text-xl font-bold text-gray-900 flex-1 text-center">
          My Cart
        </Text>

        <View className="w-10 h-10" />
      </View>

      <ScrollView
        className="flex-1 px-5"
        contentContainerStyle={{ paddingBottom: 300, paddingTop: 20 }}
      >
        {cartItems.map((item) => (
          <CartItem key={item.id} item={item} />
        ))}
      </ScrollView>

      {/* Bottom Section - Fixed */}
      <View
        className="bg-white border-t border-gray-200"
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          paddingBottom: 30,
        }}
      >
        {/* Voucher Code */}
        <View className="px-5 pt-4 pb-3">
          <View className="flex-row items-center border border-gray-200 rounded-xl overflow-hidden">
            <TextInput
              value={couponCode}
              onChangeText={setCouponCode}
              placeholder="Enter coupon code"
              placeholderTextColor="#9CA3AF"
              className="flex-1 px-4 py-3 text-gray-900"
            />
            <TouchableOpacity className="px-5 py-3">
              <Text style={{ color: "#496c60" }} className="font-semibold">Apply</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Order Summary */}
        <View className="px-5 py-3 border-t border-gray-100">
          <Text className="font-bold text-gray-900 text-lg mb-3">
            Order Summary
          </Text>

          <View className="flex-row justify-between mb-2">
            <Text className="text-gray-600">Sub Total</Text>
            <Text className="text-gray-900 font-semibold">
              ${subtotal.toFixed(2)}
            </Text>
          </View>

          <View className="flex-row justify-between mb-3">
            <Text className="text-gray-600">Delivery fee</Text>
            <Text className="text-gray-900 font-semibold">
              ${shipping.toFixed(2)}
            </Text>
          </View>

          <View className="flex-row justify-between mb-4">
            <Text className="font-bold text-gray-900 text-lg">Total</Text>
            <Text className="font-bold text-gray-900 text-xl">
              ${total.toFixed(2)}
            </Text>
          </View>

          {/* Checkout Button */}
          <TouchableOpacity
            onPress={() => router.push("/checkout")}
            className="rounded-2xl py-4 items-center"
            style={{ backgroundColor: "#496c60" }}
          >
            <Text className="text-white font-bold text-base">Checkout</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
