import { router, useLocalSearchParams } from "expo-router";
import React, { useMemo, useState } from "react";
import { FlatList, Image, Pressable, Text, View } from "react-native";

import { useAdminStore } from "../../../components/admin/AdminStore";
import { t, useAdminTheme } from "../../../components/admin/theme";
import {
  CardPro,
  MiniBtn,
  ModalSheetPro,
  PrimaryBtn,
  Row,
  ScreenPro,
} from "../../../components/admin/ui-pro";
import { EmptyState } from "../../../components/admin/ux";
import type { Order } from "../../../types/admin";

const STATUSES: Order["status"][] = [
  "pending",
  "paid",
  "shipping",
  "delivered",
  "cancelled",
];

export default function OrderDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { state, actions } = useAdminStore();
  const { mode } = useAdminTheme();

  const order = state.orders.find((o) => o._id === id);
  const [open, setOpen] = useState(false);

  const totalItems = useMemo(
    () => order?.items.reduce((s, it) => s + it.qty, 0) ?? 0,
    [order]
  );

  if (!order) {
    return (
      <ScreenPro title="Order detail" subtitle="Not found">
        <EmptyState
          title="Không tìm thấy đơn hàng"
          subtitle="Quay lại danh sách."
        />
      </ScreenPro>
    );
  }

  return (
    <ScreenPro
      title="Order detail"
      subtitle={`#${order._id.slice(-6)} • ${order.status.toUpperCase()}`}
      right={
        <MiniBtn label="Back" icon="arrow-back" onPress={() => router.back()} />
      }
    >
      <FlatList
        data={[
          { key: "header" },
          ...order.items.map(
            (x, idx) => ({ key: String(idx), item: x }) as any
          ),
        ]}
        keyExtractor={(x: any) => x.key}
        contentContainerStyle={{ padding: 20, paddingBottom: 80 }}
        renderItem={({ item }: any) => {
          if (item.key === "header") {
            return (
              <View>
                <CardPro className="mb-3">
                  <Row
                    left={
                      <View>
                        <Text
                          className={
                            t(mode, "text-gray-900", "text-white") +
                            " font-extrabold text-lg"
                          }
                        >
                          Tổng: {order.total_amount.toLocaleString("vi-VN")} ₫
                        </Text>
                        <Text
                          className={
                            t(mode, "text-gray-500", "text-gray-400") + " mt-1"
                          }
                        >
                          Items: {totalItems} • Payment:{" "}
                          {order.payment_method.toUpperCase()}
                        </Text>
                        <Text
                          className={
                            t(mode, "text-gray-500", "text-gray-400") + " mt-1"
                          }
                          numberOfLines={2}
                        >
                          Ship: {order.shipping_address?.address || "-"}
                        </Text>
                      </View>
                    }
                    right={
                      <MiniBtn
                        label="Status"
                        icon="swap-horizontal"
                        onPress={() => setOpen(true)}
                      />
                    }
                  />
                </CardPro>

                <CardPro className="mb-3">
                  <Text
                    className={
                      t(mode, "text-gray-900", "text-white") +
                      " font-extrabold text-lg"
                    }
                  >
                    Items
                  </Text>
                  <Text
                    className={
                      t(mode, "text-gray-500", "text-gray-400") + " mt-1"
                    }
                  >
                    Xem danh sách sản phẩm trong đơn
                  </Text>
                </CardPro>
              </View>
            );
          }

          const it = item.item;
          return (
            <CardPro className="mb-3">
              <View className="flex-row">
                <View
                  className={
                    t(mode, "bg-gray-100", "bg-gray-900") +
                    " w-16 h-16 rounded-2xl overflow-hidden mr-3"
                  }
                >
                  {!!it.image && (
                    <Image
                      source={{ uri: it.image }}
                      style={{ width: "100%", height: "100%" }}
                      resizeMode="cover"
                    />
                  )}
                </View>
                <View className="flex-1">
                  <Text
                    className={
                      t(mode, "text-gray-900", "text-white") + " font-extrabold"
                    }
                    numberOfLines={1}
                  >
                    {it.name}
                  </Text>
                  <Text
                    className={
                      t(mode, "text-gray-500", "text-gray-400") + " mt-1"
                    }
                  >
                    Qty: {it.qty} • {it.price.toLocaleString("vi-VN")} ₫
                  </Text>
                  <Text
                    className={
                      t(mode, "text-gray-500", "text-gray-400") + " mt-1"
                    }
                    numberOfLines={1}
                  >
                    product: {it.product_id.slice(-6)} • variant:{" "}
                    {it.variant_id.slice(-6)}
                  </Text>
                </View>
              </View>
            </CardPro>
          );
        }}
      />

      <ModalSheetPro
        visible={open}
        title="Update status"
        onClose={() => setOpen(false)}
        footer={<PrimaryBtn label="Đóng" onPress={() => setOpen(false)} />}
      >
        {STATUSES.map((s) => (
          <Pressable
            key={s}
            onPress={() => {
              actions.updateOrder(order._id, { status: s });
              setOpen(false);
            }}
            className={
              t(mode, "border-gray-200", "border-gray-900") +
              " border rounded-2xl px-4 py-4 mb-2"
            }
          >
            <Text
              className={
                t(mode, "text-gray-900", "text-white") + " font-extrabold"
              }
            >
              {s.toUpperCase()}
            </Text>
          </Pressable>
        ))}
      </ModalSheetPro>
    </ScreenPro>
  );
}
