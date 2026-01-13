import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  Text,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

import { t, useAdminTheme } from "../../components/admin/theme";
import {
  CardPro,
  MiniBtn,
  ScreenPro,
  SearchBox,
} from "../../components/admin/ui-pro";
import { EmptyState } from "../../components/admin/ux";

import type {
  OrderDTO,
  OrderStatus,
} from "../../services/admin/adminOrdersApi";
import {
  deleteAdminOrder,
  fetchAdminOrders,
} from "../../services/admin/adminOrdersApi";

type TabKey = "all" | OrderStatus;

function getErrMessage(err: any, fallback: string) {
  return err?.response?.data?.message || err?.message || fallback;
}

export default function AdminOrders() {
  const { mode } = useAdminTheme();

  const [q, setQ] = useState("");
  const [tab, setTab] = useState<TabKey>("all");

  const [items, setItems] = useState<OrderDTO[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const debRef = useRef<any>(null);

  const load = async (p = 1) => {
    setLoading(true);
    try {
      const res = await fetchAdminOrders({
        q,
        status: tab,
        page: p,
        limit: 30,
        sort: "-createdAt",
      });

      if (!res.success) {
        Toast.show({
          type: "error",
          text1: "Load failed",
          text2: res.message || "Không tải được orders",
        });
        return;
      }

      setItems((prev) => (p === 1 ? res.data : [...prev, ...res.data]));
      setPage(res.meta.page);
      setTotalPages(res.meta.totalPages);
    } catch (err: any) {
      Toast.show({
        type: "error",
        text1: "Load failed",
        text2: getErrMessage(err, "Không tải được orders"),
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // debounce search + tab change
  useEffect(() => {
    if (debRef.current) clearTimeout(debRef.current);
    debRef.current = setTimeout(() => load(1), 250);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, tab]);

  const remove = (id: string) => {
    Alert.alert("Xoá order?", "Không thể hoàn tác", [
      { text: "Huỷ", style: "cancel" },
      {
        text: "Xoá",
        style: "destructive",
        onPress: async () => {
          try {
            const r = await deleteAdminOrder(id);
            if (!r.success) {
              Toast.show({
                type: "error",
                text1: "Delete failed",
                text2: r.message || "Không xoá được order",
              });
              return;
            }
            Toast.show({
              type: "success",
              text1: "Success",
              text2: "Đã xoá order",
            });
            load(1);
          } catch (err: any) {
            Toast.show({
              type: "error",
              text1: "Delete failed",
              text2: getErrMessage(err, "Không xoá được order"),
            });
          }
        },
      },
    ]);
  };

  const badge = (s: OrderDTO["status"]) => {
    const base = "px-3 py-1 rounded-full font-extrabold text-xs";
    if (s === "paid")
      return (
        <Text className={base + " bg-green-100 text-green-700"}>PAID</Text>
      );
    if (s === "pending")
      return (
        <Text className={base + " bg-amber-100 text-amber-700"}>PENDING</Text>
      );
    if (s === "processing")
      return (
        <Text className={base + " bg-blue-100 text-blue-700"}>PROCESSING</Text>
      );
    if (s === "shipped")
      return (
        <Text className={base + " bg-indigo-100 text-indigo-700"}>SHIPPED</Text>
      );
    if (s === "delivered")
      return (
        <Text className={base + " bg-emerald-100 text-emerald-700"}>
          DELIVERED
        </Text>
      );
    return <Text className={base + " bg-red-100 text-red-700"}>CANCELLED</Text>;
  };

  const TabPill = ({ k, label }: { k: TabKey; label: string }) => {
    const on = tab === k;
    return (
      <Pressable
        onPress={() => setTab(k)}
        className={
          (on ? "bg-[#496c60]" : t(mode, "bg-gray-100", "bg-gray-900")) +
          " px-4 py-2 rounded-full"
        }
      >
        <Text
          className={
            (on ? "text-white" : t(mode, "text-gray-900", "text-white")) +
            " font-extrabold text-sm"
          }
        >
          {label}
        </Text>
      </Pressable>
    );
  };

  return (
    <ScreenPro title="Orders" subtitle="Quản lý đơn hàng">
      <SearchBox
        value={q}
        onChange={setQ}
        placeholder="Tìm theo id / user_id / payment"
      />

      <View className="px-5 pt-2">
        <View className="flex-row flex-wrap gap-2">
          <TabPill k="all" label="Tất cả" />
          <TabPill k="paid" label="Paid" />
          <TabPill k="pending" label="Pending" />
          <TabPill k="processing" label="Processing" />
          <TabPill k="shipped" label="Shipped" />
          <TabPill k="delivered" label="Delivered" />
          <TabPill k="cancelled" label="Cancelled" />
        </View>
      </View>

      {loading && items.length === 0 ? (
        <View className="py-8 items-center">
          <ActivityIndicator />
        </View>
      ) : items.length === 0 ? (
        <EmptyState title="Không có đơn" subtitle="Không có dữ liệu phù hợp." />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(x) => x._id}
          contentContainerStyle={{
            padding: 20,
            paddingTop: 12,
            paddingBottom: 60,
          }}
          onEndReached={() => {
            if (!loading && page < totalPages) load(page + 1);
          }}
          onEndReachedThreshold={0.4}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => router.push(`/(admin)/orders/${item._id}` as any)}
            >
              <CardPro className="mb-3">
                <View>
                  <Text
                    className={
                      t(mode, "text-gray-900", "text-white") + " font-extrabold"
                    }
                    numberOfLines={1}
                  >
                    #{item._id.slice(-6)} •{" "}
                    {String(item.payment_method || "").toUpperCase()}
                  </Text>

                  <Text
                    className={
                      t(mode, "text-gray-500", "text-gray-400") + " mt-1"
                    }
                  >
                    {Number(item.total_amount || 0).toLocaleString("vi-VN")} ₫ •
                    Items: {item.items?.length || 0}
                  </Text>

                  <Text
                    className={
                      t(mode, "text-gray-500", "text-gray-400") + " mt-1"
                    }
                    numberOfLines={1}
                  >
                    user: {item.user_id}
                  </Text>
                </View>

                <View className="flex-row justify-between items-center mt-4">
                  {badge(item.status)}
                  <MiniBtn
                    label="Xoá"
                    icon="trash-outline"
                    tone="danger"
                    onPress={() => remove(item._id)}
                  />
                </View>
              </CardPro>
            </Pressable>
          )}
        />
      )}
    </ScreenPro>
  );
}
