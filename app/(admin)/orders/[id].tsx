import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Pressable,
  Text,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

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
import {
  fetchAdminOrderById,
  OrderStatus,
  updateAdminOrderStatus,
  type OrderDTO,
} from "../../../services/admin/adminOrdersApi";

const STATUSES: OrderStatus[] = [
  "pending",
  "paid",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

function getErrMessage(err: any, fallback: string) {
  return err?.response?.data?.message || err?.message || fallback;
}

export default function OrderDetail() {
  const { mode } = useAdminTheme();
  const params = useLocalSearchParams();
  const idRaw: any = (params as any)?.id;
  const id = String(Array.isArray(idRaw) ? idRaw[0] : idRaw || "").trim();

  const [order, setOrder] = useState<OrderDTO | null>(null);
  const [loading, setLoading] = useState(false);

  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const totalItems = useMemo(
    () =>
      order?.items?.reduce((s, it) => s + (Number(it.quantity) || 0), 0) ?? 0,
    [order],
  );

  const load = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const res = await fetchAdminOrderById(id);
      if (!res.success || !res.data) {
        setOrder(null);
        return;
      }
      setOrder(res.data);
    } catch (err: any) {
      Toast.show({
        type: "error",
        text1: "Load failed",
        text2: getErrMessage(err, "Không tải được đơn hàng"),
      });
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [id]);

  const shipText = useMemo(() => {
    const s = order?.shipping_address;
    if (!s) return "-";
    return `${s.street}, ${s.ward}, ${s.district}, ${s.province}, ${s.country}`;
  }, [order]);

  const changeStatus = async (status: OrderDTO["status"]) => {
    if (!order) return;
    setSaving(true);
    try {
      const res = await updateAdminOrderStatus(order._id, status);
      if (!res.success || !res.data) {
        Toast.show({
          type: "error",
          text1: "Update failed",
          text2: res.message || "Không cập nhật được status",
        });
        return;
      }
      setOrder(res.data);
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Đã cập nhật status",
      });
      setOpen(false);
    } catch (err: any) {
      Toast.show({
        type: "error",
        text1: "Update failed",
        text2: getErrMessage(err, "Không cập nhật được status"),
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading && !order) {
    return (
      <ScreenPro title="Order detail" subtitle="Loading...">
        <View className="py-8 items-center">
          <ActivityIndicator />
        </View>
      </ScreenPro>
    );
  }

  if (!order) {
    return (
      <ScreenPro
        title="Order detail"
        subtitle="Not found"
        right={
          <MiniBtn
            label="Back"
            icon="arrow-back"
            onPress={() => router.replace("/(admin)/orders")}
          />
        }
      >
        <EmptyState
          title="Không tìm thấy đơn hàng"
          subtitle="Do màn này đang fetch theo id. Kiểm tra API /admin/orders/:id."
        />
      </ScreenPro>
    );
  }

  return (
    <ScreenPro
      title="Order detail"
      subtitle={`#${order._id.slice(-6)} • ${String(order.status).toUpperCase()}`}
      right={
        <MiniBtn
          label="Back"
          icon="arrow-back"
          onPress={() => router.replace("/(admin)/orders")}
        />
      }
    >
      <FlatList
        data={[
          { key: "header" },
          ...(order.items || []).map(
            (x, idx) => ({ key: String(idx), item: x }) as any,
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
                          Tổng:{" "}
                          {Number(order.total_amount).toLocaleString("vi-VN")} ₫
                        </Text>
                        <Text
                          className={
                            t(mode, "text-gray-500", "text-gray-400") + " mt-1"
                          }
                        >
                          Items: {totalItems} • Payment:{" "}
                          {String(order.payment_method || "").toUpperCase()}
                        </Text>
                        <Text
                          className={
                            t(mode, "text-gray-500", "text-gray-400") + " mt-1"
                          }
                          numberOfLines={2}
                        >
                          Ship: {shipText}
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
                    Danh sách sản phẩm trong đơn
                  </Text>
                </CardPro>
              </View>
            );
          }

          const it = item.item as OrderDTO["items"][number];

          const p = typeof it.product_id === "string" ? null : it.product_id;
          const v = typeof it.variant_id === "string" ? null : it.variant_id;

          const img = p?.images?.[0];

          return (
            <CardPro className="mb-3">
              <View className="flex-row">
                <View
                  className={
                    t(mode, "bg-gray-100", "bg-gray-900") +
                    " w-14 h-14 rounded-2xl overflow-hidden mr-3"
                  }
                >
                  {!!img && (
                    <Image
                      source={{ uri: img }}
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
                    {p?.name || "Unknown product"}
                  </Text>

                  <Text
                    className={
                      t(mode, "text-gray-500", "text-gray-400") + " mt-1"
                    }
                  >
                    Màu: {v?.color || "-"} • Size: {v?.size || "-"} • Qty:{" "}
                    {it.quantity}
                  </Text>

                  <Text
                    className={
                      t(mode, "text-gray-500", "text-gray-400") + " mt-1"
                    }
                  >
                    {Number(it.price).toLocaleString("vi-VN")} ₫
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
        footer={
          <PrimaryBtn
            label={saving ? "Đang lưu..." : "Đóng"}
            onPress={() => setOpen(false)}
          />
        }
      >
        {STATUSES.map((s) => (
          <Pressable
            key={s}
            disabled={saving}
            onPress={() => {
              Alert.alert("Đổi status?", `Chuyển sang ${s.toUpperCase()}?`, [
                { text: "Huỷ", style: "cancel" },
                { text: "OK", onPress: () => changeStatus(s) },
              ]);
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
