import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

interface Province {
  code: number;
  name: string;
}

interface District {
  code: number;
  name: string;
}

interface Ward {
  code: number;
  name: string;
}

interface ShippingAddress {
  street: string;
  ward: string;
  district: string;
  province: string;
  country: string;
}

interface EditAddressModalProps {
  visible: boolean;
  onClose: () => void;
  currentAddress: ShippingAddress | null;
  onSave: (address: {
    street: string;
    province: string;
    district: string;
    ward: string;
  }) => void;
}

export default function EditAddressModal({
  visible,
  onClose,
  currentAddress,
  onSave,
}: EditAddressModalProps) {
  const [street, setStreet] = useState("");
  const [provinceCode, setProvinceCode] = useState(0);
  const [districtCode, setDistrictCode] = useState(0);
  const [wardCode, setWardCode] = useState(0);

  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  const [loading, setLoading] = useState(false);

  const [showProvinceDropdown, setShowProvinceDropdown] = useState(false);
  const [showDistrictDropdown, setShowDistrictDropdown] = useState(false);
  const [showWardDropdown, setShowWardDropdown] = useState(false);

  useEffect(() => {
    if (visible && currentAddress) {
      setStreet(currentAddress.street);
      fetchProvinces();
    }
  }, [visible, currentAddress]);

  const fetchProvinces = async () => {
    try {
      setLoading(true);
      const response = await fetch("https://provinces.open-api.vn/api/p/");
      const data = await response.json();
      setProvinces(data);
    } catch {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to load provinces",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchDistricts = async (pCode: number) => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://provinces.open-api.vn/api/p/${pCode}?depth=2`
      );
      const data = await response.json();
      setDistricts(data.districts);
      setWards([]);
    } catch {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to load districts",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchWards = async (dCode: number) => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://provinces.open-api.vn/api/d/${dCode}?depth=2`
      );
      const data = await response.json();
      setWards(data.wards);
    } catch {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to load wards",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleProvinceSelect = (province: Province) => {
    setProvinceCode(province.code);
    setDistrictCode(0);
    setWardCode(0);
    setDistricts([]);
    setWards([]);
    setShowProvinceDropdown(false);
    fetchDistricts(province.code);
  };

  const handleDistrictSelect = (district: District) => {
    setDistrictCode(district.code);
    setWardCode(0);
    setWards([]);
    setShowDistrictDropdown(false);
    fetchWards(district.code);
  };

  const handleWardSelect = (ward: Ward) => {
    setWardCode(ward.code);
    setShowWardDropdown(false);
  };

  const handleSave = () => {
    if (!street.trim()) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Please enter street address",
      });
      return;
    }

    if (!provinceCode || !districtCode || !wardCode) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Please select province, district and ward",
      });
      return;
    }

    const selectedProvince = provinces.find((p) => p.code === provinceCode);
    const selectedDistrict = districts.find((d) => d.code === districtCode);
    const selectedWard = wards.find((w) => w.code === wardCode);

    if (!selectedProvince || !selectedDistrict || !selectedWard) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Invalid location selection",
      });
      return;
    }

    onSave({
      street: street.trim(),
      province: selectedProvince.name,
      district: selectedDistrict.name,
      ward: selectedWard.name,
    });

    handleClose();
  };

  const handleClose = () => {
    setStreet("");
    setProvinceCode(0);
    setDistrictCode(0);
    setWardCode(0);
    setDistricts([]);
    setWards([]);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={handleClose}
    >
      <TouchableOpacity
        activeOpacity={1}
        onPress={handleClose}
        className="flex-1 bg-black/50 justify-end"
      >
        <TouchableOpacity
          activeOpacity={1}
          className="bg-white rounded-t-3xl max-h-[90%]"
          onPress={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <View className="px-5 pt-5 pb-3 border-b border-gray-200 flex-row items-center justify-between">
            <Text className="text-xl font-bold">Edit Shipping Address</Text>
            <TouchableOpacity onPress={handleClose}>
              <Ionicons name="close" size={24} color="#000" />
            </TouchableOpacity>
          </View>

          <ScrollView
            className="px-5 py-4"
            showsVerticalScrollIndicator={false}
          >
            {/* Street */}
            <View className="mb-4">
              <Text className="text-sm font-semibold text-gray-700 mb-2">
                Street Address
              </Text>
              <TextInput
                value={street}
                onChangeText={setStreet}
                placeholder="Enter street address"
                className="border border-gray-300 rounded-xl px-4 py-3 text-gray-900"
              />
            </View>

            {/* Province */}
            <View className="mb-4">
              <Text className="text-sm font-semibold text-gray-700 mb-2">
                Province/City
              </Text>
              <TouchableOpacity
                onPress={() => setShowProvinceDropdown(!showProvinceDropdown)}
                className="border border-gray-300 rounded-xl px-4 py-3 flex-row items-center justify-between"
              >
                <Text
                  className={provinceCode ? "text-gray-900" : "text-gray-400"}
                >
                  {provinceCode
                    ? provinces.find((p) => p.code === provinceCode)?.name
                    : "Select Province/City"}
                </Text>
                <Ionicons
                  name={showProvinceDropdown ? "chevron-up" : "chevron-down"}
                  size={20}
                  color="#9CA3AF"
                />
              </TouchableOpacity>

              {showProvinceDropdown && (
                <View className="mt-2 max-h-60 border border-gray-200 rounded-xl bg-white">
                  {loading ? (
                    <View className="py-4 items-center">
                      <ActivityIndicator color="#496c60" />
                    </View>
                  ) : (
                    <ScrollView showsVerticalScrollIndicator={false}>
                      {provinces.map((province) => (
                        <TouchableOpacity
                          key={province.code}
                          onPress={() => handleProvinceSelect(province)}
                          className="px-4 py-3 border-b border-gray-100"
                        >
                          <Text className="text-gray-900">{province.name}</Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  )}
                </View>
              )}
            </View>

            {/* District */}
            <View className="mb-4">
              <Text className="text-sm font-semibold text-gray-700 mb-2">
                District
              </Text>
              <TouchableOpacity
                onPress={() => {
                  if (districts.length > 0) {
                    setShowDistrictDropdown(!showDistrictDropdown);
                  }
                }}
                className="border border-gray-300 rounded-xl px-4 py-3 flex-row items-center justify-between"
                disabled={districts.length === 0}
              >
                <Text
                  className={
                    districtCode
                      ? "text-gray-900"
                      : districts.length === 0
                      ? "text-gray-300"
                      : "text-gray-400"
                  }
                >
                  {districtCode
                    ? districts.find((d) => d.code === districtCode)?.name
                    : "Select District"}
                </Text>
                <Ionicons
                  name={showDistrictDropdown ? "chevron-up" : "chevron-down"}
                  size={20}
                  color={districts.length === 0 ? "#D1D5DB" : "#9CA3AF"}
                />
              </TouchableOpacity>

              {showDistrictDropdown && (
                <View className="mt-2 max-h-60 border border-gray-200 rounded-xl bg-white">
                  {loading ? (
                    <View className="py-4 items-center">
                      <ActivityIndicator color="#496c60" />
                    </View>
                  ) : (
                    <ScrollView showsVerticalScrollIndicator={false}>
                      {districts.map((district) => (
                        <TouchableOpacity
                          key={district.code}
                          onPress={() => handleDistrictSelect(district)}
                          className="px-4 py-3 border-b border-gray-100"
                        >
                          <Text className="text-gray-900">{district.name}</Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  )}
                </View>
              )}
            </View>

            {/* Ward */}
            <View className="mb-4">
              <Text className="text-sm font-semibold text-gray-700 mb-2">
                Ward/Commune
              </Text>
              <TouchableOpacity
                onPress={() => {
                  if (wards.length > 0) {
                    setShowWardDropdown(!showWardDropdown);
                  }
                }}
                className="border border-gray-300 rounded-xl px-4 py-3 flex-row items-center justify-between"
                disabled={wards.length === 0}
              >
                <Text
                  className={
                    wardCode
                      ? "text-gray-900"
                      : wards.length === 0
                      ? "text-gray-300"
                      : "text-gray-400"
                  }
                >
                  {wardCode
                    ? wards.find((w) => w.code === wardCode)?.name
                    : "Select Ward/Commune"}
                </Text>
                <Ionicons
                  name={showWardDropdown ? "chevron-up" : "chevron-down"}
                  size={20}
                  color={wards.length === 0 ? "#D1D5DB" : "#9CA3AF"}
                />
              </TouchableOpacity>

              {showWardDropdown && (
                <View className="mt-2 max-h-60 border border-gray-200 rounded-xl bg-white">
                  {loading ? (
                    <View className="py-4 items-center">
                      <ActivityIndicator color="#496c60" />
                    </View>
                  ) : (
                    <ScrollView showsVerticalScrollIndicator={false}>
                      {wards.map((ward) => (
                        <TouchableOpacity
                          key={ward.code}
                          onPress={() => handleWardSelect(ward)}
                          className="px-4 py-3 border-b border-gray-100"
                        >
                          <Text className="text-gray-900">{ward.name}</Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  )}
                </View>
              )}
            </View>

            {/* Buttons */}
            <View className="flex-row gap-3 mt-4 mb-4">
              <TouchableOpacity
                onPress={handleClose}
                className="flex-1 border rounded-xl py-3 items-center"
                style={{ borderColor: "#496c60" }}
              >
                <Text className="font-semibold" style={{ color: "#496c60" }}>
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleSave}
                className="flex-1 rounded-xl py-3 items-center"
                style={{ backgroundColor: "#496c60" }}
              >
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-white font-semibold">
                    Save Changes
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </ScrollView>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}
