import { useAuth } from "@/contexts/AuthContext";
import { Profile, profileService } from "@/services/profileService";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

export default function EditProfileScreen() {
  const { user: firebaseUser, loading } = useAuth();
  const navigation = useNavigation();

  // Mongo profile
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  // form state (UI GIỮ NGUYÊN)
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [gender, setGender] = useState("");

  /**
   * LOAD PROFILE TỪ MONGO
   */
  useEffect(() => {
    if (!firebaseUser?.uid) return;

    const loadProfile = async () => {
      try {
        const res = await profileService.getByFirebaseUid(firebaseUser.uid);

        if (!res.success) {
          Toast.show({
            type: "error",
            text1: "Lỗi",
            text2: "Không tìm thấy hồ sơ người dùng",
          });
          return;
        }

        const data: Profile = res.data;

        setProfile(data);
        setDisplayName(data.username ?? "");
        setEmail(data.email ?? "");
        setPhoneNumber(data.phoneNumber ?? "");
        setBirthDate(data.birthDate ?? "");
        setGender(data.gender ?? "");
      } catch {
        Toast.show({
          type: "error",
          text1: "Lỗi",
          text2: "Không thể tải hồ sơ",
        });
      } finally {
        setLoadingProfile(false);
      }
    };

    loadProfile();
  }, [firebaseUser]);

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, []);

  /**
   * VALIDATE
   */
  const validateForm = () => {
    if (!displayName.trim()) {
      Toast.show({
        type: "error",
        text1: "Thiếu thông tin",
        text2: "Vui lòng nhập họ tên",
      });
      return false;
    }

    if (phoneNumber && !/^0\d{9}$/.test(phoneNumber)) {
      Toast.show({
        type: "error",
        text1: "Sai định dạng",
        text2: "Số điện thoại phải gồm 10 chữ số và bắt đầu bằng 0",
      });
      return false;
    }

    if (birthDate && !/^\d{4}-\d{2}-\d{2}$/.test(birthDate)) {
      Toast.show({
        type: "error",
        text1: "Sai định dạng",
        text2: "Ngày sinh phải theo định dạng YYYY-MM-DD",
      });
      return false;
    }

    if (gender && !["male", "female", "other"].includes(gender.toLowerCase())) {
      Toast.show({
        type: "error",
        text1: "Sai định dạng",
        text2: "Giới tính chỉ gồm Male / Female / Other",
      });
      return false;
    }

    return true;
  };

  /**
   * SAVE
   */
  const handleSave = async () => {
    if (!profile) return;
    if (!validateForm()) return;

    try {
      const res = await profileService.updateProfile(profile._id, {
        username: displayName,
        phoneNumber,
        birthDate,
        gender: gender.toLowerCase(),
      });

      if (!res.success) {
        Toast.show({
          type: "error",
          text1: "Thất bại",
          text2: "Cập nhật hồ sơ không thành công",
        });
        return;
      }

      Toast.show({
        type: "success",
        text1: "Thành công",
        text2: "Cập nhật hồ sơ thành công",
      });

      navigation.goBack();
    } catch {
      Toast.show({
        type: "error",
        text1: "Lỗi mạng",
        text2: "Không thể kết nối máy chủ",
      });
    }
  };

  if (loading || loadingProfile) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white pt-12">
      {/* Header – GIỮ NGUYÊN */}
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

      {/* Content – GIỮ NGUYÊN */}
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 20,
          paddingBottom: 40,
        }}
      >
        {/* Full Name */}
        <View className="mb-4">
          <Text className="text-sm font-semibold text-gray-900 mb-2">
            Full Name
          </Text>
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
          <Text className="text-sm font-semibold text-gray-900 mb-2">
            Email Address
          </Text>
          <View className="flex-row items-center bg-gray-100 rounded-xl px-4 py-3 border border-gray-200">
            <Ionicons name="mail-outline" size={20} color="#9CA3AF" />
            <TextInput
              value={email}
              editable={false}
              className="flex-1 ml-3 text-gray-500"
            />
            <Ionicons name="lock-closed-outline" size={16} color="#9CA3AF" />
          </View>
        </View>

        {/* Phone */}
        <View className="mb-4">
          <Text className="text-sm font-semibold text-gray-900 mb-2">
            Phone Number
          </Text>
          <View className="flex-row items-center bg-gray-50 rounded-xl px-4 py-3 border border-gray-200">
            <Ionicons name="call-outline" size={20} color="#496c60" />
            <TextInput
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
              className="flex-1 ml-3 text-gray-900"
              placeholder="Enter phone number"
              placeholderTextColor="#9CA3AF"
            />
          </View>
        </View>

        {/* Birth Date */}
        <View className="mb-4">
          <Text className="text-sm font-semibold text-gray-900 mb-2">
            Date of Birth
          </Text>
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
          <Text className="text-sm font-semibold text-gray-900 mb-2">
            Gender
          </Text>
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

        {/* Save */}
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
