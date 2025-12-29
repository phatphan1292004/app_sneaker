import { Ionicons } from "@expo/vector-icons";
import { Stack, router } from "expo-router";

import { useNotifications } from "@/hooks/useNotifications";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function NotificationsScreen() {
  const { notifications, loading, markAsRead, remove } = useNotifications();

  return (
    <View className="flex-1 bg-white">
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header custom giống Address */}
      <View
        className="px-5 py-4 border-b border-gray-200 flex-row items-center justify-between"
        style={{ paddingTop: 40 }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 items-center justify-center"
        >
          <Ionicons name="chevron-back" size={28} color="#000" />
        </TouchableOpacity>

        <Text className="text-xl font-bold text-gray-900 flex-1 text-center">
          Notifications
        </Text>

        <View className="w-10 h-10" />
      </View>

      <ScrollView className="flex-1 px-5 py-4">
        {loading ? (
          <Text className="text-gray-500">Loading...</Text>
        ) : notifications.length === 0 ? (
          <Text className="text-gray-600">No notifications yet...</Text>
        ) : (
          notifications.map((n) => (
            <TouchableOpacity
              key={n._id}
              onPress={() => markAsRead(n._id)}
              onLongPress={() => remove(n._id)}
              className="mb-3 p-4 rounded-lg"
              style={{ backgroundColor: n.isRead ? "#f9fafb" : "#e6f4f1" }}
            >
              <Text className="font-semibold text-gray-900">{n.title}</Text>
              <Text className="text-gray-600 mt-1">{n.message}</Text>

              {!n.isRead && (
                <Text className="text-xs mt-2 text-green-700">
                  Nhấn để đánh dấu đã đọc ... Giữ im để xóa
                </Text>
              )}
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
}
