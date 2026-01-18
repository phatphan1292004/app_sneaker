import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Text,
  TextInput,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

import { t, useAdminTheme } from "../../../components/admin/theme";
import {
  CardPro,
  FAB,
  MiniBtn,
  ModalSheetPro,
  PrimaryBtn,
  Row,
  ScreenPro,
} from "../../../components/admin/ui-pro";
import { EmptyState } from "../../../components/admin/ux";

import type { ProductDTO } from "../../../services/admin/adminProductsApi";
import { fetchAdminProductById } from "../../../services/admin/adminProductsApi";

import type { VariantDTO } from "../../../services/admin/adminVariantsApi";
import {
  createAdminVariant,
  deleteAdminVariant,
  fetchAdminVariants,
  updateAdminVariant,
} from "../../../services/admin/adminVariantsApi";

/** helpers */
function safeTrim(v: any) {
  const s = String(v ?? "").trim();
  return s.length ? s : "";
}
function getErrMessage(err: any, fallback: string) {
  return err?.response?.data?.message || err?.message || fallback;
}

type FormErrors = Partial<Record<"color" | "size" | "stock" | "price", string>>;

function FieldPro({
  label,
  value,
  onChange,
  placeholder,
  keyboardType,
  multiline,
  error,
  helper,
}: {
  label: string;
  value: string;
  onChange: (s: string) => void;
  placeholder?: string;
  keyboardType?: any;
  multiline?: boolean;
  error?: string;
  helper?: string;
}) {
  const { mode } = useAdminTheme();
  const isErr = !!error;

  const baseWrap =
    t(
      mode,
      "bg-gray-50 border border-gray-200",
      "bg-gray-950 border border-gray-900",
    ) + " rounded-2xl px-4 py-3 flex-row items-center";

  const errBorder = mode === "dark" ? " border-red-700" : " border-red-500";

  return (
    <View className="mb-3">
      <Text
        className={
          t(mode, "text-gray-700", "text-gray-300") + " font-bold mb-2"
        }
      >
        {label}
      </Text>

      <View className={baseWrap + (isErr ? errBorder : "")}>
        <TextInput
          value={value}
          onChangeText={onChange}
          placeholder={placeholder}
          placeholderTextColor={mode === "dark" ? "#6b7280" : "#9ca3af"}
          keyboardType={keyboardType}
          multiline={multiline}
          className={t(mode, "text-gray-900", "text-white") + " flex-1"}
        />
        {isErr ? (
          <Ionicons
            name="alert-circle"
            size={18}
            color={mode === "dark" ? "#fca5a5" : "#dc2626"}
          />
        ) : null}
      </View>

      {!!helper && !isErr && (
        <Text className={t(mode, "text-gray-500", "text-gray-400") + " mt-1"}>
          {helper}
        </Text>
      )}

      {!!error && (
        <Text
          className={
            (mode === "dark" ? "text-red-300" : "text-red-600") + " mt-1"
          }
        >
          {error}
        </Text>
      )}
    </View>
  );
}

