import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useMemo } from "react";
import { FlatList, Pressable, Text, View } from "react-native";

import { useAdminStore } from "../../components/admin/AdminStore";
import { t, useAdminTheme } from "../../components/admin/theme";
import {
  CardPro,
  MiniBtn,
  Row,
  ScreenPro,
} from "../../components/admin/ui-pro";
import { SkeletonCard } from "../../components/admin/ux";

export default function AdminDashboard() {
  const { state, actions } = useAdminStore();
  const { mode } = useAdminTheme();

  useEffect(() => {
    actions.boot();
  }, []);

  const revenuePaid = useMemo(() => {
    return state.orders
      .filter(
        (o) =>
          o.status === "paid" ||
          o.status === "delivered" ||
          o.status === "shipping"
      )
      .reduce((sum, o) => sum + o.total_amount, 0);
  }, [state.orders]);

  const topSelling = useMemo(() => {
    return [...state.products].sort((a, b) => b.sold - a.sold).slice(0, 5);
  }, [state.products]);

  const recentOrders = useMemo(() => {
    return [...state.orders]
      .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
      .slice(0, 6);
  }, [state.orders]);

  const stats = [
    {
      label: "Users",
      value: state.users.length,
      icon: "people-outline" as const,
    },
    {
      label: "Brands",
      value: state.brands.length,
      icon: "pricetag-outline" as const,
    },
    {
      label: "Products",
      value: state.products.length,
      icon: "cube-outline" as const,
    },
    {
      label: "Orders",
      value: state.orders.length,
      icon: "receipt-outline" as const,
    },
  ];

  const chart = [2, 4, 3, 6, 5, 2, 7]; // mock columns

  return (
    <ScreenPro title="Admin" subtitle="Dashboard">
      {!actions.isBooted ? (
        <View className="pt-4">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </View>
      ) : (
        <FlatList
          data={[{ key: "content" }]}
          keyExtractor={(x) => x.key}
          renderItem={() => (
            <View className="px-5 pt-4 pb-8">
              {/* Stats */}
              <View className="flex-row flex-wrap justify-between">
                {stats.map((s) => (
                  <View key={s.label} className="w-[48%] mb-3">
                    <CardPro>
                      <Row
                        left={
                          <View className="flex-row items-center">
                            <View
                              className={
                                t(mode, "bg-gray-100", "bg-gray-900") +
                                " w-10 h-10 rounded-2xl items-center justify-center mr-3"
                              }
                            >
                              <Ionicons
                                name={s.icon}
                                size={18}
                                color="#496c60"
                              />
                            </View>
                            <Text
                              className={
                                t(mode, "text-gray-500", "text-gray-400") +
                                " font-extrabold"
                              }
                            >
                              {s.label.toUpperCase()}
                            </Text>
                          </View>
                        }
                      />
                      <Text
                        className={
                          t(mode, "text-gray-900", "text-white") +
                          " text-3xl font-extrabold mt-3"
                        }
                      >
                        {s.value}
                      </Text>
                      <Text
                        className={
                          t(mode, "text-gray-500", "text-gray-400") + " mt-1"
                        }
                      >
                        Tổng {s.label.toLowerCase()}
                      </Text>
                    </CardPro>
                  </View>
                ))}
              </View>

              {/* Revenue */}
              <CardPro className="mb-3">
                <Row
                  left={
                    <View className="flex-row items-center">
                      <View
                        className={
                          t(mode, "bg-gray-100", "bg-gray-900") +
                          " w-10 h-10 rounded-2xl items-center justify-center mr-3"
                        }
                      >
                        <Ionicons
                          name="cash-outline"
                          size={18}
                          color="#496c60"
                        />
                      </View>
                      <Text
                        className={
                          t(mode, "text-gray-500", "text-gray-400") +
                          " font-extrabold"
                        }
                      >
                        REVENUE (PAID)
                      </Text>
                    </View>
                  }
                />
                <Text
                  className={
                    t(mode, "text-gray-900", "text-white") +
                    " text-3xl font-extrabold mt-3"
                  }
                >
                  {revenuePaid.toLocaleString("vi-VN")} ₫
                </Text>
                <Text
                  className={
                    t(mode, "text-gray-500", "text-gray-400") + " mt-1"
                  }
                >
                  Doanh thu đã thanh toán
                </Text>
              </CardPro>

              {/* Mini chart */}
              <CardPro className="mb-3">
                <Row
                  left={
                    <Text
                      className={
                        t(mode, "text-gray-900", "text-white") +
                        " font-extrabold text-lg"
                      }
                    >
                      Revenue last 7 days
                    </Text>
                  }
                  right={
                    <Ionicons
                      name="analytics-outline"
                      size={20}
                      color="#496c60"
                    />
                  }
                />
                <View className="flex-row items-end mt-4">
                  {chart.map((v, idx) => (
                    <View key={idx} className="flex-1 items-center">
                      <View
                        className="w-3 rounded-full bg-[#496c60]"
                        style={{ height: 10 + v * 10, opacity: 0.9 }}
                      />
                      <View
                        className={
                          t(mode, "bg-gray-200", "bg-gray-900") +
                          " h-1 w-4 rounded-full mt-2"
                        }
                      />
                    </View>
                  ))}
                </View>
                <Text
                  className={
                    t(mode, "text-gray-500", "text-gray-400") + " mt-3"
                  }
                >
                  Mỗi cột = doanh thu/100.000
                </Text>
              </CardPro>

              {/* Top selling */}
              <CardPro className="mb-3">
                <Row
                  left={
                    <Text
                      className={
                        t(mode, "text-gray-900", "text-white") +
                        " font-extrabold text-lg"
                      }
                    >
                      Top selling
                    </Text>
                  }
                  right={
                    <MiniBtn
                      label="All"
                      icon="arrow-forward"
                      onPress={() => router.push("/(admin)/products" as any)}
                    />
                  }
                />
                <View className="mt-3">
                  {topSelling.map((p) => (
                    <Pressable
                      key={p._id}
                      onPress={() =>
                        router.push(`/(admin)/products/${p._id}` as any)
                      }
                      className={
                        t(mode, "border-gray-200", "border-gray-900") +
                        " border rounded-2xl px-4 py-3 mb-2"
                      }
                    >
                      <Row
                        left={
                          <View>
                            <Text
                              className={
                                t(mode, "text-gray-900", "text-white") +
                                " font-extrabold"
                              }
                              numberOfLines={1}
                            >
                              {p.name}
                            </Text>
                            <Text
                              className={
                                t(mode, "text-gray-500", "text-gray-400") +
                                " mt-1"
                              }
                            >
                              Sold: {p.sold} • Price:{" "}
                              {p.base_price.toLocaleString("vi-VN")} ₫
                            </Text>
                          </View>
                        }
                        right={
                          <Ionicons
                            name="chevron-forward"
                            size={18}
                            color="#496c60"
                          />
                        }
                      />
                    </Pressable>
                  ))}
                </View>
              </CardPro>

              {/* Recent orders */}
              <CardPro>
                <Row
                  left={
                    <Text
                      className={
                        t(mode, "text-gray-900", "text-white") +
                        " font-extrabold text-lg"
                      }
                    >
                      Recent orders
                    </Text>
                  }
                  right={
                    <MiniBtn
                      label="All"
                      icon="arrow-forward"
                      onPress={() => router.push("/(admin)/orders" as any)}
                    />
                  }
                />
                <View className="mt-3">
                  {recentOrders.map((o) => (
                    <Pressable
                      key={o._id}
                      onPress={() =>
                        router.push(`/(admin)/orders/${o._id}` as any)
                      }
                      className={
                        t(mode, "border-gray-200", "border-gray-900") +
                        " border rounded-2xl px-4 py-3 mb-2"
                      }
                    >
                      <Row
                        left={
                          <View>
                            <Text
                              className={
                                t(mode, "text-gray-900", "text-white") +
                                " font-extrabold"
                              }
                              numberOfLines={1}
                            >
                              #{o._id.slice(-6)} • {o.status.toUpperCase()}
                            </Text>
                            <Text
                              className={
                                t(mode, "text-gray-500", "text-gray-400") +
                                " mt-1"
                              }
                            >
                              {o.total_amount.toLocaleString("vi-VN")} ₫ •
                              Items: {o.items.length}
                            </Text>
                          </View>
                        }
                        right={
                          <Ionicons
                            name="chevron-forward"
                            size={18}
                            color="#496c60"
                          />
                        }
                      />
                    </Pressable>
                  ))}
                </View>
              </CardPro>
            </View>
          )}
        />
      )}
    </ScreenPro>
  );
}
