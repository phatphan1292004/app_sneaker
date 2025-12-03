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
    <View
      className="flex-1 bg-white"
      style={{ paddingTop: StatusBar.currentHeight || 20 }}
    >
      {/* Custom Header */}
      <View className="px-5 py-4 border-b border-gray-200 flex-row items-center">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center"
        >
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>

        <Text className="text-xl font-bold text-gray-900 flex-1 text-center">
          Edit Profile
        </Text>

        <View className="w-10 h-10" />
      </View>

      {/* Content */}
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        {/* Name */}
        <Text className="text-gray-700 mb-2">Name</Text>
        <TextInput
          value={displayName}
          onChangeText={setDisplayName}
          className="border border-gray-200 rounded-lg p-3 mb-4"
          placeholder="Your name"
        />

        {/* Birth Date */}
        <Text className="text-gray-700 mb-2">Birth Date</Text>
        <TextInput
          value={birthDate}
          onChangeText={setBirthDate}
          className="border border-gray-200 rounded-lg p-3 mb-4"
          placeholder="YYYY-MM-DD"
        />

        {/* Gender */}
        <Text className="text-gray-700 mb-2">Gender</Text>
        <TextInput
          value={gender}
          onChangeText={setGender}
          className="border border-gray-200 rounded-lg p-3 mb-4"
          placeholder="Male / Female / Other"
        />
        {/* Email */}
        <Text className="text-gray-700 mb-2">Email</Text>
        <TextInput
          value={email}
          editable={false}
          className="border border-gray-200 rounded-lg p-3 mb-4 bg-gray-100"
        />

        {/* Phone Number */}
        <Text className="text-gray-700 mb-2">Phone Number</Text>
        <TextInput
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          className="border border-gray-200 rounded-lg p-3 mb-4"
          placeholder="Phone Number"
          keyboardType="phone-pad"
        />

        <TouchableOpacity
          onPress={handleSave}
          className="bg-blue-500 rounded-lg py-2 px-6 items-center"
        >
          <Text className="text-white font-semibold">Save</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
