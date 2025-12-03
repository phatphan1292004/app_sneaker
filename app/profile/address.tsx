import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function AddressScreen() {
  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="px-5 py-4 border-b border-gray-200 flex-row items-center">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center"
        >
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>

        <Text className="text-xl font-bold text-gray-900 flex-1 text-center">
          Address
        </Text>

        <View className="w-10 h-10" />
      </View>

      <ScrollView className="flex-1 px-5 py-4">
        <Text className="text-gray-600">Address management coming soon...</Text>
      </ScrollView>
    </View>
  );
}
