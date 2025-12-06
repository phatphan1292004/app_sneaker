import BrandIcon from "@/components/icons/BrandIcon";
import CartIcon from "@/components/icons/CartIcon";
import FavIcon from "@/components/icons/FavIcon";
import HomeIcon from "@/components/icons/HomeIcon";
import ProfileIcon from "@/components/icons/ProfileIcon";
import { useCart } from "@/contexts/CartContext";
import { router, usePathname } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function SimpleTabBar() {
  const { getTotalItems } = useCart();
  const cartItemsCount = getTotalItems();
  const pathname = usePathname();

  const tabs = [
    { name: "Home", icon: HomeIcon, route: "/(tabs)" },
    { name: "Brand", icon: BrandIcon, route: "/(tabs)/brand" },
    { name: "Cart", icon: CartIcon, route: "/(tabs)/cart" },
    { name: "Favorite", icon: FavIcon, route: "/(tabs)/fav" },
    { name: "Profile", icon: ProfileIcon, route: "/(tabs)/profile" },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        {tabs.map((tab) => {
          const isFocused = pathname.includes(tab.route);
          const isCartTab = tab.name === "Cart";
          const Icon = tab.icon;

          return (
            <TouchableOpacity
              key={tab.name}
              onPress={() => router.push(tab.route as any)}
              style={[
                styles.tabButton,
                isFocused && styles.tabButtonFocused,
              ]}
              activeOpacity={0.7}
            >
              <View style={{ position: "relative" }}>
                <Icon color={isFocused ? "#496c60" : "#9ca3af"} />
                {isCartTab && cartItemsCount > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>
                      {cartItemsCount > 99 ? "99+" : cartItemsCount}
                    </Text>
                  </View>
                )}
              </View>
              {isFocused && (
                <Text style={styles.tabLabelFocused}>{tab.name}</Text>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f3f4f6",
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  tabBar: {
    flexDirection: "row",
    height: 60,
    backgroundColor: "#fff",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  tabButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  tabButtonFocused: {
    backgroundColor: "#d1e7dd",
    paddingHorizontal: 14,
  },
  tabLabelFocused: {
    fontSize: 12,
    fontWeight: "600",
    color: "#496c60",
    marginLeft: 6,
  },
  badge: {
    position: "absolute",
    top: -6,
    right: -8,
    backgroundColor: "#ef4444",
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  badgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "700",
  },
});
