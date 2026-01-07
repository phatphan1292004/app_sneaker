import CartItem from "@/components/order/CartItem";
import { useCart } from "@/contexts/CartContext";
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
  View,
} from "react-native";

export default function CartScreen() {
  const { items, updateQuantity, removeItem, getTotalPrice } = useCart();
  const [couponCode, setCouponCode] = useState("");

  const subtotal = getTotalPrice();
  const shipping = 0; // Free shipping
  const total = subtotal + shipping;

  return (
    <View className="flex-1 bg-gray-100 pt-12">
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
      {items.length === 0 ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Image
            source={{
              width:200, height:200,
              uri: "https://i.pinimg.com/1200x/f7/b3/11/f7b3113394e96105685b79f80a374eb5.jpg",
            }}
            className="w-14 h-14 rounded-lg"
          />
          <Text className="text-gray-400 text-lg mt-4">Your cart is empty</Text>
        </View>
      ) : (
        <ScrollView
          className="flex-1 px-5"
          contentContainerStyle={{ paddingBottom: 300, paddingTop: 20 }}
        >
          {items.map((item) => (
            <CartItem
              key={item.variantId}
              item={item}
              updateQuantity={updateQuantity}
              removeItem={removeItem}
            />
          ))}
        </ScrollView>
      )}

      {/* Bottom Section - Fixed */}
      {items.length > 0 && (
        <View
          className="bg-gray-100 border-t border-gray-200"
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
            <View className="flex-row bg-white items-center border border-gray-200 rounded-xl overflow-hidden">
              <TextInput
                value={couponCode}
                onChangeText={setCouponCode}
                placeholder="Enter coupon code"
                placeholderTextColor="#9CA3AF"
                className="flex-1 px-4 py-5 text-gray-900"
              />
              <TouchableOpacity className="px-5 py-3">
                <Text style={{ color: "#496c60" }} className="font-semibold">
                  Apply
                </Text>
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
                {subtotal.toLocaleString()} đ
              </Text>
            </View>

            <View className="flex-row justify-between mb-3">
              <Text className="text-gray-600">Delivery fee</Text>
              <Text className="text-gray-900 font-semibold">
                {shipping.toLocaleString()} đ
              </Text>
            </View>

            <View className="flex-row justify-between mb-4">
              <Text className="font-bold text-gray-900 text-lg">Total</Text>
              <Text className="font-bold text-gray-900 text-xl">
                {total.toLocaleString()} đ
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
      )}
    </View>
  );
}
