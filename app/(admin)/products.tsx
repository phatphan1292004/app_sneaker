import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

import { t, useAdminTheme } from "../../components/admin/theme";
import {
  CardPro,
  FAB,
  MiniBtn,
  ModalSheetPro,
  PrimaryBtn,
  Row,
  ScreenPro,
  SearchBox,
} from "../../components/admin/ui-pro";
import { EmptyState } from "../../components/admin/ux";

import type { BrandDTO } from "../../services/admin/adminBrandsApi";
import { fetchAdminBrands } from "../../services/admin/adminBrandsApi";

import type { ProductDTO } from "../../services/admin/adminProductsApi";
import {
  createAdminProduct,
  deleteAdminProduct,
  fetchAdminProducts,
  updateAdminProduct,
} from "../../services/admin/adminProductsApi";

/** ================== helpers ================== */
function safeTrim(v: any) {
  const s = String(v ?? "").trim();
  return s.length ? s : "";
}

function getErrMessage(err: any, fallback: string) {
  return err?.response?.data?.message || err?.message || fallback;
}

type FormErrors = Partial<
  Record<
    "name" | "brand_id" | "base_price" | "discount" | "images" | "description",
    string
  >
>;

/** ✅ Field đẹp: viền đỏ + icon + lỗi dưới ô */
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
      "bg-gray-950 border border-gray-900"
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

/** ✅ Brand Selector (mở modal list để chọn) */
function BrandSelectField({
  label,
  valueId,
  brands,
  onChangeId,
  error,
}: {
  label: string;
  valueId: string;
  brands: BrandDTO[];
  onChangeId: (id: string) => void;
  error?: string;
}) {
  const { mode } = useAdminTheme();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");

  const selected = brands.find((b) => b._id === valueId);

  const filtered = useMemo(() => {
    const k = q.trim().toLowerCase();
    if (!k) return brands;
    return brands.filter((b) =>
      [b.name, b.slug, b.description]
        .filter(Boolean)
        .some((x) => String(x).toLowerCase().includes(k))
    );
  }, [q, brands]);

  const isErr = !!error;

  const baseWrap =
    t(
      mode,
      "bg-gray-50 border border-gray-200",
      "bg-gray-950 border border-gray-900"
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

      <Pressable
        onPress={() => setOpen(true)}
        className={baseWrap + (isErr ? errBorder : "")}
      >
        <Text
          className={
            (selected
              ? t(mode, "text-gray-900", "text-white")
              : t(mode, "text-gray-500", "text-gray-400")) + " flex-1"
          }
          numberOfLines={1}
        >
          {selected ? selected.name : "Chọn brand..."}
        </Text>

        <Ionicons
          name="chevron-down"
          size={18}
          color={mode === "dark" ? "#9ca3af" : "#6b7280"}
        />
      </Pressable>

      {!!error && (
        <Text
          className={
            (mode === "dark" ? "text-red-300" : "text-red-600") + " mt-1"
          }
        >
          {error}
        </Text>
      )}

      <ModalSheetPro
        visible={open}
        title="Chọn brand"
        onClose={() => setOpen(false)}
      >
        <SearchBox
          value={q}
          onChange={setQ}
          placeholder="Tìm theo name / slug"
        />

        {filtered.length === 0 ? (
          <View className="mt-4">
            <EmptyState title="Không có brand" subtitle="Thử từ khoá khác." />
          </View>
        ) : (
          <View className="pt-3">
            {filtered.map((b) => {
              const active = b._id === valueId;
              return (
                <Pressable
                  key={b._id}
                  onPress={() => {
                    onChangeId(b._id);
                    setOpen(false);
                  }}
                  className={
                    (active
                      ? t(mode, "bg-emerald-50", "bg-emerald-950/30")
                      : "bg-transparent") + " px-4 py-3 rounded-2xl mb-2"
                  }
                >
                  <Text
                    className={
                      (active
                        ? t(mode, "text-emerald-900", "text-emerald-200")
                        : t(mode, "text-gray-900", "text-white")) +
                      " font-extrabold"
                    }
                    numberOfLines={1}
                  >
                    {b.name}
                  </Text>
                  <Text
                    className={
                      t(mode, "text-gray-500", "text-gray-400") + " mt-1"
                    }
                    numberOfLines={1}
                  >
                    slug: {b.slug}
                  </Text>
                </Pressable>
              );
            })}
            <View className="h-8" />
          </View>
        )}
      </ModalSheetPro>
    </View>
  );
}

