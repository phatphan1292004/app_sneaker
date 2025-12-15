import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface AddressCardProps {
  type: string;
  street: string;
  ward: string;
  district: string;
  province: string;
  isDefault?: boolean;
}

export default function AddressCard({
  type,
  street,
  ward,
  district,
  province,
  isDefault,
}: AddressCardProps) {
  let iconName: keyof typeof Ionicons.glyphMap = "home-outline";
  if (type.toLowerCase() === "office") {
    iconName = "business-outline";
  } else if (type.toLowerCase() === "home") {
    iconName = "home-outline";
  } else {
    iconName = "location-outline";
  }
  return (
    <View className="mb-4 bg-gray-50 rounded-2xl p-4 relative">
      {/* Address Type Icon and Map Icon */}
      <View className="flex-row items-start justify-between mb-3">
        <View className="flex-row items-center">
          <View className="w-10 h-10 bg-white rounded-full items-center justify-center mr-1">
            <Ionicons name={iconName} size={20} color="#496c60" />
          </View>
          <View className="flex-1 flex-row items-center">
            <Text className="font-bold text-gray-900 text-base">{type}</Text>
            {isDefault && (
              <View className="ml-2 px-3 py-1 bg-green-100 rounded-lg">
                <Text className="text-green-700 text-xs font-semibold">
                  Mặc định
                </Text>
              </View>
            )}
          </View>
        </View>
        <TouchableOpacity className=" bg-white rounded-full items-center justify-center">
          <Ionicons name="close" size={25} className="text-red-500" />
        </TouchableOpacity>
      </View>

      {/* Address Details */}
      <View className="ml-13">
        <Text className="text-gray-900 text-sm mb-1">{street}</Text>
        <Text className="text-gray-500 text-sm">
          {ward}, {district}, {province}
        </Text>
      </View>
    </View>
  );
}
