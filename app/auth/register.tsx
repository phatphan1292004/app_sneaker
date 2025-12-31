import { loginWithGoogle, registerUser } from "@/services/authService";
import { Ionicons } from "@expo/vector-icons";
import * as Google from "expo-auth-session/providers/google";
import { router } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

WebBrowser.maybeCompleteAuthSession();

export default function RegisterScreen() {
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
  });

  useEffect(() => {
    if (response?.type === "success") {
      const { id_token } = response.params;
      handleGoogleSignIn(id_token);
    }
  }, [response]);

  const handleGoogleSignIn = async (idToken: string) => {
    setGoogleLoading(true);
    try {
      await loginWithGoogle(idToken);
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Logged in with Google successfully!",
      });
      router.replace("/(tabs)");
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Google Sign In Failed",
        text2: error.message,
      });
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Please fill in all fields",
      });
      return;
    }

    if (!acceptTerms) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Please accept terms and conditions",
      });
      return;
    }

    setLoading(true);
    try {
      console.log("Starting registration...");
      await registerUser({ name, email, password });
      console.log("Registration successful!");
      setLoading(false);
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Account created successfully! Please sign in.",
      });
      setTimeout(() => {
        router.replace("/auth/login");
      }, 1500);
    } catch (error: any) {
      console.error("Registration error:", error);
      setLoading(false);
      Toast.show({
        type: "error",
        text1: "Registration Failed",
        text2: error.message || "An error occurred",
      });
    }
  };

  return (
    <ScrollView className="flex-1 bg-white pt-5">
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
            Please sign up to get started with our app.
          </Text>
        </View>

        {/* Input Fields */}
        <View className="mb-6">
          <TextInput
            placeholder="Enter Name"
            placeholderTextColor="#9ca3af"
            value={name}
            onChangeText={setName}
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
          <TouchableOpacity
            className="flex-1 flex-row items-center justify-center border border-gray-200 rounded-xl py-3"
            onPress={() => promptAsync()}
            disabled={!request || googleLoading}
            style={{ opacity: !request || googleLoading ? 0.5 : 1 }}
          >
            {googleLoading ? (
              <ActivityIndicator size="small" color="#DB4437" />
            ) : (
              <>
                <Ionicons name="logo-google" size={20} color="#DB4437" />
                <Text className="ml-2 font-medium text-gray-700">Google</Text>
              </>
            )}
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
