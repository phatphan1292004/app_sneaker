import CustomTabBar from "@/components/CustomTabBar";
import CartIcon from "@/components/icons/CartIcon";
import FavIcon from "@/components/icons/FavIcon";
import HomeIcon from "@/components/icons/HomeIcon";
import ProfileIcon from "@/components/icons/ProfileIcon";
import SearchIcon from "@/components/icons/SearchIcon";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Tabs } from "expo-router";
import React from "react";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        tabBarActiveTintColor: "#C4FF0E",
        tabBarInactiveTintColor: "#666",
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarLabel: "Home",
          tabBarIcon: ({ color, size }) => (
            <HomeIcon width={size} height={size} stroke={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="search"
        options={{
          title: "Tìm kiếm",
          tabBarLabel: "Search",
          tabBarIcon: ({ color, size }) => (
            <SearchIcon width={size} height={size} stroke={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="cart"
        options={{
          title: "Giỏ hàng",
          tabBarLabel: "Cart",
          tabBarIcon: ({ color, size }) => (
            <CartIcon width={size} height={size} stroke={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="fav"
        options={{
          title: "Yêu thích",
          tabBarLabel: "Favorite",
          tabBarIcon: ({ color, size }) => (
            <FavIcon width={size} height={size} stroke={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Cá nhân",
          tabBarLabel: "Profile",
          tabBarIcon: ({ color, size }) => (
            <ProfileIcon width={size} height={size} stroke={color} />
          ),
        }}
      />
    </Tabs>
  );
}
