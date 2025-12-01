import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { View } from "react-native";

export default function ProfileScreen() {
  // Mặc định là chưa đăng nhập
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Kiểm tra trạng thái đăng nhập
    if (!isLoggedIn) {
      // Chuyển đến trang login nếu chưa đăng nhập
      router.replace("/auth/login");
    }
  }, [isLoggedIn]);

  // Nếu đã đăng nhập thì hiển thị profile
  return (
    <View className="flex-1 bg-white">
      {/* Profile content sẽ được thêm sau */}
    </View>
  );
}
