import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import { Alert, FlatList, Pressable, Text, View } from "react-native";

import { useAdminStore } from "../../components/admin/AdminStore";
import { t, useAdminTheme } from "../../components/admin/theme";
import {
  CardPro,
  MiniBtn,
  ScreenPro,
  SearchBox,
} from "../../components/admin/ui-pro";
import { EmptyState } from "../../components/admin/ux";
import type { Order } from "../../types/admin";

type TabKey = "all" | "paid" | "pending" | "cancelled";

export default function AdminOrders() {
  const { state, actions } = useAdminStore();
  const { mode } = useAdminTheme();

  const [q, setQ] = useState("");
  const [tab, setTab] = useState<TabKey>("all");

  /* ===== FILTER LIST ===== */
  const list = useMemo(() => {
    const k = q.trim().toLowerCase();

    return state.orders
      .filter((o) => (tab === "all" ? true : o.status === tab))
      .filter((o) => {
        if (!k) return true;
        return [o._id, o.payment_method, o.user_id]
          .join(" ")
          .toLowerCase()
          .includes(k);
      })
      .sort(
        (a, b) => (+new Date(b.createdAt) || 0) - (+new Date(a.createdAt) || 0)
      );
  }, [q, tab, state.orders]);

  const remove = (id: string) => {
    Alert.alert("Xoá order?", "Không thể hoàn tác", [
      { text: "Huỷ", style: "cancel" },
      {
        text: "Xoá",
        style: "destructive",
        onPress: () => actions.removeOrder(id),
      },
    ]);
  };

  /* ===== BADGE ===== */
  const badge = (s: Order["status"]) => {
    const base = "px-3 py-1 rounded-full font-extrabold text-xs";
    if (s === "paid")
      return (
        <Text className={base + " bg-green-100 text-green-700"}>PAID</Text>
      );
    if (s === "pending")
      return (
        <Text className={base + " bg-amber-100 text-amber-700"}>PENDING</Text>
      );
    return <Text className={base + " bg-red-100 text-red-700"}>CANCELLED</Text>;
  };

  /* ===== TAB ===== */
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
        placeholder="Tìm theo id / user_id"
      />

      {/* ===== TABS ===== */}
      <View className="px-5 pt-2">
        <View className="flex-row gap-2">
          <TabPill k="all" label="Tất cả" />
          <TabPill k="paid" label="Paid" />
          <TabPill k="pending" label="Pending" />
          <TabPill k="cancelled" label="Cancelled" />
        </View>
      </View>

      {list.length === 0 ? (
        <EmptyState title="Không có đơn" subtitle="Không có dữ liệu phù hợp." />
      ) : (
        <FlatList
          data={list}
          keyExtractor={(x) => x._id}
          contentContainerStyle={{
            padding: 20,
            paddingTop: 12,
            paddingBottom: 60,
          }}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => router.push(`/(admin)/orders/${item._id}` as any)}
            >
              <CardPro className="mb-3">
                {/* ===== INFO ===== */}
                <View>
                  <Text
                    className={
                      t(mode, "text-gray-900", "text-white") + " font-extrabold"
                    }
                    numberOfLines={1}
                  >
                    #{item._id.slice(-6)} • {item.payment_method.toUpperCase()}
                  </Text>

                  <Text
                    className={
                      t(mode, "text-gray-500", "text-gray-400") + " mt-1"
                    }
                  >
                    {item.total_amount.toLocaleString("vi-VN")} ₫ • Items:{" "}
                    {item.items.length}
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

                {/* ===== STATUS + ACTION ===== */}
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
