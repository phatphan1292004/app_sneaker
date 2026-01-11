import { Ionicons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import { Alert, FlatList, Text, View } from "react-native";
import { useAdminStore } from "../../components/admin/AdminStore";
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
import type { Voucher, VoucherType } from "../../types/admin";

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

function isExpiredByDate(v: Voucher) {
  const end = +new Date(v.endAt);
  return Number.isFinite(end) ? end < Date.now() : false;
}

// ✅ status hiển thị: nếu quá endAt => luôn expired, còn không => theo v.status (bật/tắt thủ công)
function effectiveStatus(v: Voucher): "active" | "expired" {
  return isExpiredByDate(v) ? "expired" : v.status;
}

function discountLine(v: Voucher) {
  return v.type === "percent" ? `Giảm ${v.value}%` : `Giảm ${money(v.value)}`;
}

function condLine(v: Voucher) {
  const parts: string[] = [];
  if (v.minOrder != null) parts.push(`Đơn tối thiểu ${money(v.minOrder)}`);
  if (v.type === "percent" && v.maxDiscount != null)
    parts.push(`Giảm tối đa ${money(v.maxDiscount)}`);
  if (v.usageLimit != null) parts.push(`Giới hạn ${nfmt(v.usageLimit)} lượt`);
  return parts.length ? parts.join(" • ") : "Không có điều kiện";
}

export default function VouchersScreen() {
  const { state, actions } = useAdminStore();
  const { mode } = useAdminTheme();

  const [q, setQ] = useState("");
  const [tab, setTab] = useState<"all" | "active" | "expired">("all");

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Voucher | null>(null);

  // form
  const [code, setCode] = useState("");
  const [type, setType] = useState<VoucherType>("percent");
  const [value, setValue] = useState("10");
  const [minOrder, setMinOrder] = useState("");
  const [maxDiscount, setMaxDiscount] = useState("");
  const [usageLimit, setUsageLimit] = useState("");
  const [startAt, setStartAt] = useState(nowISO());
  const [endAt, setEndAt] = useState("2026-06-01T00:00:00.000Z");

  const list = useMemo(() => {
    const k = q.trim().toLowerCase();
    const base = state.vouchers ?? [];

    return base
      .filter((v) => (tab === "all" ? true : effectiveStatus(v) === tab))
      .filter((v) => {
        if (!k) return true;
        return [v.code, v._id].some((x) => x.toLowerCase().includes(k));
      })
      .sort(
        (a, b) => (+new Date(b.createdAt) || 0) - (+new Date(a.createdAt) || 0)
      );
  }, [q, tab, state.vouchers]);

  const startAdd = () => {
    setEditing(null);
    setCode("");
    setType("percent");
    setValue("10");
    setMinOrder("");
    setMaxDiscount("");
    setUsageLimit("");
    setStartAt(nowISO());
    setEndAt("2026-06-01T00:00:00.000Z");
    setOpen(true);
  };

  const startEdit = (v: Voucher) => {
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

  const save = () => {
    const c = code.trim().toUpperCase();
    if (!c) {
      Alert.alert("Thiếu thông tin", "Vui lòng nhập mã voucher (code).");
      return;
    }

    const vValue = parseNum(value);
    if (vValue <= 0) {
      Alert.alert("Sai dữ liệu", "Giá trị voucher phải > 0.");
      return;
    }
    if (type === "percent" && vValue > 100) {
      Alert.alert("Sai dữ liệu", "Voucher percent tối đa là 100%.");
      return;
    }

    const min = parseNum(minOrder);
    const max = parseNum(maxDiscount);
    const limit = parseNum(usageLimit);

    // trùng code (trừ chính nó khi edit)
    const dup = (state.vouchers ?? []).some(
      (v) => v.code.toUpperCase() === c && v._id !== editing?._id
    );
    if (dup) {
      Alert.alert("Trùng code", "Code voucher đã tồn tại. Hãy chọn code khác.");
      return;
    }

    const endPast = +new Date(endAt) < Date.now();

    // ✅ status: nếu đã quá hạn -> expired; nếu chưa quá hạn -> giữ status cũ khi edit, tạo mới thì active
    const nextStatus: "active" | "expired" = endPast
      ? "expired"
      : editing
        ? editing.status
        : "active";

    const payload: Omit<Voucher, "_id" | "createdAt" | "updatedAt"> = {
      code: c,
      type,
      value: vValue,
      minOrder: min > 0 ? min : undefined,
      maxDiscount: type === "percent" && max > 0 ? max : undefined,
      usageLimit: limit > 0 ? limit : undefined,
      used: editing ? undefined : 0,
      startAt,
      endAt,
      status: nextStatus,
    };

    if (editing) actions.updateVoucher(editing._id, payload);
    else actions.addVoucher(payload);

    closeModal();
  };

  const remove = (id: string) => {
    Alert.alert("Xoá voucher?", "Hành động không thể hoàn tác", [
      { text: "Huỷ", style: "cancel" },
      {
        text: "Xoá",
        style: "destructive",
        onPress: () => actions.removeVoucher(id),
      },
    ]);
  };

  // ✅ Bật/tắt hoạt động
  const toggleActive = (v: Voucher) => {
    const endPast = isExpiredByDate(v);
    const statusNow = effectiveStatus(v);

    if (statusNow === "expired") {
      // đang hết hạn -> muốn bật
      if (endPast) {
        Alert.alert(
          "Voucher đã hết hạn",
          "Bạn không thể bật vì đã quá ngày hết hạn. Hãy sửa EndAt sang tương lai rồi bật lại."
        );
        return;
      }
      actions.updateVoucher(v._id, { status: "active" });
      return;
    }

    // đang active -> tắt
    actions.updateVoucher(v._id, { status: "expired" });
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

      {list.length === 0 ? (
        <EmptyState
          title="Chưa có voucher"
          subtitle="Nhấn + để tạo voucher mới."
        />
      ) : (
        <FlatList
          data={list}
          keyExtractor={(x) => x._id}
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
                {/* ===== INFO ===== */}
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

                  {/* STATUS */}
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

                {/* ===== ACTIONS (DƯỚI) ===== */}
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
            label={editing ? "Lưu thay đổi" : "Tạo voucher"}
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

        {/* Type */}
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
