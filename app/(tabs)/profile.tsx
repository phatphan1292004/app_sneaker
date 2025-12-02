import { useAuth } from "@/contexts/AuthContext";
import { logoutUser } from "@/services/authService";
import { router } from "expo-router";
import React, { useEffect } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";

export default function ProfileScreen() {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/auth/login");
    }
  }, [user, loading]);

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        style: "cancel",
      },
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

  if (!user) {
    return null;
  }

  return (
    <View className="flex-1 bg-white p-5">
      <Text className="text-2xl font-bold mb-4">Profile</Text>
      <Text className="text-lg mb-2">
        Welcome, {user.displayName || "User"}!
      </Text>
      <Text className="text-gray-600 mb-6">{user.email}</Text>

      <TouchableOpacity
        onPress={handleLogout}
        className="rounded-xl py-4"
        style={{ backgroundColor: "#496c60" }}
      >
        <Text className="text-white text-center font-semibold">Logout</Text>
      </TouchableOpacity>
    </View>
  );
}
