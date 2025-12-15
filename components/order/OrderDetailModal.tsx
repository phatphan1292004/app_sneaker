import { ApiOrder } from "@/services/orderService";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Image,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface OrderDetailModalProps {
  visible: boolean;
  order: ApiOrder | null;
  onClose: () => void;
}

const OrderDetailModal: React.FC<OrderDetailModalProps> = ({
  visible,
  order,
  onClose,
}) => {
  if (!order) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black bg-opacity-50 justify-center items-center">
        <View className="bg-white rounded-2xl w-11/12 max-h-[85%] p-5">
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Header */}
            <View className="flex-row items-center justify-between border-b border-gray-200 pb-2 mb-2">
              <Text className="text-xl font-bold" style={{ color: "#496c60" }}>
                Order #{order._id.slice(-6)}
              </Text>

              <TouchableOpacity onPress={onClose}>
                <Ionicons name="close" size={26} color="#496c60" />
              </TouchableOpacity>
            </View>

            <View className="my-3">
              <Text>
                <Text className="font-bold mb-1" style={{ color: "#496c60" }}>
                  Status:{" "}
                </Text>
                <Text className="font-semibold">{order.status}</Text>
              </Text>
              <Text>
                <Text className="font-bold mb-1" style={{ color: "#496c60" }}>
                  Payment Method:{" "}
                </Text>
                {order.payment_method.toUpperCase()}
              </Text>
              <Text>
                <Text className="font-bold mb-1" style={{ color: "#496c60" }}>
                  Created at:{" "}
                </Text>
                {new Date(order.createdAt).toLocaleString("vi-VN")}
              </Text>
            </View>

            {/* Address */}
            <View className="mb-4">
              <Text className="font-bold mb-1" style={{ color: "#496c60" }}>
                Shipping Address
              </Text>
              <Text>
                {order.shipping_address.street}, {order.shipping_address.ward},{" "}
                {order.shipping_address.district},{" "}
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
                {/* Product info */}
                <View className="flex-row">
                  {item.product_id.images?.[0] && (
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
                      {item.product_id.description}
                    </Text>

                    <Text>
                      Color: {item.variant_id.color} | Size:{" "}
                      {item.variant_id.size}
                    </Text>

                    <Text>Quantity: {item.quantity}</Text>
                  </View>
                </View>

                {/* Price */}
                <View className="mt-2 flex-row justify-between">
                  <Text className="text-gray-600">Unit price</Text>
                  <Text className="font-semibold">
                    {item.price.toLocaleString()}đ
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

            {/* Footer */}
            <View className="mt-4 flex-row space-x-3">
              {/* Edit */}
              <TouchableOpacity
                onPress={() => {
                  // TODO: xử lý chỉnh sửa order / address / payment
                  onClose();
                }}
                className="flex-1 border rounded-xl py-3 items-center"
                style={{ borderColor: "#496c60" }}
              >
                <Text className="font-semibold" style={{ color: "#496c60" }}>
                  Chỉnh sửa
                </Text>
              </TouchableOpacity>

              {/* Cancel Order */}
              {order.status === "pending" && (
                <TouchableOpacity
                  style={{ backgroundColor: "#496c60" }}
                  className="flex-1 rounded-xl py-3 items-center"
                >
                  <Text className="text-white font-semibold">Hủy đơn hàng</Text>
                </TouchableOpacity>
              )}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default OrderDetailModal;
