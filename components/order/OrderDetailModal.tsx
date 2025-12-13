import { ApiOrder } from "@/services/orderService";
import React from "react";
import { Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";

interface OrderDetailModalProps {
  visible: boolean;
  order: ApiOrder | null;
  onClose: () => void;
}

const OrderDetailModal: React.FC<OrderDetailModalProps> = ({ visible, order, onClose }) => {
  if (!order) return null;
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
        <View className="bg-white rounded-2xl p-6 w-11/12 max-h-[80%]">
          <ScrollView>
            <Text className="text-lg font-bold mb-2">Order #{order._id.slice(-6)}</Text>
            <Text className="mb-1">Status: {order.status}</Text>
            <Text className="mb-1">Total: {order.total_amount.toLocaleString()}đ</Text>
            <Text className="mb-1">Payment: {order.payment_method}</Text>
            <Text className="mb-1">Address: {order.shipping_address.street}, {order.shipping_address.ward}, {order.shipping_address.district}, {order.shipping_address.province}</Text>
            <Text className="font-bold mt-2 mb-1">Items:</Text>
            {order.items.map(item => (
              <View key={item._id} className="mb-2">
                <Text>{item.product_id.name} - {item.variant_id.color} - Size {item.variant_id.size}</Text>
                <Text>Qty: {item.quantity} - Price: {item.price.toLocaleString()}đ</Text>
              </View>
            ))}
            <TouchableOpacity
              className="mt-4 bg-gray-800 rounded-xl py-2 items-center"
              onPress={onClose}
            >
              <Text className="text-white font-semibold">Đóng</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default OrderDetailModal;