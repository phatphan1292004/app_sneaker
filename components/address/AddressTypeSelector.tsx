import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface AddressTypeSelectorProps {
  selectedType: string;
  onSelectType: (type: string) => void;
}

export default function AddressTypeSelector({
  selectedType,
  onSelectType,
}: AddressTypeSelectorProps) {
  const addressTypes = ["Home", "Office", "Other"];

  return (
    <View>
      <Text className="text-base font-semibold text-gray-900 mb-3">
        Address Type
      </Text>
      <View className="flex-row mb-4">
        {addressTypes.map((type) => (
          <TouchableOpacity
            key={type}
            onPress={() => onSelectType(type)}
            className="px-4 py-2 mr-3 rounded-full border"
            style={{
              backgroundColor: selectedType === type ? "#d1e7dd" : "white",
              borderColor: selectedType === type ? "#496c60" : "#d1d5db",
            }}
          >
            <Text
              className="text-sm font-medium"
              style={{
                color: selectedType === type ? "#496c60" : "#6b7280",
              }}
            >
              {type}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
