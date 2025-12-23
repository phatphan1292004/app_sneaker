import AddAddressModal from "@/components/address/AddAddressModal";
import AddressCard from "@/components/address/AddressCard";
import { useAuth } from "@/contexts/AuthContext";
import { Address, addressService } from "@/services/addressService";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

export default function AddressScreen() {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // 🔹 Lấy danh sách địa chỉ
  useEffect(() => {
    const fetchAddresses = async () => {
      if (!user?.uid) return;
      try {
        const response = await addressService.getAddressesByUserId(user.uid);
        if (response.success && response.data) {
          setAddresses(
            response.data.map((addr: Address) => ({
              ...addr,
              isDefault: addr.isDefault || false,
            }))
          );
        } else {
          setAddresses([]);
        }
      } catch (e) {
        setAddresses([]);
      }
    };
    fetchAddresses();
  }, [user?.uid]);

  // 🔹 Thêm địa chỉ mới
  const handleAddAddress = async (newAddress: {
    type: string;
    street: string;
    province: string;
    district: string;
    ward: string;
  }) => {
    if (!user?.uid) return;

    const address: Address = {
      user_id: user.uid,
      type: newAddress.type,
      street: newAddress.street,
      province: newAddress.province,
      district: newAddress.district,
      ward: newAddress.ward,
      isDefault: false,
    };

    try {
      const response = await addressService.addAddress(address);
      if (response.success) {
        setIsModalVisible(false);
        Toast.show({
          type: "success",
          text1: "Success",
          text2: "Address added successfully!",
        });
        const res = await addressService.getAddressesByUserId(user.uid);
        if (res.success && res.data) {
          setAddresses(
            res.data.map((addr: Address) => ({
              ...addr,
              isDefault: addr.isDefault || false,
            }))
          );
        }
      } else {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: response.message || response.error || "Failed to add address",
        });
      }
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error.message || "Failed to add address",
      });
    }
  };

  // 🔹 Xóa địa chỉ
  const handleDeleteAddress = (addressId: string) => {
    Alert.alert(
      "Xóa địa chỉ",
      "Bạn có chắc muốn xóa địa chỉ này?",
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Xóa",
          style: "destructive",
          onPress: async () => {
            try {
              const response = await addressService.deleteAddress(addressId);
              if (response.success) {
                Toast.show({
                  type: "success",
                  text1: "Deleted",
                  text2: "Address has been deleted",
                });
                setAddresses((prev) =>
                  prev.filter((addr) => addr._id !== addressId)
                );
              } else {
                Toast.show({
                  type: "error",
                  text1: "Error",
                  text2: response.message || "Failed to delete address",
                });
              }
            } catch (error: any) {
              Toast.show({
                type: "error",
                text1: "Error",
                text2: error.message || "Failed to delete address",
              });
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  // 🔹 Đặt mặc định
  const handleSetDefault = async (addressId: string) => {
    if (!user?.uid) return;
    try {
      const response = await addressService.setDefaultAddress(
        user.uid,
        addressId
      );
      if (response.success && response.data) {
        Toast.show({
          type: "success",
          text1: "Updated",
          text2: "Default address updated!",
        });
        setAddresses((prev) =>
          prev.map((addr: Address) => ({
            ...addr,
            isDefault: addr._id === addressId,
          }))
        );
      } else {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: response.message || "Failed to set default",
        });
      }
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error.message || "Failed to set default",
      });
    }
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
      </View>

      {/* Content */}
      <ScrollView className="flex-1 px-5 py-4">
        {addresses.map((address: Address) => (
          <AddressCard
            key={address._id}
            type={address.type}
            street={address.street}
            ward={address.ward}
            district={address.district}
            province={address.province}
            isDefault={address.isDefault}
            onDelete={() => handleDeleteAddress(address._id!)}
            onSetDefault={() => handleSetDefault(address._id!)} // ✅ thêm prop
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
