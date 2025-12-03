import { useAuth } from "@/contexts/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import React, { useLayoutEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function EditProfileScreen() {
  interface User {
    displayName?: string;
    email?: string;
    phoneNumber?: string;
    birthDate?: string;
    gender?: string;
  }

  const { user } = useAuth() as { user: User | null; loading: boolean };

  const [displayName, setDisplayName] = useState(user?.displayName ?? "");
  const [email] = useState(user?.email ?? "");
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber ?? "");
  const [birthDate, setBirthDate] = useState(
    user && typeof user.birthDate === "string" ? user.birthDate : ""
  );
  const [gender, setGender] = useState(
    user && typeof user.gender === "string" ? user.gender : ""
  );

  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  const handleSave = () => {
    Alert.alert("Saved", "Profile changes saved.");
    navigation.goBack();
  };

  return (
    <View className="flex-1 bg-white">
      {/* Custom Header */}
      <View
        className="px-5 py-4 border-b border-gray-200 flex-row items-center"
        style={{ paddingTop: StatusBar.currentHeight || 20 }}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="w-10 h-10 items-center justify-center"
        >
          <Ionicons name="chevron-back" size={28} color="#000" />
        </TouchableOpacity>

        <Text className="text-xl font-bold text-gray-900 flex-1 text-center">
          Edit Profile
        </Text>

        <View className="w-10 h-10" />
      </View>

      {/* Content */}
      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: 40 }}>
        {/* Name */}
        <View className="mb-4">
          <Text className="text-sm font-semibold text-gray-900 mb-2">Full Name</Text>
          <View className="flex-row items-center bg-gray-50 rounded-xl px-4 py-3 border border-gray-200">
            <Ionicons name="person-outline" size={20} color="#496c60" />
            <TextInput
              value={displayName}
              onChangeText={setDisplayName}
              className="flex-1 ml-3 text-gray-900"
              placeholder="Enter your name"
              placeholderTextColor="#9CA3AF"
            />
          </View>
        </View>

        {/* Email */}
        <View className="mb-4">
          <Text className="text-sm font-semibold text-gray-900 mb-2">Email Address</Text>
          <View className="flex-row items-center bg-gray-100 rounded-xl px-4 py-3 border border-gray-200">
            <Ionicons name="mail-outline" size={20} color="#9CA3AF" />
            <TextInput
              value={email}
              editable={false}
              className="flex-1 ml-3 text-gray-500"
              placeholderTextColor="#9CA3AF"
            />
            <Ionicons name="lock-closed-outline" size={16} color="#9CA3AF" />
          </View>
        </View>

        {/* Phone Number */}
        <View className="mb-4">
          <Text className="text-sm font-semibold text-gray-900 mb-2">Phone Number</Text>
          <View className="flex-row items-center bg-gray-50 rounded-xl px-4 py-3 border border-gray-200">
            <Ionicons name="call-outline" size={20} color="#496c60" />
            <TextInput
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              className="flex-1 ml-3 text-gray-900"
              placeholder="Enter phone number"
              placeholderTextColor="#9CA3AF"
              keyboardType="phone-pad"
            />
          </View>
        </View>

        {/* Birth Date */}
        <View className="mb-4">
          <Text className="text-sm font-semibold text-gray-900 mb-2">Date of Birth</Text>
          <View className="flex-row items-center bg-gray-50 rounded-xl px-4 py-3 border border-gray-200">
            <Ionicons name="calendar-outline" size={20} color="#496c60" />
            <TextInput
              value={birthDate}
              onChangeText={setBirthDate}
              className="flex-1 ml-3 text-gray-900"
              placeholder="YYYY-MM-DD"
              placeholderTextColor="#9CA3AF"
            />
          </View>
        </View>

        {/* Gender */}
        <View className="mb-6">
          <Text className="text-sm font-semibold text-gray-900 mb-2">Gender</Text>
          <View className="flex-row items-center bg-gray-50 rounded-xl px-4 py-3 border border-gray-200">
            <Ionicons name="male-female-outline" size={20} color="#496c60" />
            <TextInput
              value={gender}
              onChangeText={setGender}
              className="flex-1 ml-3 text-gray-900"
              placeholder="Male / Female / Other"
              placeholderTextColor="#9CA3AF"
            />
          </View>
        </View>

        {/* Save Button */}
        <TouchableOpacity
          onPress={handleSave}
          className="rounded-2xl py-4 items-center shadow-sm"
          style={{ backgroundColor: "#496c60" }}
        >
          <Text className="text-white font-bold text-base">Save Changes</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
