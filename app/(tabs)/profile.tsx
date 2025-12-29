import { useAuth } from "@/contexts/AuthContext";
import { logoutUser } from "@/services/authService";
import { uploadToCloudinary } from "@/services/cloudinary";
import { notificationService } from "@/services/notificationService";
import { Profile, profileService } from "@/services/profileService";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";

import {
  ActivityIndicator,
  Image,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

export default function ProfileScreen() {
  const { user, loading } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  const [profile, setProfile] = useState<Profile | null>(null);
  const [fetchingProfile, setFetchingProfile] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  // firebaseUid từ auth
  const firebaseUid = useMemo(
    () => (user as any)?.uid || (user as any)?.firebaseUid,
    [user]
  );
  const fetchUnreadCount = useCallback(async () => {
    if (!firebaseUid) return;
    try {
      const res = await notificationService.unreadCount(firebaseUid);
      setUnreadCount(res.data?.count || 0);
    } catch (e) {
      console.log("fetch unread error", e);
    }
  }, [firebaseUid]);

  useFocusEffect(
    useCallback(() => {
      fetchUnreadCount();
    }, [fetchUnreadCount])
  );

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/auth/login");
    }
  }, [user, loading]);

  useEffect(() => {
    const loadProfile = async () => {
      if (!firebaseUid) return;
      try {
        setFetchingProfile(true);
        const res = await profileService.getByFirebaseUid(firebaseUid);
        // backend bạn return: { success: true, data: user }
        if (res?.success) setProfile(res.data);
        else throw new Error(res?.message || "Load profile failed");
      } catch (e: any) {
        Toast.show({ type: "error", text1: "Error", text2: e.message });
      } finally {
        setFetchingProfile(false);
      }
    };

    if (!loading && user) loadProfile();
  }, [firebaseUid, loading, user]);

  const handleLogout = async () => {
    try {
      await logoutUser();
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Logged out successfully!",
      });
      router.replace("/");
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error.message,
      });
    }
  };

  const pickAndUploadAvatar = async () => {
    if (!profile?._id) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Profile not loaded",
      });
      return;
    }

    try {
      const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!perm.granted) {
        Toast.show({
          type: "error",
          text1: "Permission",
          text2: "Please allow photo access to change avatar.",
        });
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (result.canceled) return;

      const localUri = result.assets[0]?.uri;
      if (!localUri) return;

      setUploadingAvatar(true);

      // 1) upload cloudinary -> lấy url
      const url = await uploadToCloudinary(localUri);

      // 2) update mongo
      const updateRes = await profileService.updateAvatar(profile._id, url);
      if (!updateRes?.success)
        throw new Error(updateRes?.message || "Update avatar failed");

      // 3) update UI
      setProfile(updateRes.data);

      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Avatar updated!",
      });
    } catch (e: any) {
      Toast.show({ type: "error", text1: "Error", text2: e.message });
    } finally {
      setUploadingAvatar(false);
    }
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
    <View className="flex-1 bg-gray-100">
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
        {/* Avatar + info */}
        <View className="items-center mb-6">
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={pickAndUploadAvatar}
            className="relative"
          >
            <Image
              source={{
                uri:
                  profile?.avatar ||
                  "https://images.unsplash.com/photo-1503264116251-35a269479413?auto=format&fit=crop&w=100&q=80",
              }}
              className="w-24 h-24 rounded-full mb-3 border-2 border-gray-200"
            />

            {/* Loading overlay khi upload */}
            {uploadingAvatar && (
              <View className="absolute top-0 left-0 w-24 h-24 rounded-full items-center justify-center bg-black/30">
                <ActivityIndicator />
              </View>
            )}

            {/* icon edit */}
            <View className="absolute bottom-2 right-2 w-7 h-7 rounded-full bg-white items-center justify-center border border-gray-200">
              <Ionicons name="camera" size={16} color="#000" />
            </View>
          </TouchableOpacity>

          {fetchingProfile ? (
            <Text className="text-gray-500">Loading profile...</Text>
          ) : (
            <>
              <Text className="text-xl font-bold">
                {profile?.username || (user as any)?.displayName || "User"}
              </Text>
              <Text className="text-gray-500">
                {profile?.email || (user as any)?.email}
              </Text>
            </>
          )}
        </View>

        {/* Edit Profile */}
        <TouchableOpacity
          className="bg-white p-4 rounded-lg mb-3 flex-row items-center mx-5"
          onPress={() => router.push("/profile/edit" as any)}
        >
          <Ionicons name="create-outline" size={24} color="#000" />
          <Text className="text-gray-900 font-medium ml-3">Edit Profile</Text>
        </TouchableOpacity>

        {/* Address */}
        <TouchableOpacity
          className="bg-white p-4 rounded-lg mb-3 flex-row items-center mx-5"
          onPress={() => router.push("/profile/address" as any)}
        >
          <Ionicons name="location-outline" size={24} color="#000" />
          <Text className="text-gray-900 font-medium ml-3">Address</Text>
        </TouchableOpacity>

        {/* Notifications */}
        <TouchableOpacity
          className="bg-white p-4 rounded-lg mb-3 flex-row items-center mx-5 justify-between"
          onPress={async () => {
            await router.push("/profile/notifications" as any);
            const res = await notificationService.unreadCount(firebaseUid);
            setUnreadCount(res.data?.count || 0);
          }}
        >
          <View className="flex-row items-center">
            <Ionicons name="notifications-outline" size={24} color="#000" />
            <Text className="text-gray-900 font-medium ml-3">
              Notifications
            </Text>
          </View>

          {unreadCount > 0 && (
            <View
              className="min-w-[18px] h-[18px] px-1 rounded-full items-center justify-center"
              style={{ backgroundColor: "red" }}
            >
              <Text className="text-white text-[11px] font-bold">
                {unreadCount > 9 ? "9+" : unreadCount}
              </Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Order History */}
        <TouchableOpacity
          className="bg-white p-4 rounded-lg mb-3 flex-row items-center mx-5"
          onPress={() => router.push("/profile/orders_history" as any)}
        >
          <Ionicons name="receipt-outline" size={24} color="#000" />
          <Text className="text-gray-900 font-medium ml-3">Order History</Text>
        </TouchableOpacity>

        {/* Contact Support */}
        <TouchableOpacity
          className="bg-white p-4 rounded-lg mb-3 flex-row items-center mx-5"
          onPress={() => router.push("/profile/support" as any)}
        >
          <Ionicons name="help-circle-outline" size={24} color="#000" />
          <Text className="text-gray-900 font-medium ml-3">
            Contact Support
          </Text>
        </TouchableOpacity>

        {/* Logout */}
        <TouchableOpacity
          className="bg-white p-4 rounded-lg mb-3 flex-row items-center mx-5"
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={24} color="#000" />
          <Text className="text-gray-900 font-medium ml-3">Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
