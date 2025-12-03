import { useAuth } from "@/contexts/AuthContext";
import { logoutUser } from "@/services/authService";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function ProfileScreen() {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/auth/login");
    }
  }, [user, loading]);

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        onPress: async () => {
          try {
            await logoutUser();
            router.replace("/auth/login");
          } catch (error: any) {
            Alert.alert("Error", error.message);
          }
        },
        style: "destructive",
      },
    ]);
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!user) return null;

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View
        className="px-5 py-4 border-b border-gray-200 flex-row items-center"
        style={{ paddingTop: StatusBar.currentHeight || 20 }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center"
        >
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>

        <Text className="text-xl font-bold text-gray-900 flex-1 text-center">
          Profile
        </Text>

        <View className="w-10 h-10" />
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: 150, paddingTop: 20 }}
      >
        {/* Avatar và thông tin cơ bản */}
        <View className="items-center mb-6">
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1503264116251-35a269479413?auto=format&fit=crop&w=100&q=80",
            }}
            className="w-24 h-24 rounded-full mb-3 border-2 border-gray-200"
          />

          <Text className="text-xl font-bold">
            {user.displayName || "User"}
          </Text>
          <Text className="text-gray-500">{user.email}</Text>
        </View>

        {/* Edit Profile */}
        <TouchableOpacity
          className="bg-gray-100 p-4 rounded-lg mb-3 flex-row items-center mx-5"
          onPress={() => router.push("/profile/edit")}
        >
          <Ionicons
            name="create-outline"
            size={24}
            color="#000"
            className="mr-3"
          />
          <Text className="text-gray-900 font-medium">Edit Profile</Text>
        </TouchableOpacity>

        {/* Address */}
        <TouchableOpacity
          className="bg-gray-100 p-4 rounded-lg mb-3 flex-row items-center mx-5"
          onPress={() => router.push("/profile/address")}
        >
          <Ionicons
            name="location-outline"
            size={24}
            color="#000"
            className="mr-3"
          />
          <Text className="text-gray-900 font-medium">Address</Text>
        </TouchableOpacity>

        {/* Notifications */}
        <TouchableOpacity
          className="bg-gray-100 p-4 rounded-lg mb-3 flex-row items-center mx-5"
          onPress={() => router.push("/profile/notifications")}
        >
          <Ionicons
            name="notifications-outline"
            size={24}
            color="#000"
            className="mr-3"
          />
          <Text className="text-gray-900 font-medium">Notifications</Text>
        </TouchableOpacity>

        {/* Order History */}
        <TouchableOpacity
          className="bg-gray-100 p-4 rounded-lg mb-3 flex-row items-center mx-5"
          onPress={() => router.push("/profile/ordersHistory")}
        >
          <Ionicons
            name="receipt-outline"
            size={24}
            color="#000"
            className="mr-3"
          />
          <Text className="text-gray-900 font-medium">Order History</Text>
        </TouchableOpacity>

        {/* Contact Support */}
        <TouchableOpacity
          className="bg-gray-100 p-4 rounded-lg mb-3 flex-row items-center mx-5"
          onPress={() => router.push("/profile/support")}
        >
          <Ionicons
            name="help-circle-outline"
            size={24}
            color="#000"
            className="mr-3"
          />
          <Text className="text-gray-900 font-medium">Contact Support</Text>
        </TouchableOpacity>

        {/* Logout */}
        <TouchableOpacity
          className="bg-gray-100 p-4 rounded-lg mb-3 flex-row items-center mx-5"
          onPress={handleLogout}
        >
          <Ionicons
            name="log-out-outline"
            size={24}
            color="#000"
            className="mr-3"
          />
          <Text className="text-gray-900 font-medium">Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
