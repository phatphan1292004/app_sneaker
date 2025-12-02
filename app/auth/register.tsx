import { registerUser } from "@/services/authService";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function RegisterScreen() {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!username || !email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (!acceptTerms) {
      Alert.alert("Error", "Please accept terms and conditions");
      return;
    }

    setLoading(true);
    try {
      console.log("Starting registration...");
      await registerUser({ username, email, password });
      console.log("Registration successful!");
      setLoading(false);
      Alert.alert(
        "Success", 
        "Account created successfully! Please sign in.",
        [
          {
            text: "OK",
            onPress: () => router.replace("/auth/login")
          }
        ]
      );
    } catch (error: any) {
      console.error("Registration error:", error);
      setLoading(false);
      Alert.alert("Registration Failed", error.message || "An error occurred");
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
            Create Account
          </Text>
          <Text className="text-gray-500 text-base">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </Text>
        </View>

        {/* Input Fields */}
        <View className="mb-6">
          <TextInput
            placeholder="Enter Username"
            placeholderTextColor="#9ca3af"
            value={username}
            onChangeText={setUsername}
            className="bg-gray-50 rounded-xl px-4 py-4 text-gray-900 mb-4"
          />

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
        </View>

        {/* Terms Checkbox */}
        <TouchableOpacity
          onPress={() => setAcceptTerms(!acceptTerms)}
          className="flex-row items-center mb-6"
        >
          <View
            className={`w-5 h-5 rounded border-2 mr-3 items-center justify-center ${
              acceptTerms ? "bg-gray-900 border-gray-900" : "border-gray-300"
            }`}
          >
            {acceptTerms && (
              <Ionicons name="checkmark" size={14} color="#fff" />
            )}
          </View>
          <Text className="text-gray-600 text-sm">
            I agree to the terms and conditions
          </Text>
        </TouchableOpacity>

        {/* Sign Up Button */}
        <TouchableOpacity
          className="rounded-xl py-4 mb-6 flex-row items-center justify-center"
          style={{ backgroundColor: "#496c60", opacity: loading ? 0.7 : 1 }}
          onPress={handleRegister}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text className="text-white text-center font-semibold text-base">
              Sign Up
            </Text>
          )}
        </TouchableOpacity>

        {/* Divider */}
        <View className="flex-row items-center mb-6">
          <View className="flex-1 h-px bg-gray-200" />
          <Text className="mx-4 text-gray-400 text-sm">or signin with</Text>
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

        {/* Sign In Link */}
        <View className="flex-row justify-center items-center pb-6">
          <Text className="text-gray-600">Already have an account? </Text>
          <TouchableOpacity onPress={() => router.push("/auth/login")}>
            <Text className="font-semibold text-gray-900">Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
