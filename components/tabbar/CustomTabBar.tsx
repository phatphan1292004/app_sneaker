import { useCart } from "@/contexts/CartContext";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function CustomTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const { getTotalItems } = useCart();
  const cartItemsCount = getTotalItems();

  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;
          const isCartTab = route.name === "cart";

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const color = isFocused ? "#496c60" : "#9ca3af";

          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              style={[
                styles.tabButton,
                isFocused && styles.tabButtonFocused,
              ]}
              activeOpacity={0.7}
            >
              <View style={{ position: "relative" }}>
                {options.tabBarIcon?.({
                  focused: isFocused,
                  color: isFocused ? "#496c60" : color,
                  size: 20,
                })}
                {isCartTab && cartItemsCount > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>
                      {cartItemsCount > 99 ? "99+" : cartItemsCount}
                    </Text>
                  </View>
                )}
              </View>
              {isFocused && (
                <Text style={styles.tabLabelFocused} numberOfLines={1}>
                  {(options.tabBarLabel as string) || route.name}
                </Text>
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
    marginBottom:10,
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
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 8,
  },
  tabButtonFocused: {
    backgroundColor: "#d1e7dd",
    paddingHorizontal: 8,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: "600",
    marginTop: 4,
  },
  tabLabelFocused: {
    fontSize: 10,
    fontWeight: "600",
    color: "#496c60",
    marginTop: 0,
    textAlign: "center",
  },
  badge: {
    position: "absolute",
    top: -2,
    right: -4,
    backgroundColor: "#ef4444",
    borderRadius: 10,
    minWidth: 14,
    height: 14,
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
