import { useNotifications } from "@/hooks/useNotifications";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  ActivityIndicator,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface NotificationModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function NotificationModal({
  visible,
  onClose,
}: NotificationModalProps) {
  const { notifications, loading, markAsRead, remove } = useNotifications();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "Vừa xong";
    if (diffInSeconds < 3600)
      return `${Math.floor(diffInSeconds / 60)} phút trước`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)} giờ trước`;
    if (diffInSeconds < 604800)
      return `${Math.floor(diffInSeconds / 86400)} ngày trước`;

    return date.toLocaleDateString("vi-VN");
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50">
        <TouchableOpacity
          activeOpacity={1}
          onPress={onClose}
          className="flex-1"
        />
        <View className="bg-white rounded-t-3xl h-[85%]">
          {/* Header */}
          <View className="px-5 pt-5 pb-3 border-b border-gray-200 flex-row items-center justify-between">
            <Text className="text-xl font-bold">Notifications</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#000" />
            </TouchableOpacity>
          </View>

          {/* Content */}
          <ScrollView
            className="flex-1"
            showsVerticalScrollIndicator={false}
          >
            {loading ? (
              <View className="py-20 items-center justify-center">
                <ActivityIndicator size="large" color="#000" />
                <Text className="mt-2 text-gray-600">Loading...</Text>
              </View>
            ) : notifications.length === 0 ? (
              <View className="py-20 items-center justify-center">
                <Ionicons
                  name="notifications-off-outline"
                  size={64}
                  color="#9ca3af"
                />
                <Text className="mt-4 text-gray-500 text-base">
                  No notifications yet
                </Text>
              </View>
            ) : (
              <View className="px-5 py-2">
                {notifications.map((notification) => (
                  <View
                    key={notification._id}
                    className={`mb-3 p-4 rounded-xl ${
                      notification.isRead ? "bg-white" : "bg-blue-50"
                    } border border-gray-200`}
                  >
                    <View className="flex-row items-start justify-between">
                      <View className="flex-1 mr-2">
                        <Text className="text-base font-semibold text-gray-900 mb-1">
                          {notification.title}
                        </Text>
                        <Text className="text-sm text-gray-600 mb-2">
                          {notification.message}
                        </Text>
                        <Text className="text-xs text-gray-400">
                          {formatDate(notification.createdAt)}
                        </Text>
                      </View>
                      <View className="flex-row items-center gap-2">
                        {!notification.isRead && (
                          <TouchableOpacity
                            onPress={() => markAsRead(notification._id)}
                            className="p-2"
                          >
                            <Ionicons
                              name="checkmark-circle-outline"
                              size={20}
                              color="#10b981"
                            />
                          </TouchableOpacity>
                        )}
                        <TouchableOpacity
                          onPress={() => remove(notification._id)}
                          className="p-2"
                        >
                          <Ionicons
                            name="trash-outline"
                            size={20}
                            color="#ef4444"
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
