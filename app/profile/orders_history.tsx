import OrderDetailModal from "@/components/order/OrderDetailModal";
import { useAuth } from "@/contexts/AuthContext";
import { ApiOrder, orderService } from "@/services/orderService";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function OrdersHistoryScreen() {
  const [orders, setOrders] = useState<ApiOrder[]>([]);
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<ApiOrder | null>(null);
  const [showModal, setShowModal] = useState(false);

  const { user } = useAuth();
  const userId = user?.uid || "";

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await orderService.getUserOrders(userId);
        if (res.success) {
          setOrders(res.data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchOrders();
  }, []);

  const handleOrderDetail = async (orderId: string) => {
    try {
      const res = await orderService.getOrderById(orderId);
      console.log("Order detail response:", res);
      if (res.success) {
        setSelectedOrder(res.data);
        setShowModal(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View
        className="px-5 py-4 flex-row items-center"
        style={{ paddingTop: StatusBar.currentHeight || 20 }}
      >
        <TouchableOpacity onPress={() => router.back()} className="mr-3">
          <Ionicons name="arrow-back" size={24} color="#496c60" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-gray-900">Orders History</Text>
      </View>

      {/* Search Bar */}
      <View className="px-5 py-3 border-b border-gray-200">
        <View className="flex-row items-center bg-gray-50 rounded-xl px-4 py-3">
          <Ionicons name="search-outline" size={20} color="#9CA3AF" />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search Your Orders..."
            placeholderTextColor="#9CA3AF"
            className="flex-1 ml-2 text-gray-900"
          />
        </View>
      </View>

      <ScrollView className="flex-1 px-5 py-4">
        {orders.map((order) => {
          const firstItem = order.items[0];

          return (
            <View
              key={order._id}
              className="mb-4 bg-white rounded-2xl border border-gray-200 p-4"
            >
              {/* Order Header */}
              <View className="flex-row items-center justify-between mb-3">
                <View>
                  <Text className="font-bold text-gray-900 text-base mb-1">
                    #{order._id.slice(-6)}
                  </Text>
                  <Text className="text-gray-500 text-xs">
                    Ordered on{" "}
                    {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                  </Text>
                </View>

                <TouchableOpacity onPress={() => handleOrderDetail(order._id)}>
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
                <View className="w-20 h-20 bg-gray-100 rounded-xl overflow-hidden mr-3 items-center justify-center">
                  {firstItem.product_id.images ? (
                    <Image
                      source={{ uri: firstItem.product_id.images[0] }}
                      className="w-full h-full"
                      resizeMode="cover"
                    />
                  ) : (
                    <Text className="text-gray-400 text-xs">No Image</Text>
                  )}
                </View>

                <View className="flex-1">
                  <Text className="font-semibold text-gray-900 mb-1">
                    {firstItem.product_id.name}
                  </Text>
                  <Text className="text-gray-500 text-xs" numberOfLines={2}>
                    {firstItem.product_id.description ?? "No description"}
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
                  <Text className="text-gray-600 text-xs">
                    {order.status.toUpperCase()}
                  </Text>
                </View>
                <Text className="text-gray-600 text-xs">
                  {order.items.length}x items
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
          );
        })}
      </ScrollView>

      {/* Modal chi tiết order */}
      <OrderDetailModal
        visible={showModal}
        order={selectedOrder}
        onClose={() => setShowModal(false)}
      />
    </View>
  );
}
