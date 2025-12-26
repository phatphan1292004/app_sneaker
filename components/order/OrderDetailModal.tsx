import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { CartItem as CartItemType, useCart } from "@/contexts/CartContext";
import { ApiOrder, orderService } from "@/services/orderService";

interface OrderDetailModalProps {
  visible: boolean;
  order: ApiOrder | null;
  onClose: () => void;

  // ✅ để OrdersHistoryScreen refresh lại list sau khi cancel
  onCancelled?: () => Promise<void> | void;
}

const OrderDetailModal: React.FC<OrderDetailModalProps> = ({
  visible,
  order,
  onClose,
  onCancelled,
}) => {
  // ✅ Hooks luôn gọi ở top-level (không gọi sau early return)
  const { replaceCart } = useCart() as any; // nếu TS báo, xem ghi chú phía dưới
  const [loadingCancel, setLoadingCancel] = useState(false);
  const [loadingReorder, setLoadingReorder] = useState(false);

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
      brand: it.product_id.brand || "",
    }));
  }, [order]);

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
              // refresh list ở màn history
              await onCancelled?.();
              onClose();
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

      // ✅ Theo tiêu chí: backend reorder chỉ optional, client tự fill cart
      // => không cần gọi API reorder (nhưng bạn có thể gọi để log nếu muốn)
      // await orderService.reorder(order._id);

      if (typeof replaceCart !== "function") {
        Alert.alert(
          "Thiếu hàm replaceCart",
          "CartContext của bạn chưa có replaceCart(items). Hãy thêm hàm này để Mua lại hoạt động."
        );
        return;
      }

      replaceCart(cartItemsFromOrder);
      onClose();
      router.push("/cart");
    } catch (e: any) {
      Alert.alert("Lỗi", e?.message || "Không thể mua lại.");
    } finally {
      setLoadingReorder(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black bg-opacity-50 justify-center items-center">
        <View className="bg-white rounded-2xl w-11/12 max-h-[85%] p-5">
          {/* ✅ Nếu order null: vẫn render modal UI bình thường, không early return */}
          {!order ? (
            <View className="py-10 items-center">
              <ActivityIndicator />
              <Text className="mt-3 text-gray-600">Loading...</Text>
              <TouchableOpacity onPress={onClose} className="mt-6">
                <Text style={{ color: "#496c60" }} className="font-semibold">
                  Đóng
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Header */}
              <View className="flex-row items-center justify-between border-b border-gray-200 pb-2 mb-2">
                <Text
                  className="text-xl font-bold"
                  style={{ color: "#496c60" }}
                >
                  Order #{order._id.slice(-6)}
                </Text>

                <TouchableOpacity onPress={onClose}>
                  <Ionicons name="close" size={26} color="#496c60" />
                </TouchableOpacity>
              </View>

              {/* Meta */}
              <View className="my-3">
                <Text>
                  <Text className="font-bold" style={{ color: "#496c60" }}>
                    Status:{" "}
                  </Text>
                  <Text className="font-semibold">{order.status}</Text>
                </Text>

                <Text>
                  <Text className="font-bold" style={{ color: "#496c60" }}>
                    Payment Method:{" "}
                  </Text>
                  <Text>{order.payment_method?.toUpperCase()}</Text>
                </Text>

                <Text>
                  <Text className="font-bold" style={{ color: "#496c60" }}>
                    Created at:{" "}
                  </Text>
                  <Text>
                    {new Date(order.createdAt).toLocaleString("vi-VN")}
                  </Text>
                </Text>
              </View>

              {/* Address */}
              <View className="mb-4">
                <Text className="font-bold mb-1" style={{ color: "#496c60" }}>
                  Shipping Address
                </Text>
                <Text>
                  {order.shipping_address.street}, {order.shipping_address.ward}
                  , {order.shipping_address.district},{" "}
                  {order.shipping_address.province},{" "}
                  {order.shipping_address.country}
                </Text>
              </View>

              {/* Items */}
              <Text className="font-bold mb-2" style={{ color: "#496c60" }}>
                Items
              </Text>

              {order.items.map((item) => (
                <View
                  key={item._id}
                  className="border border-gray-200 rounded-xl p-3 mb-3"
                >
                  <View className="flex-row">
                    {!!item.product_id.images?.[0] && (
                      <Image
                        source={{ uri: item.product_id.images[0] }}
                        className="w-20 h-20 rounded-lg mr-3"
                        resizeMode="cover"
                      />
                    )}

                    <View className="flex-1">
                      <Text className="font-semibold">
                        {item.product_id.name}
                      </Text>

                      <Text
                        className="text-gray-600 text-sm mb-1"
                        numberOfLines={2}
                        ellipsizeMode="tail"
                      >
                        {item.product_id.description ?? "No description"}
                      </Text>

                      <Text>
                        Color: {item.variant_id.color} | Size:{" "}
                        {item.variant_id.size}
                      </Text>

                      <Text>Quantity: {item.quantity}</Text>
                      <Text>Brand: {item.product_id.brand}</Text>
                    </View>
                  </View>

                  <View className="mt-2 flex-row justify-between">
                    <Text className="text-gray-600">Unit price</Text>
                    <Text className="font-semibold">
                      {(item.price ?? item.variant_id.price).toLocaleString()}đ
                    </Text>
                  </View>
                </View>
              ))}

              {/* Total */}
              <View className="border-t border-gray-200 pt-3 mt-2">
                <View className="flex-row justify-between mb-1">
                  <Text>Total amount</Text>
                  <Text className="font-bold text-lg">
                    {order.total_amount.toLocaleString()}đ
                  </Text>
                </View>
              </View>

              {/* Footer actions */}
              <View className="mt-4 flex-row space-x-3">
                {/* Close */}
                <TouchableOpacity
                  onPress={onClose}
                  className="flex-1 border rounded-xl py-3 items-center"
                  style={{ borderColor: "#496c60" }}
                >
                  <Text className="font-semibold" style={{ color: "#496c60" }}>
                    Đóng
                  </Text>
                </TouchableOpacity>

                {/* ✅ Pending => Cancel */}
                {canCancel && (
                  <TouchableOpacity
                    onPress={handleCancel}
                    disabled={loadingCancel}
                    style={{
                      backgroundColor: "#496c60",
                      opacity: loadingCancel ? 0.7 : 1,
                    }}
                    className="flex-1 rounded-xl py-3 items-center"
                  >
                    {loadingCancel ? (
                      <ActivityIndicator />
                    ) : (
                      <Text className="text-white font-semibold">Hủy đơn</Text>
                    )}
                  </TouchableOpacity>
                )}

                {/* ✅ Paid/Cancelled => Reorder */}
                {canReorder && (
                  <TouchableOpacity
                    onPress={handleReorder}
                    disabled={loadingReorder}
                    style={{
                      backgroundColor: "#496c60",
                      opacity: loadingReorder ? 0.7 : 1,
                    }}
                    className="flex-1 rounded-xl py-3 items-center"
                  >
                    {loadingReorder ? (
                      <ActivityIndicator />
                    ) : (
                      <Text className="text-white font-semibold">Mua lại</Text>
                    )}
                  </TouchableOpacity>
                )}
              </View>
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
  );
};

export default OrderDetailModal;
