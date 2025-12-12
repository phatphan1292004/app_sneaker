import { loginUser } from "@/services/authService";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

export default function LoginScreen() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Please fill in all fields",
      });
      return;
    }

    setLoading(true);
    try {
      await loginUser({ email, password });
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Logged in successfully!",
      });
      router.replace("/(tabs)");
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Login Failed",
        text2: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="px-6 pt-12">
        {/* Back Button */}
        <TouchableOpacity onPress={() => router.back()} className="mb-8">
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>

        {/* Header */}
        <View className="mb-8">
          <Text className="text-3xl font-bold text-gray-900 mb-2">
            Welcome Back
          </Text>
          <Text className="text-gray-500 text-base">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </Text>
        </View>

        {/* Input Fields */}
        <View className="mb-6">
          <TextInput
            placeholder="Enter Email"
            placeholderTextColor="#9ca3af"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            className="bg-gray-50 rounded-xl px-4 py-4 text-gray-900 mb-4"
          />

          <View className="relative">
            <TextInput
              placeholder="Enter Password"
              placeholderTextColor="#9ca3af"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              className="bg-gray-50 rounded-xl px-4 py-4 text-gray-900"
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-4"
            >
              <Ionicons
                name={showPassword ? "eye-off-outline" : "eye-outline"}
                size={22}
                color="#9ca3af"
              />
            </TouchableOpacity>
          </View>

          {/* Forgot Password */}
          <TouchableOpacity
            onPress={() => router.push("/auth/forgot-password")}
            className="mt-3 self-end"
          >
            <Text className="text-sm text-[#496c60] font-medium">
              Forgot Password?
            </Text>
          </TouchableOpacity>
        </View>

        {/* Sign In Button */}
        <TouchableOpacity
          className="rounded-xl py-4 mb-6 flex-row items-center justify-center"
          style={{ backgroundColor: "#496c60", opacity: loading ? 0.7 : 1 }}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white text-center font-semibold text-base">
              Sign In
            </Text>
          )}
        </TouchableOpacity>

        {/* Divider */}
        <View className="flex-row items-center mb-6">
          <View className="flex-1 h-px bg-gray-200" />
          <Text className="mx-4 text-gray-400 text-sm">or Signin with</Text>
          <View className="flex-1 h-px bg-gray-200" />
        </View>

        {/* Social Login Buttons */}
        <View className="flex-row gap-3 mb-8">
          <TouchableOpacity className="flex-1 flex-row items-center justify-center border border-gray-200 rounded-xl py-3">
            <Ionicons name="logo-google" size={20} color="#DB4437" />
            <Text className="ml-2 font-medium text-gray-700">Google</Text>
          </TouchableOpacity>

          <TouchableOpacity className="flex-1 flex-row items-center justify-center border border-gray-200 rounded-xl py-3">
            <Ionicons name="logo-facebook" size={20} color="#4267B2" />
            <Text className="ml-2 font-medium text-gray-700">Facebook</Text>
          </TouchableOpacity>
        </View>

        {/* Sign Up Link */}
        <View className="flex-row justify-center items-center">
          <Text className="text-gray-600">Don&apos;t have an account? </Text>
          <TouchableOpacity onPress={() => router.push("/auth/register")}>
            <Text className="font-semibold text-gray-900">Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
