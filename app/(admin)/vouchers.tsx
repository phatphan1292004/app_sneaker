import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Alert, FlatList, Text, View } from "react-native";
import Toast from "react-native-toast-message";

import { t, useAdminTheme } from "../../components/admin/theme";
import {
  CardPro,
  FAB,
  Field,
  MiniBtn,
  ModalSheetPro,
  PrimaryBtn,
  ScreenPro,
  SearchBox,
} from "../../components/admin/ui-pro";
import { EmptyState } from "../../components/admin/ux";

import type {
  VoucherDTO,
  VoucherStatus,
  VoucherType,
} from "../../services/admin/adminVouchersApi";
import {
  createAdminVoucher,
  deleteAdminVoucher,
  fetchAdminVouchers,
  updateAdminVoucher,
} from "../../services/admin/adminVouchersApi";

const nowISO = () => new Date().toISOString();

function nfmt(v?: number) {
  if (v == null) return "—";
  return new Intl.NumberFormat("vi-VN").format(v);
}
function money(v?: number) {
  if (v == null) return "—";
  return nfmt(v) + " đ";
}
function dateShort(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("vi-VN");
  } catch {
    return iso;
  }
}
function parseNum(s: string) {
  if (!s) return 0;
  const n = Number(String(s).replace(/[^\d.]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

function getErrMessage(err: any, fallback: string) {
  return err?.response?.data?.message || err?.message || fallback;
}

function isExpiredByDate(v: VoucherDTO) {
  const end = +new Date(v.endAt);
  return Number.isFinite(end) ? end < Date.now() : false;
}
function effectiveStatus(v: VoucherDTO): VoucherStatus {
  return isExpiredByDate(v) ? "expired" : v.status;
}
function discountLine(v: VoucherDTO) {
  return v.type === "percent" ? `Giảm ${v.value}%` : `Giảm ${money(v.value)}`;
}
function condLine(v: VoucherDTO) {
  const parts: string[] = [];
  if (v.minOrder != null) parts.push(`Đơn tối thiểu ${money(v.minOrder)}`);
  if (v.type === "percent" && v.maxDiscount != null)
    parts.push(`Giảm tối đa ${money(v.maxDiscount)}`);
  if (v.usageLimit != null) parts.push(`Giới hạn ${nfmt(v.usageLimit)} lượt`);
  return parts.length ? parts.join(" • ") : "Không có điều kiện";
}

export default function VouchersScreen() {
  const { mode } = useAdminTheme();

  // list
  const [q, setQ] = useState("");
  const [tab, setTab] = useState<"all" | "active" | "expired">("all");

  const [items, setItems] = useState<VoucherDTO[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  // modal
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<VoucherDTO | null>(null);
  const [saving, setSaving] = useState(false);

  // form
  const [code, setCode] = useState("");
  const [type, setType] = useState<VoucherType>("percent");
  const [value, setValue] = useState("10");
  const [minOrder, setMinOrder] = useState("");
  const [maxDiscount, setMaxDiscount] = useState("");
  const [usageLimit, setUsageLimit] = useState("");
  const [startAt, setStartAt] = useState(nowISO());
  const [endAt, setEndAt] = useState("2026-06-01T00:00:00.000Z");

  const debRef = useRef<any>(null);

  const load = async (p = 1) => {
    setLoading(true);
    try {
      const res = await fetchAdminVouchers({
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
          text2: res.message || "Không tải được vouchers",
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
        text2: getErrMessage(err, "Không tải được vouchers"),
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  useEffect(() => {
    if (debRef.current) clearTimeout(debRef.current);
    debRef.current = setTimeout(() => load(1), 300);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  const resetForm = () => {
    setCode("");
    setType("percent");
    setValue("10");
    setMinOrder("");
    setMaxDiscount("");
    setUsageLimit("");
    setStartAt(nowISO());
    setEndAt("2026-06-01T00:00:00.000Z");
  };

  const startAdd = () => {
    setEditing(null);
    resetForm();
    setOpen(true);
  };

  const startEdit = (v: VoucherDTO) => {
    setEditing(v);
    setCode(v.code ?? "");
    setType(v.type ?? "percent");
    setValue(String(v.value ?? 0));
    setMinOrder(v.minOrder != null ? String(v.minOrder) : "");
    setMaxDiscount(v.maxDiscount != null ? String(v.maxDiscount) : "");
    setUsageLimit(v.usageLimit != null ? String(v.usageLimit) : "");
    setStartAt(v.startAt ?? nowISO());
    setEndAt(v.endAt ?? "2026-06-01T00:00:00.000Z");
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
    setEditing(null);
  };

  const save = async () => {
    const c = code.trim().toUpperCase();
    if (!c)
      return Alert.alert("Thiếu thông tin", "Vui lòng nhập mã voucher (code).");

    const vValue = parseNum(value);
    if (vValue <= 0)
      return Alert.alert("Sai dữ liệu", "Giá trị voucher phải > 0.");
    if (type === "percent" && vValue > 100)
      return Alert.alert("Sai dữ liệu", "Voucher percent tối đa là 100%.");

    const min = parseNum(minOrder);
    const max = parseNum(maxDiscount);
    const limit = parseNum(usageLimit);

    const endPast = +new Date(endAt) < Date.now();

    const nextStatus: VoucherStatus = endPast
      ? "expired"
      : editing
        ? editing.status
        : "active";

    const payload = {
      code: c,
      type,
      value: vValue,
      minOrder: min > 0 ? min : undefined,
      maxDiscount: type === "percent" && max > 0 ? max : undefined,
      usageLimit: limit > 0 ? limit : undefined,
      startAt,
      endAt,
      status: nextStatus,
      used: editing ? undefined : 0,
    };

    setSaving(true);
    try {
      const res = editing
        ? await updateAdminVoucher(editing._id, payload as any)
        : await createAdminVoucher(payload as any);

      if (!res.success) {
        Toast.show({
          type: "error",
          text1: "Save failed",
          text2: res.message || "Không lưu được voucher",
        });
        return;
      }

      Toast.show({
        type: "success",
        text1: "Success",
        text2: editing ? "Đã cập nhật voucher" : "Đã tạo voucher mới",
      });

      closeModal();
      load(1);
    } catch (err: any) {
      Toast.show({
        type: "error",
        text1: "Save failed",
        text2: getErrMessage(err, "Không lưu được voucher"),
      });
    } finally {
      setSaving(false);
    }
  };

  const remove = (id: string) => {
    Alert.alert("Xoá voucher?", "Hành động không thể hoàn tác", [
      { text: "Huỷ", style: "cancel" },
      {
        text: "Xoá",
        style: "destructive",
        onPress: async () => {
          try {
            const r = await deleteAdminVoucher(id);
            if (!r.success) {
              Toast.show({
                type: "error",
                text1: "Delete failed",
                text2: r.message || "Không xoá được voucher",
              });
              return;
            }
            Toast.show({
              type: "success",
              text1: "Success",
              text2: "Đã xoá voucher",
            });
            load(1);
          } catch (err: any) {
            Toast.show({
              type: "error",
              text1: "Delete failed",
              text2: getErrMessage(err, "Không xoá được voucher"),
            });
          }
        },
      },
    ]);
  };

  const toggleActive = async (v: VoucherDTO) => {
    const endPast = isExpiredByDate(v);
    const st = effectiveStatus(v);

    if (st === "expired") {
      if (endPast) {
        Alert.alert(
          "Voucher đã hết hạn",
          "Bạn không thể bật vì đã quá ngày hết hạn. Hãy sửa EndAt sang tương lai rồi bật lại."
        );
        return;
      }
      // bật
      try {
        const r = await updateAdminVoucher(v._id, { status: "active" } as any);
        if (!r.success) {
          Toast.show({
            type: "error",
            text1: "Update failed",
            text2: r.message || "Không cập nhật được",
          });
          return;
        }
        load(1);
      } catch (err: any) {
        Toast.show({
          type: "error",
          text1: "Update failed",
          text2: getErrMessage(err, "Không cập nhật được"),
        });
      }
      return;
    }

    // đang active -> tắt
    try {
      const r = await updateAdminVoucher(v._id, { status: "expired" } as any);
      if (!r.success) {
        Toast.show({
          type: "error",
          text1: "Update failed",
          text2: r.message || "Không cập nhật được",
        });
        return;
      }
      load(1);
    } catch (err: any) {
      Toast.show({
        type: "error",
        text1: "Update failed",
        text2: getErrMessage(err, "Không cập nhật được"),
      });
    }
  };

  const TabPill = ({
    k,
    label,
  }: {
    k: "all" | "active" | "expired";
    label: string;
  }) => {
    const on = tab === k;
    return (
      <View
        onTouchEnd={() => setTab(k)}
        className={
          (on ? "bg-[#496c60]" : t(mode, "bg-gray-100", "bg-gray-900")) +
          " px-4 py-2 rounded-full"
        }
        style={{ alignSelf: "flex-start" }}
      >
        <Text
          numberOfLines={1}
          className={
            (on ? "text-white" : t(mode, "text-gray-900", "text-white")) +
            " font-extrabold text-sm"
          }
        >
          {label}
        </Text>
      </View>
    );
  };

  return (
    <ScreenPro title="Vouchers" subtitle="Quản lý mã giảm giá">
      <SearchBox value={q} onChange={setQ} placeholder="Tìm theo code / id" />

      <View className="px-5 pt-2">
        <View className="flex-row gap-2 flex-nowrap">
          <TabPill k="all" label="Tất cả" />
          <TabPill k="active" label="Đang chạy" />
          <TabPill k="expired" label="Hết hạn" />
        </View>
      </View>

      {loading && items.length === 0 ? (
        <View className="py-8 items-center">
          <ActivityIndicator />
        </View>
      ) : items.length === 0 ? (
        <EmptyState
          title="Chưa có voucher"
          subtitle="Nhấn + để tạo voucher mới."
        />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(x) => x._id}
          onEndReached={() => {
            if (!loading && page < totalPages) load(page + 1);
          }}
          onEndReachedThreshold={0.4}
          contentContainerStyle={{
            padding: 20,
            paddingTop: 12,
            paddingBottom: 100,
          }}
          renderItem={({ item }) => {
            const st = effectiveStatus(item);
            const on = st === "active";

            return (
              <CardPro className="mb-3">
                <View>
                  <View className="flex-row items-center">
                    <Ionicons
                      name={
                        item.type === "percent" ? "pricetag" : "cash-outline"
                      }
                      size={18}
                      color={mode === "dark" ? "#A7F3D0" : "#496c60"}
                      style={{ marginRight: 6 }}
                    />
                    <Text
                      className={
                        t(mode, "text-gray-900", "text-white") +
                        " font-extrabold text-lg"
                      }
                      numberOfLines={2}
                    >
                      {item.code}
                    </Text>
                  </View>

                  <Text
                    className={
                      t(mode, "text-gray-700", "text-gray-300") + " mt-1"
                    }
                  >
                    {discountLine(item)}
                  </Text>

                  <Text
                    className={
                      t(mode, "text-gray-500", "text-gray-400") + " mt-1"
                    }
                    numberOfLines={2}
                  >
                    {condLine(item)}
                  </Text>

                  <Text
                    className={
                      t(mode, "text-gray-500", "text-gray-400") + " mt-1"
                    }
                  >
                    Đã dùng:{" "}
                    <Text
                      className={
                        t(mode, "text-gray-900", "text-white") + " font-bold"
                      }
                    >
                      {nfmt(item.used ?? 0)}
                      {item.usageLimit ? `/${nfmt(item.usageLimit)}` : ""}
                    </Text>
                    {"  "}•{"  "}
                    {dateShort(item.startAt)} → {dateShort(item.endAt)}
                  </Text>

                  <View className="mt-3">
                    <View
                      className={
                        (on
                          ? t(mode, "bg-green-50", "bg-green-950")
                          : t(mode, "bg-red-50", "bg-red-950")) +
                        " self-start px-3 py-2 rounded-full"
                      }
                    >
                      <Text
                        className={
                          (on
                            ? t(mode, "text-green-700", "text-green-300")
                            : t(mode, "text-red-700", "text-red-300")) +
                          " font-extrabold text-xs"
                        }
                      >
                        {on ? "ACTIVE" : "EXPIRED"}
                      </Text>
                    </View>
                  </View>
                </View>

                <View className="flex-row gap-2 mt-4">
                  <MiniBtn
                    label="Sửa"
                    icon="create-outline"
                    onPress={() => startEdit(item)}
                  />
                  <MiniBtn
                    label={on ? "Tắt" : "Bật"}
                    icon={
                      on ? "close-circle-outline" : "checkmark-circle-outline"
                    }
                    onPress={() => toggleActive(item)}
                  />
                  <MiniBtn
                    label="Xoá"
                    icon="trash-outline"
                    tone="danger"
                    onPress={() => remove(item._id)}
                  />
                </View>
              </CardPro>
            );
          }}
        />
      )}

      <FAB onPress={startAdd} />

      <ModalSheetPro
        visible={open}
        title={editing ? "Sửa voucher" : "Thêm voucher"}
        onClose={closeModal}
        footer={
          <PrimaryBtn
            label={
              saving ? "Đang lưu..." : editing ? "Lưu thay đổi" : "Tạo voucher"
            }
            onPress={save}
          />
        }
      >
        <Field
          label="Code"
          value={code}
          onChange={setCode}
          placeholder="VD: WELCOME10"
        />

        <View className="flex-row gap-2 mb-3">
          <View
            className={
              (type === "percent"
                ? "bg-[#496c60]"
                : t(mode, "bg-gray-100", "bg-gray-900")) +
              " flex-1 py-3 rounded-2xl items-center"
            }
            onTouchEnd={() => setType("percent")}
          >
            <Text
              className={
                (type === "percent"
                  ? "text-white"
                  : t(mode, "text-gray-900", "text-white")) + " font-extrabold"
              }
            >
              Percent (%)
            </Text>
          </View>

          <View
            className={
              (type === "fixed"
                ? "bg-[#496c60]"
                : t(mode, "bg-gray-100", "bg-gray-900")) +
              " flex-1 py-3 rounded-2xl items-center"
            }
            onTouchEnd={() => setType("fixed")}
          >
            <Text
              className={
                (type === "fixed"
                  ? "text-white"
                  : t(mode, "text-gray-900", "text-white")) + " font-extrabold"
              }
            >
              Fixed (đ)
            </Text>
          </View>
        </View>

        <Field
          label={type === "percent" ? "Giá trị (%)" : "Giá trị (đ)"}
          value={value}
          onChange={setValue}
          keyboardType="numeric"
          placeholder={type === "percent" ? "VD: 10" : "VD: 50000"}
        />

        <Field
          label="Min order (đ) (tuỳ chọn)"
          value={minOrder}
          onChange={setMinOrder}
          keyboardType="numeric"
          placeholder="VD: 300000"
        />

        {type === "percent" ? (
          <Field
            label="Max discount (đ) (tuỳ chọn)"
            value={maxDiscount}
            onChange={setMaxDiscount}
            keyboardType="numeric"
            placeholder="VD: 200000"
          />
        ) : null}

        <Field
          label="Usage limit (tuỳ chọn)"
          value={usageLimit}
          onChange={setUsageLimit}
          keyboardType="numeric"
          placeholder="VD: 500"
        />

        <Field
          label="StartAt (ISO)"
          value={startAt}
          onChange={setStartAt}
          placeholder={nowISO()}
        />
        <Field
          label="EndAt (ISO)"
          value={endAt}
          onChange={setEndAt}
          placeholder="2026-06-01T00:00:00.000Z"
        />
      </ModalSheetPro>
    </ScreenPro>
  );
}