export default function ProductDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { mode } = useAdminTheme();

  const [product, setProduct] = useState<ProductDTO | null>(null);
  const [variants, setVariants] = useState<VariantDTO[]>([]);
  const [loading, setLoading] = useState(false);

  // modal
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<VariantDTO | null>(null);

  // form
  const [color, setColor] = useState("");
  const [size, setSize] = useState("40");
  const [stock, setStock] = useState("10");
  const [price, setPrice] = useState("3200000");
  const [errors, setErrors] = useState<FormErrors>({});
  const [saving, setSaving] = useState(false);

  const resetForm = () => {
    setColor("");
    setSize("40");
    setStock("10");
    setPrice(String(product?.base_price ?? 0));
    setErrors({});
  };

  const closeModal = () => {
    setOpen(false);
    setEditing(null);
    resetForm();
  };

  const load = async () => {
    if (!id) return;
    setLoading(true);
    try {
      // ✅ product
      const pr = await fetchAdminProductById(id);
      if (!pr.success || !pr.data) {
        setProduct(null);
      } else {
        setProduct(pr.data);
      }

      // ✅ variants
      const vr = await fetchAdminVariants(id);
      if (vr.success) setVariants(vr.data);
      else setVariants([]);
    } catch (err: any) {
      Toast.show({
        type: "error",
        text1: "Load failed",
        text2: getErrMessage(err, "Không tải được dữ liệu"),
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [id]);

  const startAdd = () => {
    setEditing(null);
    resetForm();
    setOpen(true);
  };

  const startEdit = (v: VariantDTO) => {
    setEditing(v);
    setColor(v.color || "");
    setSize(String(v.size ?? ""));
    setStock(String(v.stock ?? 0));
    setPrice(String(v.price ?? 0));
    setErrors({});
    setOpen(true);
  };

  const save = async () => {
    if (!id) return;
    const isEdit = !!editing;

    setSaving(true);
    setErrors({});

    const payload = {
      color: safeTrim(color),
      size: safeTrim(size),
      stock: Number(stock) || 0,
      price: Number(price) || 0,
    };

    // validate client
    const newErr: FormErrors = {};
    if (!payload.color) newErr.color = "Vui lòng nhập color";
    if (!payload.size) newErr.size = "Vui lòng nhập size";
    if (payload.price <= 0) newErr.price = "Price phải > 0";

    if (Object.keys(newErr).length) {
      setErrors(newErr);
      setSaving(false);
      return;
    }

    try {
      const res = isEdit
        ? await updateAdminVariant(editing!._id, payload)
        : await createAdminVariant(id, payload);

      if (!res.success) {
        const field = res.field as keyof FormErrors | undefined;
        const msg = res.message || "Variant bị trùng";

        if (field) {
          setErrors({ [field]: msg }); // ✅ hiển thị đúng ô Size
        } else {
          Toast.show({
            type: "error",
            text1: "Lỗi",
            text2: msg,
          });
        }
        return;
      }

      Toast.show({
        type: "success",
        text1: "Success",
        text2: isEdit ? "Đã cập nhật variant" : "Đã tạo variant mới",
      });

      closeModal();
      load();
    } catch (err: any) {
      const msg = getErrMessage(
        err,
        isEdit ? "Không cập nhật được variant" : "Không tạo được variant",
      );
      const fieldFromServer = err?.response?.data?.field as
        | keyof FormErrors
        | undefined;
      setErrors(fieldFromServer ? { [fieldFromServer]: msg } : { color: msg });
    } finally {
      setSaving(false);
    }
  };

  const remove = (vid: string) => {
    Alert.alert("Xoá variant?", "Không thể hoàn tác", [
      { text: "Huỷ", style: "cancel" },
      {
        text: "Xoá",
        style: "destructive",
        onPress: async () => {
          try {
            const r = await deleteAdminVariant(vid);
            if (!r.success) {
              Toast.show({
                type: "error",
                text1: "Delete failed",
                text2: r.message || "Không xoá được variant",
              });
              return;
            }

            Toast.show({
              type: "success",
              text1: "Success",
              text2: "Đã xoá variant",
            });
            load();
          } catch (err: any) {
            Toast.show({
              type: "error",
              text1: "Delete failed",
              text2: getErrMessage(err, "Không xoá được variant"),
            });
          }
        },
      },
    ]);
  };

  if (loading && !product) {
    return (
      <ScreenPro title="Product detail" subtitle="Loading...">
        <View className="py-8 items-center">
          <ActivityIndicator />
        </View>
      </ScreenPro>
    );
  }

  if (!product) {
    return (
      <ScreenPro title="Product" subtitle="Not found">
        <EmptyState
          title="Không tìm thấy product"
          subtitle="Quay lại danh sách."
        />
      </ScreenPro>
    );
  }

  return (
    <ScreenPro
      title="Product detail"
      subtitle={product._id.slice(-6)}
      right={
        <MiniBtn
          label="Back"
          icon="arrow-back"
          onPress={() => router.replace("/(admin)/products")}
        />
      }
    >
      <FlatList
        data={[
          { key: "header" },
          ...variants.map((v) => ({ key: v._id, v }) as any),
        ]}
        keyExtractor={(x: any) => x.key}
        contentContainerStyle={{ padding: 20, paddingBottom: 110 }}
        renderItem={({ item }: any) => {
          if (item.key === "header") {
            return (
              <View>
                <CardPro className="mb-3">
                  <View className="flex-row">
                    <View
                      className={
                        t(mode, "bg-gray-100", "bg-gray-900") +
                        " w-20 h-20 rounded-2xl overflow-hidden mr-3"
                      }
                    >
                      {!!product.images?.[0] && (
                        <Image
                          source={{ uri: product.images[0] }}
                          style={{ width: "100%", height: "100%" }}
                          resizeMode="cover"
                        />
                      )}
                    </View>

                    <View className="flex-1">
                      <Text
                        className={
                          t(mode, "text-gray-900", "text-white") +
                          " font-extrabold text-lg"
                        }
                        numberOfLines={2}
                      >
                        {product.name}
                      </Text>

                      <Text
                        className={
                          t(mode, "text-gray-500", "text-gray-400") + " mt-2"
                        }
                        numberOfLines={2}
                      >
                        {product.description}
                      </Text>

                      <Text
                        className={
                          t(mode, "text-gray-500", "text-gray-400") + " mt-2"
                        }
                      >
                        Price:{" "}
                        {Number(product.base_price).toLocaleString("vi-VN")} ₫ •
                        Discount: {product.discount}% • Sold: {product.sold}
                      </Text>
                    </View>
                  </View>
                </CardPro>

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
                          Variants
                        </Text>
                        <Text
                          className={
                            t(mode, "text-gray-500", "text-gray-400") + " mt-1"
                          }
                        >
                          Quản lý variants ngay trong product
                        </Text>
                      </View>
                    }
                    right={
                      <MiniBtn label="Add" icon="add" onPress={startAdd} />
                    }
                  />
                </CardPro>

                {variants.length === 0 && (
                  <CardPro>
                    <EmptyState
                      title="Chưa có variant"
                      subtitle="Nhấn Add để tạo variant."
                    />
                  </CardPro>
                )}
              </View>
            );
          }

          const v: VariantDTO = item.v;
          return (
            <CardPro className="mb-3">
              <Row
                left={
                  <View>
                    <Text
                      className={
                        t(mode, "text-gray-900", "text-white") +
                        " font-extrabold"
                      }
                    >
                      {v.color} • Size {v.size}
                    </Text>
                    <Text
                      className={
                        t(mode, "text-gray-500", "text-gray-400") + " mt-1"
                      }
                    >
                      Stock: {v.stock} • Price:{" "}
                      {Number(v.price).toLocaleString("vi-VN")} ₫
                    </Text>
                  </View>
                }
                right={
                  <View className="flex-row gap-2">
                    <MiniBtn
                      label="Sửa"
                      icon="create-outline"
                      onPress={() => startEdit(v)}
                    />
                    <MiniBtn
                      label="Xoá"
                      icon="trash-outline"
                      tone="danger"
                      onPress={() => remove(v._id)}
                    />
                  </View>
                }
              />
            </CardPro>
          );
        }}
      />

      <FAB onPress={startAdd} />

      <ModalSheetPro
        visible={open}
        title={editing ? "Sửa variant" : "Thêm variant"}
        onClose={closeModal}
        footer={
          <PrimaryBtn
            label={
              saving ? "Đang lưu..." : editing ? "Lưu thay đổi" : "Tạo variant"
            }
            onPress={save}
          />
        }
      >
        <FieldPro
          label="Color *"
          value={color}
          onChange={(v) => {
            setColor(v);
            if (errors.color) setErrors((e) => ({ ...e, color: undefined }));
          }}
          placeholder="White"
          error={errors.color}
        />

        <FieldPro
          label="Size *"
          value={size}
          onChange={(v) => {
            setSize(v);
            if (errors.size) setErrors((e) => ({ ...e, size: undefined }));
          }}
          keyboardType="numeric"
          error={errors.size}
        />

        <FieldPro
          label="Stock"
          value={stock}
          onChange={(v) => {
            setStock(v);
            if (errors.stock) setErrors((e) => ({ ...e, stock: undefined }));
          }}
          keyboardType="numeric"
          error={errors.stock}
        />

        <FieldPro
          label="Price *"
          value={price}
          onChange={(v) => {
            setPrice(v);
            if (errors.price) setErrors((e) => ({ ...e, price: undefined }));
          }}
          keyboardType="numeric"
          error={errors.price}
        />
      </ModalSheetPro>
    </ScreenPro>
  );
}