/** ================== screen ================== */
export default function AdminProducts() {
  const { mode } = useAdminTheme();

  // list
  const [q, setQ] = useState("");
  const [items, setItems] = useState<ProductDTO[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  // brands
  const [brands, setBrands] = useState<BrandDTO[]>([]);

  // modal
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<ProductDTO | null>(null);

  // form
  const [name, setName] = useState("");
  const [brandId, setBrandId] = useState("");
  const [price, setPrice] = useState("3200000");
  const [discount, setDiscount] = useState("0");
  const [images, setImages] = useState("");
  const [description, setDescription] = useState("");

  // errors + saving
  const [errors, setErrors] = useState<FormErrors>({});
  const [saving, setSaving] = useState(false);

  const debRef = useRef<any>(null);

  const brandName = (id: string) =>
    brands.find((b) => b._id === id)?.name || "Unknown";

  const resetForm = () => {
    setName("");
    setBrandId(brands[0]?._id || "");
    setPrice("3200000");
    setDiscount("0");
    setImages("");
    setDescription("");
    setErrors({});
  };

  const closeModal = () => {
    setOpen(false);
    setEditing(null);
    resetForm();
  };

  const loadBrands = async () => {
    try {
      const res = await fetchAdminBrands({
        q: "",
        page: 1,
        limit: 200,
        sort: "name",
      });
      if (!res.success) {
        Toast.show({
          type: "error",
          text1: "Load failed",
          text2: "Không tải được brands",
        });
        return;
      }
      setBrands(res.data || []);
      if (!brandId && res.data?.[0]?._id) setBrandId(res.data[0]._id);
    } catch (err: any) {
      Toast.show({
        type: "error",
        text1: "Load failed",
        text2: getErrMessage(err, "Không tải được brands"),
      });
    }
  };

  const loadProducts = async (p = 1) => {
    setLoading(true);
    try {
      const res = await fetchAdminProducts({
        q,
        page: p,
        limit: 30,
        sort: "-createdAt",
      });

      setItems((prev) => (p === 1 ? res.data : [...prev, ...res.data]));
      setPage(res.meta.page);
      setTotalPages(res.meta.totalPages);
    } catch (err: any) {
      Toast.show({
        type: "error",
        text1: "Load failed",
        text2: getErrMessage(err, "Không tải được products"),
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBrands();
    loadProducts(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // debounce search như Brands
  useEffect(() => {
    if (debRef.current) clearTimeout(debRef.current);
    debRef.current = setTimeout(() => loadProducts(1), 300);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  const startAdd = () => {
    setEditing(null);
    resetForm();
    setOpen(true);
  };

  const startEdit = (p: ProductDTO) => {
    setEditing(p);
    setName(p.name || "");
    setBrandId(p.brand_id || brands[0]?._id || "");
    setPrice(String(p.base_price ?? 0));
    setDiscount(String(p.discount ?? 0));
    setImages((p.images || []).join("\n"));
    setDescription(p.description || "");
    setErrors({});
    setOpen(true);
  };

  const save = async () => {
    const isEdit = !!editing;

    setSaving(true);
    setErrors({});

    const imgs = safeTrim(images)
      ? safeTrim(images)
          .split("\n")
          .map((x) => x.trim())
          .filter(Boolean)
      : [];

    const payload = {
      brand_id: safeTrim(brandId),
      name: safeTrim(name),
      description: safeTrim(description) || "Không có mô tả",
      base_price: Number(price) || 0,
      discount: Number(discount) || 0,
      images: imgs.length
        ? imgs
        : [
            "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1200&auto=format&fit=crop",
          ],
    };

    // validate client giống Brands (tối thiểu)
    const newErr: FormErrors = {};
    if (!payload.name) newErr.name = "Vui lòng nhập tên sản phẩm";
    if (!payload.brand_id) newErr.brand_id = "Vui lòng chọn brand";
    if (!payload.description) newErr.description = "Vui lòng nhập mô tả";
    if (!payload.images?.length) newErr.images = "Vui lòng nhập ít nhất 1 ảnh";

    if (Object.keys(newErr).length) {
      setErrors(newErr);
      setSaving(false);
      return;
    }

    try {
      const res = isEdit
        ? await updateAdminProduct(editing!._id, payload)
        : await createAdminProduct(payload);

      if (!res.success) {
        const field = (res as any).field as keyof FormErrors | undefined;
        const msg = res.message || (isEdit ? "Update failed" : "Create failed");
        setErrors(field ? { [field]: msg } : { name: msg });
        return;
      }

      Toast.show({
        type: "success",
        text1: "Success",
        text2: isEdit ? "Đã cập nhật product" : "Đã tạo product mới",
      });

      closeModal();
      loadProducts(1);
    } catch (err: any) {
      const msg = getErrMessage(
        err,
        isEdit ? "Không cập nhật được product" : "Không tạo được product"
      );
      const fieldFromServer = err?.response?.data?.field as
        | keyof FormErrors
        | undefined;

      setErrors(fieldFromServer ? { [fieldFromServer]: msg } : { name: msg });
    } finally {
      setSaving(false);
    }
  };

  const remove = (id: string) => {
    Alert.alert("Xoá product?", "Sẽ xoá variants thuộc product.", [
      { text: "Huỷ", style: "cancel" },
      {
        text: "Xoá",
        style: "destructive",
        onPress: async () => {
          try {
            const r = await deleteAdminProduct(id);
            if (!r.success) {
              Toast.show({
                type: "error",
                text1: "Delete failed",
                text2: r.message || "Không xoá được product",
              });
              return;
            }

            Toast.show({
              type: "success",
              text1: "Success",
              text2: "Đã xoá product",
            });

            loadProducts(1);
          } catch (err: any) {
            Toast.show({
              type: "error",
              text1: "Delete failed",
              text2: getErrMessage(err, "Không xoá được product"),
            });
          }
        },
      },
    ]);
  };

  const renderProduct = ({ item }: { item: ProductDTO }) => {
    const thumb = item.images?.[0];

    return (
      <Pressable
        onPress={() => router.push(`/(admin)/products/${item._id}` as any)}
      >
        <CardPro className="mb-3">
          <View className="flex-row">
            <View
              className={
                t(mode, "bg-gray-100", "bg-gray-900") +
                " w-16 h-16 rounded-2xl overflow-hidden mr-3"
              }
            >
              {!!thumb && (
                <Image
                  source={{ uri: thumb }}
                  style={{ width: "100%", height: "100%" }}
                  resizeMode="cover"
                />
              )}
            </View>

            <View className="flex-1">
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
                      {item.name}
                    </Text>
                    <Text
                      className={
                        t(mode, "text-gray-500", "text-gray-400") + " mt-1"
                      }
                      numberOfLines={1}
                    >
                      Brand: {brandName(item.brand_id)}
                    </Text>
                    <Text
                      className={
                        t(mode, "text-gray-500", "text-gray-400") + " mt-1"
                      }
                      numberOfLines={1}
                    >
                      {Number(item.base_price).toLocaleString("vi-VN")} ₫ • -
                      {item.discount}% • Sold {item.sold}
                    </Text>
                  </View>
                }
                right={
                  <Ionicons name="chevron-forward" size={18} color="#496c60" />
                }
              />

              <View className="flex-row gap-2 mt-3 self-end">
                <MiniBtn
                  label="Sửa"
                  icon="create-outline"
                  onPress={() => startEdit(item)}
                />
                <MiniBtn
                  label="Xoá"
                  icon="trash-outline"
                  tone="danger"
                  onPress={() => remove(item._id)}
                />
              </View>
            </View>
          </View>
        </CardPro>
      </Pressable>
    );
  };

  return (
    <ScreenPro title="Products" subtitle="Quản lý sản phẩm">
      <SearchBox value={q} onChange={setQ} placeholder="Tìm theo tên / mô tả" />

      {loading && items.length === 0 ? (
        <View className="py-8 items-center">
          <ActivityIndicator />
        </View>
      ) : items.length === 0 ? (
        <EmptyState
          title="Chưa có sản phẩm"
          subtitle="Nhấn + để tạo sản phẩm mới."
        />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(x) => x._id}
          renderItem={renderProduct}
          onEndReached={() => {
            if (!loading && page < totalPages) loadProducts(page + 1);
          }}
          onEndReachedThreshold={0.4}
          contentContainerStyle={{
            padding: 20,
            paddingTop: 12,
            paddingBottom: 110,
          }}
        />
      )}

      <FAB onPress={startAdd} />

      <ModalSheetPro
        visible={open}
        title={editing ? "Sửa product" : "Thêm product"}
        onClose={closeModal}
        footer={
          <PrimaryBtn
            label={
              saving ? "Đang lưu..." : editing ? "Lưu thay đổi" : "Tạo product"
            }
            onPress={save}
          />
        }
      >
        <FieldPro
          label="Name *"
          value={name}
          onChange={(v) => {
            setName(v);
            if (errors.name) setErrors((e) => ({ ...e, name: undefined }));
          }}
          placeholder="Air Jordan..."
          error={errors.name}
        />

        {/* ✅ Brand selector */}
        <BrandSelectField
          label="Brand *"
          valueId={brandId}
          brands={brands}
          onChangeId={(id) => {
            setBrandId(id);
            if (errors.brand_id)
              setErrors((e) => ({ ...e, brand_id: undefined }));
          }}
          error={errors.brand_id}
        />

        <FieldPro
          label="Base price *"
          value={price}
          onChange={(v) => {
            setPrice(v);
            if (errors.base_price)
              setErrors((e) => ({ ...e, base_price: undefined }));
          }}
          keyboardType="numeric"
          error={errors.base_price}
        />

        <FieldPro
          label="Discount (%)"
          value={discount}
          onChange={(v) => {
            setDiscount(v);
            if (errors.discount)
              setErrors((e) => ({ ...e, discount: undefined }));
          }}
          keyboardType="numeric"
          error={errors.discount}
        />

        <FieldPro
          label="Images (mỗi dòng 1 url)"
          value={images}
          onChange={(v) => {
            setImages(v);
            if (errors.images) setErrors((e) => ({ ...e, images: undefined }));
          }}
          placeholder="https://...\nhttps://..."
          multiline
          error={errors.images}
          helper="Để trống sẽ dùng ảnh mẫu."
        />

        <FieldPro
          label="Description *"
          value={description}
          onChange={(v) => {
            setDescription(v);
            if (errors.description)
              setErrors((e) => ({ ...e, description: undefined }));
          }}
          placeholder="Mô tả..."
          multiline
          error={errors.description}
        />
      </ModalSheetPro>
    </ScreenPro>
  );
}
