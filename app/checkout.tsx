import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { orderService } from "@/services/order_service";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

export default function CheckoutScreen() {
  const { items, getTotalItems, getTotalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const [selectedPayment, setSelectedPayment] = useState<string>("card");
  const [loading, setLoading] = useState(false);

  const subtotal = getTotalPrice();
  const shipping = 0;
  const total = subtotal + shipping;

  const paymentMethods = [
    {
      id: "card",
      name: "Credit/Debit Card",
      icon: "card-outline",
      description: "Visa, Mastercard, AMEX",
    },
    {
      id: "momo",
      name: "MoMo",
      icon: "wallet-outline",
      description: "MoMo e-wallet",
    },
    {
      id: "vnpay",
      name: "VNPay",
      icon: "phone-portrait-outline",
      description: "VNPay payment gateway",
    },
    {
      id: "cod",
      name: "Cash on Delivery",
      icon: "cash-outline",
      description: "Pay when you receive",
    },
  ];

  const handlePlaceOrder = async () => {
    if (!user) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Please login to place order",
      });
      router.push("/auth/login");
      return;
    }

    if (items.length === 0) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Your cart is empty",
      });
      return;
    }

    try {
      setLoading(true);

      const orderData = {
        user_id: user.uid,
        items: items.map((item) => ({
          product_id: item.productId,
          variant_id: item.variantId,
          quantity: item.quantity,
          price: item.price,
        })),
        shipping_address: {
          street: "123 Main Street, District 1",
          city: "Ho Chi Minh City",
          country: "Vietnam",
        },
        payment_method: selectedPayment,
        total_amount: total,
      };

      const response = await orderService.createOrder(orderData);

      if (response.success) {
        console.log("✅ Order created:", response.data);
        clearCart();

        // SUCCESS TOAST
        Toast.show({
          type: "success",
          text1: "Success",
          text2: "Order placed successfully!",
        });

        // Điều hướng sau 700ms cho toast kịp hiển thị
        setTimeout(() => {
          router.push("/(tabs)");
        }, 700);
      }
    } catch (error: any) {
      console.error("❌ Error creating order:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2:
          error.response?.data?.message ||
          "Failed to place order. Please try again.",
        position: "bottom",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-white">
      <ScrollView
        className="flex-1 px-5"
        contentContainerStyle={{
          paddingTop: StatusBar.currentHeight || 20,
          paddingBottom: 100,
        }}
      >
        {/* Header with back button */}
        <View className="flex-row items-center mb-6 mt-2">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 items-center justify-center"
          >
            <Ionicons name="chevron-back" size={28} color="#000" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-gray-900 flex-1 text-center mr-10">
            Checkout
          </Text>
        </View>

        {/* Delivery Address */}
        <View className="mb-6">
          <Text className="text-lg font-bold text-gray-900 mb-3">
            Delivery Address
          </Text>
          <TouchableOpacity className="bg-gray-50 rounded-2xl p-4">
            <View className="flex-row items-start justify-between">
              <View className="flex-1">
                <Text className="font-semibold text-gray-900 mb-1">
                  Home Address
                </Text>
                <Text className="text-gray-600 text-sm">
                  123 Main Street, District 1{"\n"}Ho Chi Minh City, Vietnam
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Order Summary */}
        <View className="mb-6">
          <Text className="text-lg font-bold text-gray-900 mb-3">
            Order Summary
          </Text>
          <View className="bg-gray-50 rounded-2xl p-4">
            <View className="flex-row justify-between mb-2">
              <Text className="text-gray-600">
                Subtotal ({getTotalItems()} items)
              </Text>
              <Text className="text-gray-900 font-semibold">
                {subtotal.toLocaleString()} đ
              </Text>
            </View>
            <View className="flex-row justify-between mb-3">
              <Text className="text-gray-600">Shipping</Text>
              <Text className="text-gray-900 font-semibold">Free</Text>
            </View>
            <View className="h-px bg-gray-200 my-2" />
            <View className="flex-row justify-between">
              <Text className="font-bold text-gray-900 text-lg">Total</Text>
              <Text className="font-bold text-gray-900 text-xl">
                {total.toLocaleString()} đ
              </Text>
            </View>
          </View>
        </View>

        {/* Payment Method */}
        <View className="mb-6">
          <Text className="text-lg font-bold text-gray-900 mb-3">
            Payment Method
          </Text>
          {paymentMethods.map((method) => (
            <TouchableOpacity
              key={method.id}
              onPress={() => setSelectedPayment(method.id)}
              className="bg-gray-50 rounded-2xl p-4 mb-3 flex-row items-center"
              style={{
                borderWidth: 2,
                borderColor:
                  selectedPayment === method.id ? "#496c60" : "transparent",
              }}
            >
              <View
                className="w-12 h-12 rounded-xl items-center justify-center mr-3"
                style={{
                  backgroundColor:
                    selectedPayment === method.id ? "#d1e7dd" : "#e5e7eb",
                }}
              >
                <Ionicons
                  name={method.icon as any}
                  size={24}
                  color={selectedPayment === method.id ? "#496c60" : "#6B7280"}
                />
              </View>
              <View className="flex-1">
                <Text className="font-semibold text-gray-900 mb-1">
                  {method.name}
                </Text>
                <Text className="text-gray-500 text-xs">
                  {method.description}
                </Text>
              </View>
              {selectedPayment === method.id && (
                <Ionicons name="checkmark-circle" size={24} color="#496c60" />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Place Order Button - Fixed at bottom */}
      <View
        className="px-5 py-4 border-t border-gray-200 bg-white"
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
        }}
      >
        <TouchableOpacity
          onPress={handlePlaceOrder}
          disabled={loading || items.length === 0}
          className="rounded-2xl py-4 items-center"
          style={{
            backgroundColor:
              loading || items.length === 0 ? "#9CA3AF" : "#496c60",
          }}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white font-bold text-base">Place Order</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
