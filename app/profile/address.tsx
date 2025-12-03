import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface Address {
  id: string;
  type: string;
  addressLine1: string;
  addressLine2: string;
  isDefault: boolean;
}

export default function AddressScreen() {
  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: "1",
      type: "Home",
      addressLine1: "2118 Thornridge Cir",
      addressLine2: "Connecticut, San Jose, CA",
      isDefault: false,
    },
    {
      id: "2",
      type: "Office",
      addressLine1: "456 Maplewood Lane",
      addressLine2: "New Haven, San Francisco, CA",
      isDefault: false,
    },
  ]);

  const handleEdit = (id: string) => {
    console.log("Edit address:", id);
  };

  const handleDelete = (id: string) => {
    setAddresses(addresses.filter((addr) => addr.id !== id));
  };

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View
        className="px-5 py-4 border-b border-gray-200 flex-row items-center justify-between"
        style={{ paddingTop: StatusBar.currentHeight || 20 }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 items-center justify-center"
        >
          <Ionicons name="chevron-back" size={28} color="#000" />
        </TouchableOpacity>

        <Text className="text-xl font-bold text-gray-900 flex-1 text-center">
          Shipping Address
        </Text>

        <TouchableOpacity>
          <Text className="text-sm font-semibold" style={{ color: "#496c60" }}>
            Edit
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 px-5 py-4">
        {/* Address Cards */}
        {addresses.map((address) => (
          <View
            key={address.id}
            className="mb-4 bg-gray-50 rounded-2xl p-4 relative"
          >
            {/* Address Type Icon and Map Icon */}
            <View className="flex-row items-start justify-between mb-3">
              <View className="flex-row items-center">
                <View className="w-10 h-10 bg-white rounded-full items-center justify-center mr-3">
                  <Ionicons name="home-outline" size={20} color="#496c60" />
                </View>
                <View className="flex-1">
                  <Text className="font-bold text-gray-900 text-base">
                    {address.type}
                  </Text>
                </View>
              </View>
              <TouchableOpacity className="w-10 h-10 bg-white rounded-full items-center justify-center">
                <Ionicons name="location-outline" size={20} color="#496c60" />
              </TouchableOpacity>
            </View>

            {/* Address Details */}
            <View className="ml-13">
              <Text className="text-gray-900 text-sm mb-1">
                {address.addressLine1}
              </Text>
              <Text className="text-gray-500 text-sm">
                {address.addressLine2}
              </Text>
            </View>
          </View>
        ))}

        {/* Add New Address Button */}
        <TouchableOpacity className="flex-row items-center justify-center py-4 border border-dashed border-gray-300 rounded-2xl mt-2">
          <Ionicons name="add-circle-outline" size={24} color="#496c60" />
          <Text
            className="ml-2 font-semibold text-base"
            style={{ color: "#496c60" }}
          >
            Add New Address
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
