import React from "react";
import { Text, View } from "react-native";
import { t, useAdminTheme } from "./theme";

export function EmptyState({
  title = "Không có dữ liệu",
  subtitle = "Hãy tạo mới để bắt đầu.",
}: {
  title?: string;
  subtitle?: string;
}) {
  const { mode } = useAdminTheme();
  return (
    <View className="px-5 py-10 items-center">
      <View
        className={
          t(mode, "bg-gray-100", "bg-gray-900") + " w-14 h-14 rounded-2xl"
        }
      />
      <Text
        className={
          t(mode, "text-gray-900", "text-white") +
          " font-extrabold text-lg mt-4"
        }
      >
        {title}
      </Text>
      <Text
        className={
          t(mode, "text-gray-500", "text-gray-400") + " mt-1 text-center"
        }
      >
        {subtitle}
      </Text>
    </View>
  );
}

export function SkeletonCard() {
  const { mode } = useAdminTheme();
  const bg = t(mode, "bg-gray-100", "bg-gray-900");
  return (
    <View
      className={
        t(
          mode,
          "bg-white border border-gray-200",
          "bg-black border border-gray-900"
        ) + " rounded-2xl p-4 mx-5 mb-3"
      }
    >
      <View className={`${bg} h-4 w-40 rounded-lg`} />
      <View className={`${bg} h-3 w-56 rounded-lg mt-3`} />
      <View className={`${bg} h-3 w-44 rounded-lg mt-2`} />
    </View>
  );
}
