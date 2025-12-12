import AddAddressModal from "@/components/address/AddAddressModal";
import AddressCard from "@/components/address/AddressCard";
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
import Toast from "react-native-toast-message";

interface Address {
  id: string;
  type: string;
  street: string;
  province: string;
  district: string;
  ward: string;
  isDefault: boolean;
}

export default function AddressScreen() {
  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: "1",
      type: "Home",
      street: "2118 Thornridge Cir",
      province: "TP. Hồ Chí Minh",
      district: "Quận 1",
      ward: "Phường Bến Nghé",
      isDefault: false,
    },
    {
      id: "2",
      type: "Office",
      street: "456 Maplewood Lane",
      province: "Hà Nội",
      district: "Quận Ba Đình",
      ward: "Phường Điện Biên",
      isDefault: false,
    },
  ]);

  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleAddAddress = (newAddress: {
    type: string;
    street: string;
    province: string;
    district: string;
    ward: string;
  }) => {
    const address: Address = {
      id: Date.now().toString(),
      type: newAddress.type,
      street: newAddress.street,
      province: newAddress.province,
      district: newAddress.district,
      ward: newAddress.ward,
      isDefault: false,
    };

    setAddresses([...addresses, address]);
    setIsModalVisible(false);
    Toast.show({
      type: "success",
      text1: "Success",
      text2: "Address added successfully!",
    });
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
          <AddressCard
            key={address.id}
            type={address.type}
            street={address.street}
            ward={address.ward}
            district={address.district}
            province={address.province}
          />
        ))}

        {/* Add New Address Button */}
        <TouchableOpacity 
          onPress={() => setIsModalVisible(true)}
          className="flex-row items-center justify-center py-4 border border-dashed border-gray-300 rounded-2xl mt-2"
        >
          <Ionicons name="add-circle-outline" size={24} color="#496c60" />
          <Text
            className="ml-2 font-semibold text-base"
            style={{ color: "#496c60" }}
          >
            Add New Address
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Add Address Modal */}
      <AddAddressModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onAdd={handleAddAddress}
      />
    </View>
  );
}
