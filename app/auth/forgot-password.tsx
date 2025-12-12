import { auth } from "@/config/firebase";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { sendPasswordResetEmail } from "firebase/auth";
import React, { useState } from "react";
import { ActivityIndicator, Text, TextInput, TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {
    if (!email) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Please enter your email",
      });
      return;
    }
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Password reset email sent!",
      });
      router.replace("/auth/login");
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Reset Failed",
        text2: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-white px-6 pt-12">
      {/* Back Button */}
      <TouchableOpacity onPress={() => router.back()} className="mb-8">
        <Ionicons name="chevron-back" size={24} color="#000" />
      </TouchableOpacity>
      <Text className="text-3xl font-bold text-gray-900 mb-2">Forgot Password</Text>
      <Text className="text-gray-500 text-base mb-8">
        Enter your email and we will send you a link to reset your password.
      </Text>
      <TextInput
        placeholder="Enter Email"
        placeholderTextColor="#9ca3af"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        className="bg-gray-50 rounded-xl px-4 py-4 text-gray-900 mb-6"
      />
      <TouchableOpacity
        className="rounded-xl py-4 mb-6 flex-row items-center justify-center"
        style={{ backgroundColor: "#496c60", opacity: loading ? 0.7 : 1 }}
        onPress={handleResetPassword}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-white text-center font-semibold text-base">Send Reset Link</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}
