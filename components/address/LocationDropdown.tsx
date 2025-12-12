import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface LocationItem {
  code: number;
  name: string;
}

interface LocationDropdownProps {
  label: string;
  placeholder: string;
  selectedCode: number;
  selectedName?: string;
  items: LocationItem[];
  isOpen: boolean;
  onToggle: () => void;
  onSelect: (item: LocationItem) => void;
  loading?: boolean;
  disabled?: boolean;
}

export default function LocationDropdown({
  label,
  placeholder,
  selectedCode,
  selectedName,
  items,
  isOpen,
  onToggle,
  onSelect,
  loading = false,
  disabled = false,
}: LocationDropdownProps) {
  return (
    <View>
      <Text className="text-base font-semibold text-gray-900 mb-2">
        {label}
      </Text>
      <TouchableOpacity
        onPress={onToggle}
        className="bg-gray-50 rounded-xl px-4 py-4 mb-2 flex-row justify-between items-center"
        disabled={disabled}
        style={{ opacity: disabled ? 0.5 : 1 }}
      >
        <Text className={selectedCode ? "text-gray-900" : "text-gray-400"}>
          {selectedName || placeholder}
        </Text>
        <Ionicons
          name={isOpen ? "chevron-up" : "chevron-down"}
          size={20}
          color="#6b7280"
        />
      </TouchableOpacity>
      {isOpen && (
        <ScrollView
          className="bg-white border border-gray-200 rounded-xl mb-4"
          style={{ maxHeight: 200 }}
        >
          {loading ? (
            <ActivityIndicator className="py-4" color="#496c60" />
          ) : (
            items.map((item) => (
              <TouchableOpacity
                key={item.code}
                onPress={() => onSelect(item)}
                className="px-4 py-3 border-b border-gray-100"
              >
                <Text className="text-gray-900">{item.name}</Text>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      )}
    </View>
  );
}
