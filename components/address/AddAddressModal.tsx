import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import AddressTypeSelector from "./AddressTypeSelector";
import LocationDropdown from "./LocationDropdown";

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

interface NewAddress {
  type: string;
  street: string;
  province: string;
  district: string;
  ward: string;
}

interface AddAddressModalProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (address: NewAddress) => void;
}

export default function AddAddressModal({
  visible,
  onClose,
  onAdd,
}: AddAddressModalProps) {
  const [newAddress, setNewAddress] = useState({
    type: "",
    street: "",
    provinceCode: 0,
    districtCode: 0,
    wardCode: 0,
  });

  // Location states
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  const [loading, setLoading] = useState(false);

  // Dropdown visibility
  const [showProvinceDropdown, setShowProvinceDropdown] = useState(false);
  const [showDistrictDropdown, setShowDistrictDropdown] = useState(false);
  const [showWardDropdown, setShowWardDropdown] = useState(false);

  // Fetch provinces on mount
  useEffect(() => {
    if (visible) {
      fetchProvinces();
    }
  }, [visible]);

  const fetchProvinces = async () => {
    try {
      setLoading(true);
      const response = await fetch("https://provinces.open-api.vn/api/p/");
      const data = await response.json();
      setProvinces(data);
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to load provinces",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchDistricts = async (provinceCode: number) => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`
      );
      const data = await response.json();
      setDistricts(data.districts);
      setWards([]);
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to load districts",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchWards = async (districtCode: number) => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://provinces.open-api.vn/api/d/${districtCode}?depth=2`
      );
      const data = await response.json();
      setWards(data.wards);
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to load wards",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSelectProvince = (province: Province) => {
    setNewAddress({
      ...newAddress,
      provinceCode: province.code,
      districtCode: 0,
      wardCode: 0,
    });
    fetchDistricts(province.code);
    setShowProvinceDropdown(false);
  };

  const handleSelectDistrict = (district: District) => {
    setNewAddress({ ...newAddress, districtCode: district.code, wardCode: 0 });
    fetchWards(district.code);
    setShowDistrictDropdown(false);
  };

  const handleSelectWard = (ward: Ward) => {
    setNewAddress({ ...newAddress, wardCode: ward.code });
    setShowWardDropdown(false);
  };

  const handleAddAddress = () => {
    if (
      !newAddress.type ||
      !newAddress.street ||
      !newAddress.provinceCode ||
      !newAddress.districtCode ||
      !newAddress.wardCode
    ) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Please fill in all fields",
      });
      return;
    }

    const selectedProvince = provinces.find(
      (p) => p.code === newAddress.provinceCode
    );
    const selectedDistrict = districts.find(
      (d) => d.code === newAddress.districtCode
    );
    const selectedWard = wards.find((w) => w.code === newAddress.wardCode);

    onAdd({
      type: newAddress.type,
      street: newAddress.street,
      province: selectedProvince?.name || "",
      district: selectedDistrict?.name || "",
      ward: selectedWard?.name || "",
    });

    // Reset form
    setNewAddress({
      type: "",
      street: "",
      provinceCode: 0,
      districtCode: 0,
      wardCode: 0,
    });
    setDistricts([]);
    setWards([]);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end bg-black/50">
        <View className="bg-white rounded-t-3xl" style={{ maxHeight: "80%" }}>
          {/* Modal Header */}
          <View className="px-5 py-4 border-b border-gray-200 flex-row items-center justify-between">
            <Text className="text-lg font-bold text-gray-900">
              Add New Address
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>

          {/* Modal Content */}
          <ScrollView className="px-5 py-4">
            {/* Address Type Selection */}
            <AddressTypeSelector
              selectedType={newAddress.type}
              onSelectType={(type) => setNewAddress({ ...newAddress, type })}
            />

            {/* Street Address */}
            <Text className="text-base font-semibold text-gray-900 mb-2">
              Street Address
            </Text>
            <TextInput
              placeholder="Enter street address"
              placeholderTextColor="#9ca3af"
              value={newAddress.street}
              onChangeText={(text) =>
                setNewAddress({ ...newAddress, street: text })
              }
              className="bg-gray-50 rounded-xl px-4 py-4 text-gray-900 mb-4"
            />

            {/* Province Dropdown */}
            <LocationDropdown
              label="Tỉnh/Thành phố"
              placeholder="Chọn Tỉnh/Thành phố"
              selectedCode={newAddress.provinceCode}
              selectedName={
                provinces.find((p) => p.code === newAddress.provinceCode)?.name
              }
              items={provinces}
              isOpen={showProvinceDropdown}
              onToggle={() => setShowProvinceDropdown(!showProvinceDropdown)}
              onSelect={handleSelectProvince}
              loading={loading}
            />

            {/* District Dropdown */}
            <LocationDropdown
              label="Quận/Huyện"
              placeholder="Chọn Quận/Huyện"
              selectedCode={newAddress.districtCode}
              selectedName={
                districts.find((d) => d.code === newAddress.districtCode)?.name
              }
              items={districts}
              isOpen={showDistrictDropdown}
              onToggle={() => setShowDistrictDropdown(!showDistrictDropdown)}
              onSelect={handleSelectDistrict}
              loading={loading}
              disabled={!newAddress.provinceCode}
            />

            {/* Ward Dropdown */}
            <LocationDropdown
              label="Phường/Xã"
              placeholder="Chọn Phường/Xã"
              selectedCode={newAddress.wardCode}
              selectedName={
                wards.find((w) => w.code === newAddress.wardCode)?.name
              }
              items={wards}
              isOpen={showWardDropdown}
              onToggle={() => setShowWardDropdown(!showWardDropdown)}
              onSelect={handleSelectWard}
              loading={loading}
              disabled={!newAddress.districtCode}
            />
          </ScrollView>

          {/* Modal Footer */}
          <View className="px-5 py-4 border-t border-gray-200">
            <TouchableOpacity
              onPress={handleAddAddress}
              className="py-4 rounded-full items-center"
              style={{ backgroundColor: "#496c60" }}
            >
              <Text className="text-white font-semibold text-base">
                Add Address
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
