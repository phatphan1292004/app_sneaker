import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

export default function HomeBanner() {
  return (
    <View className="mx-5 my-4 bg-yellow-100 rounded-2xl p-5 overflow-hidden">
      <View className="flex-row justify-between items-center">
        <View className="flex-1">
          <Text className="text-xs text-gray-600 mb-1">🔥 New</Text>
          <Text className="text-xl font-bold text-gray-900 mb-3">
            NEW SUMMER{"\n"}COLLECTION
          </Text>
          <TouchableOpacity
            className="rounded-full px-5 py-2 self-start flex-row items-center"
            style={{ backgroundColor: "#496c60" }}
          >
            <Ionicons name="play" size={16} color="#fff" />
            <Text className="text-white text-sm font-semibold ml-1">
              Shop Now
            </Text>
          </TouchableOpacity>
        </View>
        <Image
          source={{
            uri: "https://via.placeholder.com/120/FF6347/FFFFFF?text=Shoe",
          }}
          className="w-28 h-28"
          resizeMode="contain"
        />
      </View>
    </View>
  );
}
