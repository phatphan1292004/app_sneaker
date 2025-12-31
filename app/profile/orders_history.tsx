import OrderDetailModal from "@/components/order/OrderDetailModal";
import { useAuth } from "@/contexts/AuthContext";
import { ApiOrder, orderService } from "@/services/orderService";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  Image,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type OrderTab = "paid" | "pending" | "cancelled";

export default function OrdersHistoryScreen() {
  const [orders, setOrders] = useState<ApiOrder[]>([]);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<OrderTab>("paid");
  const [selectedOrder, setSelectedOrder] = useState<ApiOrder | null>(null);
  const [showModal, setShowModal] = useState(false);

  const { user } = useAuth();
  const userId = user?.uid || "";

  const fetchOrders = async () => {
    if (!userId) return;
    try {
      const res = await orderService.getUserOrders(userId);
      if (res.success) setOrders(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [userId]);

  const filteredOrders = useMemo(() => {
    return orders
      .filter((o) => o.status === tab)
      .filter((o) => {
        if (!search.trim()) return true;
        const s = search.toLowerCase();
        return (
          o._id.slice(-6).toLowerCase().includes(s) ||
          o.items[0]?.product_id.name.toLowerCase().includes(s)
        );
      });
  }, [orders, tab, search]);

  const openOrderDetail = async (orderId: string) => {
    const res = await orderService.getOrderById(orderId);
    if (res.success) {
      setSelectedOrder(res.data);
      setShowModal(true);
    }
  };

  const TabButton = ({ label, value }: { label: string; value: OrderTab }) => {
    const active = tab === value;
    return (
      <TouchableOpacity
        onPress={() => setTab(value)}
        className="flex-1 py-2 rounded-xl items-center"
        style={{ backgroundColor: active ? "#496c60" : "#F3F4F6" }}
      >
        <Text
          className="font-semibold text-sm"
          style={{ color: active ? "white" : "#111827" }}
        >
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View className="flex-1 bg-white pt-12">
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

      {/* Tabs */}
      <View className="px-5 mb-2 gap-3 flex-row space-x-2">
        <TabButton label="PAID" value="paid" />
        <TabButton label="PENDING" value="pending" />
        <TabButton label="CANCELLED" value="cancelled" />
      </View>

      {/* Search */}
      <View className="px-5 py-3 border-b border-gray-200">
        <View className="flex-row items-center bg-gray-50 rounded-xl px-4 py-3">
          <Ionicons name="search-outline" size={20} color="#9CA3AF" />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search order..."
            className="flex-1 ml-2"
          />
        </View>
      </View>

      <ScrollView className="flex-1 px-5 py-4">
        {filteredOrders.map((order) => {
          const firstItem = order.items[0];
          return (
            <View
              key={order._id}
              className="mb-4 bg-white rounded-2xl border border-gray-200 p-4"
            >
              <View className="flex-row justify-between mb-3">
                <View>
                  <Text className="font-bold text-base">
                    #{order._id.slice(-6)}
                  </Text>
                  <Text className="text-xs text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                  </Text>
                </View>
                <TouchableOpacity onPress={() => openOrderDetail(order._id)}>
                  <Text className="font-semibold" style={{ color: "#496c60" }}>Order Details</Text>
                </TouchableOpacity>
              </View>

              <View className="flex-row">
                {firstItem.product_id.images?.[0] && (
                  <View className="rounded-xl mr-3 overflow-hidden bg-gray-50">
                    <Image
                      source={{ uri: firstItem.product_id.images[0] }}
                      className="w-20 h-20"
                      resizeMode="contain"
                    />
                  </View>
                )}
                <View className="flex-1">
                  <Text className="font-semibold">
                    {firstItem.product_id.name}
                  </Text>
                  <Text className="text-xs text-gray-500" numberOfLines={2}>
                    {firstItem.product_id.description}
                  </Text>
                </View>
              </View>
            </View>
          );
        })}
      </ScrollView>

      <OrderDetailModal
        visible={showModal}
        order={selectedOrder}
        onClose={() => setShowModal(false)}
        onCancelled={fetchOrders}
      />
    </View>
  );
}
