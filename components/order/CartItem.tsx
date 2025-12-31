import { CartItem as CartItemType } from "@/contexts/CartContext";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

interface CartItemProps {
  item: CartItemType;
  updateQuantity: (variantId: string, quantity: number) => void;
  removeItem: (variantId: string) => void;
}

const CartItem: React.FC<CartItemProps> = ({
  item,
  updateQuantity,
  removeItem,
}) => {
  return (
    <View className="mb-4 bg-gray-50 rounded-2xl p-4 flex-row items-center relative">
      {/* Delete Button - Top Right */}
      <TouchableOpacity
        onPress={() => removeItem(item.variantId)}
        className="absolute top-3 right-3 z-10"
      >
        <Ionicons name="close" size={22} color="#EF4444" />
      </TouchableOpacity>

      {/* Product Image */}
      <View className="rounded-xl mr-4 overflow-hidden bg-white">
        <Image
          source={{ uri: item.image }}
          className="w-24 h-24"
          resizeMode="contain"
        />
      </View>

      {/* Product Info */}
      <View className="flex-1 pr-8">
        <Text className="font-bold text-gray-900 text-base mb-2">
          {item.name}
        </Text>
        <Text className="text-gray-500 text-xs mb-2">{item.brand}</Text>
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
              onPress={() => updateQuantity(item.variantId, item.quantity - 1)}
              className="w-8 h-8 bg-gray-200 rounded items-center justify-center"
            >
              <Text className="text-gray-900 text-lg font-bold">−</Text>
            </TouchableOpacity>

            <View className="mx-2 min-w-[30px] items-center">
              <Text className="text-gray-900 font-semibold">
                {item.quantity}
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => updateQuantity(item.variantId, item.quantity + 1)}
              className="w-8 h-8 rounded items-center justify-center"
              style={{ backgroundColor: "#496c60" }}
            >
              <Text className="text-white text-lg font-bold">+</Text>
            </TouchableOpacity>
          </View>

          {/* Price */}
          <Text className="font-bold text-gray-900 text-sm -mr-8">
            {item.price.toLocaleString()} đ
          </Text>
        </View>
      </View>
    </View>
  );
};

export default CartItem;
