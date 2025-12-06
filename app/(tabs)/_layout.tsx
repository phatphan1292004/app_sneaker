import BrandIcon from "@/components/icons/BrandIcon";
import CartIcon from "@/components/icons/CartIcon";
import FavIcon from "@/components/icons/FavIcon";
import HomeIcon from "@/components/icons/HomeIcon";
import ProfileIcon from "@/components/icons/ProfileIcon";
import CustomTabBar from "@/components/tabbar/CustomTabBar";
import { Tabs } from "expo-router";
import React from "react";

export default function TabLayout() {

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
        name="brand"
        options={{
          title: "Thương hiệu",
          tabBarLabel: "Brand",
          tabBarIcon: ({ color, size }) => (
            <BrandIcon width={size} height={size} stroke={color} />
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
          tabBarStyle: { display: "none" },
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
