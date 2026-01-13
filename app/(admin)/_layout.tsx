import { Ionicons } from "@expo/vector-icons";
import { Drawer } from "expo-router/drawer";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { AdminStoreProvider } from "../../components/admin/AdminStore";

import Toast from "react-native-toast-message";
import {
  AdminThemeProvider,
  useAdminTheme,
} from "../../components/admin/theme";

function AdminDrawer() {
  const { mode } = useAdminTheme();
  const bg = mode === "dark" ? "#000" : "#fff";
  const inactive = mode === "dark" ? "#9ca3af" : "#6b7280";
  const active = "#496c60";
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: bg }}>
      <Drawer
        screenOptions={{
          headerShown: false,
          drawerStyle: { backgroundColor: bg, width: 290 },
          drawerContentStyle: { backgroundColor: bg },
          drawerActiveTintColor: active,
          drawerInactiveTintColor: inactive,
        }}
      >
        <Drawer.Screen
          name="index"
          options={{
            title: "Dashboard",
            drawerIcon: ({ color, size }) => (
              <Ionicons name="speedometer-outline" size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="users"
          options={{
            title: "Users",
            drawerIcon: ({ color, size }) => (
              <Ionicons name="people-outline" size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="brands"
          options={{
            title: "Brands",
            drawerIcon: ({ color, size }) => (
              <Ionicons name="pricetag-outline" size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="products"
          options={{
            title: "Products",
            drawerIcon: ({ color, size }) => (
              <Ionicons name="cube-outline" size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="orders"
          options={{
            title: "Orders",
            drawerIcon: ({ color, size }) => (
              <Ionicons name="receipt-outline" size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="vouchers"
          options={{
            title: "Vouchers",
            drawerIcon: ({ color, size }) => (
              <Ionicons name="ticket-outline" size={size} color={color} />
            ),
          }}
        />

        {/* Ẩn detail khỏi drawer */}
        <Drawer.Screen
          name="products/[id]"
          options={{ drawerItemStyle: { display: "none" } }}
        />
        <Drawer.Screen
          name="orders/[id]"
          options={{ drawerItemStyle: { display: "none" } }}
        />
      </Drawer>
    </SafeAreaView>
  );
}

export default function AdminLayout() {
  return (
    <AdminThemeProvider>
      <AdminStoreProvider>
        <AdminDrawer />
        <Toast position="bottom" />
      </AdminStoreProvider>
    </AdminThemeProvider>
  );
}
