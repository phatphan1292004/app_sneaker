import EditAddressModal from "@/components/address/EditAddressModal";
import { CartItem as CartItemType, useCart } from "@/contexts/CartContext";
import { ApiOrder, orderService } from "@/services/orderService";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

export default function OrderDetailScreen() {
  const { id } = useLocalSearchParams();
  const [order, setOrder] = useState<ApiOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingCancel, setLoadingCancel] = useState(false);
  const [loadingReorder, setLoadingReorder] = useState(false);
  const [showEditAddressModal, setShowEditAddressModal] = useState(false);

  const { replaceCart } = useCart() as any;

  const status = useMemo(() => {
    return (order?.status || "").toLowerCase();
  }, [order?.status]);

  const canCancel = status === "pending";
  const canReorder = status === "paid" || status === "cancelled";

  const cartItemsFromOrder: CartItemType[] = useMemo(() => {
    if (!order) return [];

    return order.items.map((it) => ({
      productId: it.product_id._id,
      variantId: it.variant_id._id,
      name: it.product_id.name,
      image: it.product_id.images?.[0] || "",
      color: it.variant_id.color,
      size: it.variant_id.size,
      price: it.price ?? it.variant_id.price,
      quantity: it.quantity,
      brand: it.brand || "",
    }));
  }, [order]);

  const fetchOrder = async () => {
    if (!id || typeof id !== "string") return;
    try {
      setLoading(true);
      const res = await orderService.getOrderById(id);
      if (res.success) {
        setOrder(res.data);
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Failed to load order details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleCancel = async () => {
    if (!order) return;

    Alert.alert("Xác nhận", "Bạn muốn hủy đơn hàng này?", [
      { text: "Không", style: "cancel" },
      {
        text: "Hủy đơn",
        style: "destructive",
        onPress: async () => {
          try {
            setLoadingCancel(true);
            const res = await orderService.cancelOrder(order._id);

            if (res?.success) {
              Alert.alert("Thành công", "Đơn hàng đã được hủy.");
              fetchOrder();
            } else {
              Alert.alert("Thất bại", res?.message || "Không thể hủy đơn.");
            }
          } catch (e: any) {
            Alert.alert("Lỗi", e?.message || "Có lỗi xảy ra.");
          } finally {
            setLoadingCancel(false);
          }
        },
      },
    ]);
  };

  const handleReorder = async () => {
    if (!order) return;

    try {
      setLoadingReorder(true);

      if (typeof replaceCart !== "function") {
        Alert.alert(
          "Thiếu hàm replaceCart",
          "CartContext của bạn chưa có replaceCart(items). Hãy thêm hàm này để Mua lại hoạt động."
        );
        return;
      }

      replaceCart(cartItemsFromOrder);
      router.push("/cart");
    } catch (e: any) {
      Alert.alert("Lỗi", e?.message || "Không thể mua lại.");
    } finally {
      setLoadingReorder(false);
    }
  };

  const handleUpdateAddress = async (newAddress: {
    street: string;
    province: string;
    district: string;
    ward: string;
  }) => {
    if (!order) return;

    try {
      const res = await orderService.updateShippingAddress(order._id, {
        ...newAddress,
        country: "Vietnam",
      });

      if (res?.success) {
        Toast.show({
          type: "success",
          text1: "Success",
          text2: "Shipping address updated successfully!",
        });
        setShowEditAddressModal(false);
        // Refresh order data
        fetchOrder();
      } else {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: res?.message || "Failed to update address",
        });
      }
    } catch (e: any) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: e?.message || "Failed to update address",
      });
    }
  };

  if (loading) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#496c60" />
        <Text className="mt-3 text-gray-600">Loading...</Text>
      </View>
    );
  }

  if (!order) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <Text className="text-gray-600">Order not found</Text>
        <TouchableOpacity
          onPress={() => router.back()}
          className="mt-4 px-6 py-3 rounded-xl"
          style={{ backgroundColor: "#496c60" }}
        >
          <Text className="text-white font-semibold">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white pt-12">
      {/* Header */}
      <View
        className="px-5 py-4 border-b border-gray-200 flex-row items-center justify-between"
        style={{ paddingTop: StatusBar.currentHeight || 20 }}
      >
        <View className="flex-row items-center flex-1">
          <TouchableOpacity onPress={() => router.back()} className="mr-3">
            <Ionicons name="arrow-back" size={24} color="#496c60" />
          </TouchableOpacity>
          <Text className="text-xl font-bold" style={{ color: "#496c60" }}>
            Order Details 
          </Text>
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-5 py-4">
          <Text className="font-bold text-base" style={{ color: "#496c60" }}>
            Id: #{order._id.slice(-6)}
          </Text>
          {/* Status Info */}
          <View className="mb-4 bg-gray-50 rounded-xl p-4">
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-sm text-gray-600">Status</Text>
              <Text
                className="font-bold text-base capitalize"
                style={{
                  color:
                    status === "paid"
                      ? "#10b981"
                      : status === "pending"
                        ? "#f59e0b"
                        : "#ef4444",
                }}
              >
                {order.status}
              </Text>
            </View>
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-sm text-gray-600">Payment Method</Text>
              <Text className="font-semibold">
                {order.payment_method?.toUpperCase()}
              </Text>
            </View>
            <View className="flex-row items-center justify-between">
              <Text className="text-sm text-gray-600">Created at</Text>
              <Text className="font-semibold">
                {new Date(order.createdAt).toLocaleString("vi-VN")}
              </Text>
            </View>
          </View>

          {/* Shipping Address */}
          <View className="mb-4">
            <View className="flex-row items-center justify-between mb-2">
              <Text
                className="font-bold text-base"
                style={{ color: "#496c60" }}
              >
                Shipping Address
              </Text>
              {status === "pending" && (
                <TouchableOpacity 
                  className="flex-row items-center"
                  onPress={() => setShowEditAddressModal(true)}
                >
                  <Ionicons name="create-outline" size={18} color="#496c60" />
                  <Text
                    className="ml-1 text-sm font-semibold"
                    style={{ color: "#496c60" }}
                  >
                    Edit
                  </Text>
                </TouchableOpacity>
              )}
            </View>
            <View className="bg-gray-50 rounded-xl p-4">
              <Text className="text-gray-700">
                {order.shipping_address.street}, {order.shipping_address.ward},{" "}
                {order.shipping_address.district},{" "}
                {order.shipping_address.province},{" "}
                {order.shipping_address.country}
              </Text>
            </View>
          </View>

          {/* Items */}
          <View className="mb-4">
            <Text
              className="font-bold text-base mb-3"
              style={{ color: "#496c60" }}
            >
              Items
            </Text>
            {order.items.map((item) => (
              <View
                key={item._id}
                className="bg-white border border-gray-200 rounded-xl p-4 mb-3"
              >
                <View className="flex-row">
                  {!!item.product_id.images?.[0] && (
                    <View className="bg-gray-50 rounded-lg mr-3 overflow-hidden">
                      <Image
                        source={{ uri: item.product_id.images[0] }}
                        className="w-20 h-20"
                        resizeMode="contain"
                      />
                    </View>
                  )}

                  <View className="flex-1">
                    <Text className="font-semibold text-base mb-1">
                      {item.product_id.name}
                    </Text>

                    <Text
                      className="text-gray-600 text-sm mb-2"
                      numberOfLines={2}
                      ellipsizeMode="tail"
                    >
                      {item.product_id.description ?? "No description"}
                    </Text>

                    <Text className="text-sm text-gray-700 mb-1">
                      Color: {item.variant_id.color} | Size:{" "}
                      {item.variant_id.size}
                    </Text>

                    <Text className="text-sm text-gray-700">
                      Quantity: {item.quantity}
                    </Text>
                    {item.product_id.brand && (
                      <Text className="text-sm text-gray-700">
                        Brand: {item.product_id.brand}
                      </Text>
                    )}
                  </View>
                </View>

                <View className="mt-3 pt-3 border-t border-gray-200 flex-row justify-between">
                  <Text className="text-gray-600">Unit price</Text>
                  <Text className="font-bold text-base">
                    {(item.price ?? item.variant_id.price).toLocaleString()}đ
                  </Text>
                </View>
              </View>
            ))}
          </View>

          {/* Total - moved inside scrollview but not shown here as it's now in footer */}
        </View>
      </ScrollView>

      {/* Footer actions */}
      <View className="px-5 py-4 border-t border-gray-200 bg-white">
        <View className="flex-row items-center justify-between">
          {/* Total amount on the left */}
          <View>
            <Text className="text-sm text-gray-600 mb-1 font-semibold">Total amount</Text>
            <Text className="font-bold text-xl" style={{ color: "#496c60" }}>
              {order.total_amount.toLocaleString()}đ
            </Text>
          </View>

          {/* Buttons on the right */}
          <View className="flex-row gap-3">
            {/* Cancel Button */}
            {canCancel && (
              <TouchableOpacity
                onPress={handleCancel}
                disabled={loadingCancel}
                style={{
                  backgroundColor: "#ef4444",
                  opacity: loadingCancel ? 0.7 : 1,
                }}
                className="px-6 rounded-xl py-3 items-center"
              >
                {loadingCancel ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-white font-semibold">Hủy đơn</Text>
                )}
              </TouchableOpacity>
            )}

            {/* Reorder Button */}
            {canReorder && (
              <TouchableOpacity
                onPress={handleReorder}
                disabled={loadingReorder}
                style={{
                  backgroundColor: "#496c60",
                  opacity: loadingReorder ? 0.7 : 1,
                }}
                className="px-6 rounded-xl py-4 items-center"
              >
                {loadingReorder ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-white font-semibold">Mua lại</Text>
                )}
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>

      {/* Edit Address Modal */}
      {order && (
        <EditAddressModal
          visible={showEditAddressModal}
          onClose={() => setShowEditAddressModal(false)}
          currentAddress={order.shipping_address}
          onSave={handleUpdateAddress}
        />
      )}
    </View>
  );
}
