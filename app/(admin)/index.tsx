import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import Toast from "react-native-toast-message";

import { t, useAdminTheme } from "../../components/admin/theme";
import {
  CardPro,
  MiniBtn,
  Row,
  ScreenPro,
} from "../../components/admin/ui-pro";
import { SkeletonCard } from "../../components/admin/ux";

import {
  fetchAdminDashboard,
  type DashboardDTO,
} from "../../services/admin/adminDashboardApi";

function getErrMessage(err: any, fallback: string) {
  return err?.response?.data?.message || err?.message || fallback;
}

export default function AdminDashboard() {
  const { mode } = useAdminTheme();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DashboardDTO | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetchAdminDashboard({ days: 7 });
      if (!res.success || !res.data) {
        setData(null);
        Toast.show({
          type: "error",
          text1: "Load failed",
          text2: res.message || "Không tải được dashboard",
        });
        return;
      }
      setData(res.data);
    } catch (err: any) {
      setData(null);
      Toast.show({
        type: "error",
        text1: "Load failed",
        text2: getErrMessage(err, "Không tải được dashboard"),
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const stats = useMemo(() => {
    const s = data?.stats;
    return [
      { label: "Users", value: s?.users ?? 0, icon: "people-outline" as const },
      {
        label: "Brands",
        value: s?.brands ?? 0,
        icon: "pricetag-outline" as const,
      },
      {
        label: "Products",
        value: s?.products ?? 0,
        icon: "cube-outline" as const,
      },
      {
        label: "Orders",
        value: s?.orders ?? 0,
        icon: "receipt-outline" as const,
      },
    ];
  }, [data]);

  const chart = useMemo(() => data?.revenueLastDays ?? [], [data]);

  const topSelling = useMemo(() => data?.topSelling ?? [], [data]);
  const recentOrders = useMemo(() => data?.recentOrders ?? [], [data]);

  return (
    <ScreenPro title="Admin" subtitle="Dashboard">
      {loading ? (
        <View className="pt-4">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </View>
      ) : !data ? (
        <View className="px-5 pt-4">
          <CardPro>
            <Text
              className={
                t(mode, "text-gray-900", "text-white") +
                " font-extrabold text-lg"
              }
            >
              Không có dữ liệu dashboard
            </Text>
            <Text
              className={t(mode, "text-gray-500", "text-gray-400") + " mt-2"}
            >
              Kiểm tra API GET /admin/dashboard
            </Text>

            <View className="mt-4">
              <MiniBtn label="Reload" icon="refresh" onPress={load} />
            </View>
          </CardPro>
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
                  right={
                    <MiniBtn label="Reload" icon="refresh" onPress={load} />
                  }
                />
                <Text
                  className={
                    t(mode, "text-gray-900", "text-white") +
                    " text-3xl font-extrabold mt-3"
                  }
                >
                  {Number(data.revenuePaid || 0).toLocaleString("vi-VN")} ₫
                </Text>
                <Text
                  className={
                    t(mode, "text-gray-500", "text-gray-400") + " mt-1"
                  }
                >
                  Tổng doanh thu (paid/shipped/delivered)
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
                      Revenue last {chart.length || 7} days
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
                  {chart.map((c, idx) => {
                    // scale height cho đẹp (không cần chính xác tuyệt đối)
                    const h = Math.max(
                      8,
                      Math.min(90, Math.round((c.total || 0) / 200000))
                    );
                    return (
                      <View key={c.date + idx} className="flex-1 items-center">
                        <View
                          className="w-3 rounded-full bg-[#496c60]"
                          style={{ height: 10 + h, opacity: 0.9 }}
                        />
                        <View
                          className={
                            t(mode, "bg-gray-200", "bg-gray-900") +
                            " h-1 w-4 rounded-full mt-2"
                          }
                        />
                      </View>
                    );
                  })}
                </View>
                <Text
                  className={
                    t(mode, "text-gray-500", "text-gray-400") + " mt-3"
                  }
                >
                  Chart lấy từ server: /admin/dashboard
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
                              {Number(p.base_price).toLocaleString("vi-VN")} ₫
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
                              #{o._id.slice(-6)} •{" "}
                              {String(o.status).toUpperCase()}
                            </Text>
                            <Text
                              className={
                                t(mode, "text-gray-500", "text-gray-400") +
                                " mt-1"
                              }
                            >
                              {Number(o.total_amount).toLocaleString("vi-VN")} ₫
                              • Items: {o.items?.length ?? 0}
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
