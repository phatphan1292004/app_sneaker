import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
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

import { t, useAdminTheme } from "../../components/admin/theme";
import {
  CardPro,
  FAB,
  MiniBtn,
  ModalSheetPro,
  PrimaryBtn,
  ScreenPro,
  SearchBox,
} from "../../components/admin/ui-pro";
import { EmptyState } from "../../components/admin/ux";
import type { Brand } from "../../types/admin";

import {
  createAdminBrand,
  deleteAdminBrand,
  fetchAdminBrands,
  updateAdminBrand,
} from "../../services/admin/adminBrandsApi";

/** ================== helpers ================== */
function safeTrim(v: any) {
  const s = String(v ?? "").trim();
  return s.length ? s : "";
}

function getErrMessage(err: any, fallback: string) {
  return err?.response?.data?.message || err?.message || fallback;
}

type FormErrors = Partial<
  Record<"name" | "slug" | "logo" | "description", string>
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

/** ================== screen ================== */
export default function AdminBrands() {
  const { mode } = useAdminTheme();

  // list
  const [q, setQ] = useState("");
  const [items, setItems] = useState<Brand[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  // modal
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Brand | null>(null);

  // form
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [logo, setLogo] = useState("");
  const [description, setDescription] = useState("");

  // errors
  const [errors, setErrors] = useState<FormErrors>({});
  const [saving, setSaving] = useState(false);

  const debRef = useRef<any>(null);

  const resetForm = () => {
    setName("");
    setSlug("");
    setLogo("");
    setDescription("");
    setErrors({});
  };

  const closeModal = () => {
    setOpen(false);
    setEditing(null);
    resetForm();
  };

  const loadBrands = async (p = 1) => {
    setLoading(true);
    try {
      const res = await fetchAdminBrands({
        q,
        page: p,
        limit: 30,
        sort: "-createdAt",
      });

      setItems((prev) => (p === 1 ? res.data : [...prev, ...res.data]));
      setPage(res.meta.page);
      setTotalPages(res.meta.totalPages);
    } catch (err: any) {
      // load lỗi có thể toast (không liên quan form)
      Toast.show({
        type: "error",
        text1: "Load failed",
        text2: getErrMessage(err, "Không tải được brands"),
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBrands(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // debounce search
  useEffect(() => {
    if (debRef.current) clearTimeout(debRef.current);
    debRef.current = setTimeout(() => loadBrands(1), 300);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  const startAdd = () => {
    setEditing(null);
    resetForm();
    setOpen(true);
  };

  const startEdit = (b: Brand) => {
    setEditing(b);
    setName(b.name || "");
    setSlug(b.slug || "");
    setLogo(b.logo || "");
    setDescription(b.description || "");
    setErrors({});
    setOpen(true);
  };

  /** ✅ CREATE / UPDATE: lỗi theo field (name/slug riêng), success toast */
  const save = async () => {
    const isEdit = !!editing;

    setSaving(true);
    setErrors({});

    const payload = {
      name: safeTrim(name),
      slug: safeTrim(slug),
      logo: safeTrim(logo) || "https://via.placeholder.com/200x80?text=Brand",
      description: safeTrim(description) || "",
    };

    try {
      const res = isEdit
        ? await updateAdminBrand(editing!._id, payload)
        : await createAdminBrand(payload);

      // ❌ backend trả success:false
      if (!res.success) {
        // backend bạn đang trả: { success:false, field:"name"|"slug", message:"..." }
        const field = (res as any).field as keyof FormErrors | undefined;
        const msg = res.message || (isEdit ? "Update failed" : "Create failed");

        if (field) {
          setErrors({ [field]: msg });
        } else {
          // fallback nếu backend không có field
          setErrors({ name: msg });
        }
        return;
      }

      // ✅ success -> toast
      Toast.show({
        type: "success",
        text1: "Success",
        text2: isEdit ? "Đã cập nhật brand" : "Đã tạo brand mới",
      });

      closeModal();
      loadBrands(1);
    } catch (err: any) {
      // ❌ lỗi network / 500
      const msg = getErrMessage(
        err,
        isEdit ? "Không cập nhật được brand" : "Không tạo được brand"
      );

      // nếu backend lỗi dạng axios error vẫn có response.data.field
      const fieldFromServer = err?.response?.data?.field as
        | keyof FormErrors
        | undefined;
      if (fieldFromServer) {
        setErrors({ [fieldFromServer]: msg });
      } else {
        setErrors({ name: msg });
      }
    } finally {
      setSaving(false);
    }
  };

  const remove = (id: string) => {
    Alert.alert("Xoá brand?", "Sẽ xoá cả products thuộc brand này.", [
      { text: "Huỷ", style: "cancel" },
      {
        text: "Xoá",
        style: "destructive",
        onPress: async () => {
          try {
            const r = await deleteAdminBrand(id);
            if (!r.success) {
              Toast.show({
                type: "error",
                text1: "Delete failed",
                text2: r.message || "Không xoá được brand",
              });
              return;
            }

            Toast.show({
              type: "success",
              text1: "Success",
              text2: "Đã xoá brand",
            });

            loadBrands(1);
          } catch (err: any) {
            Toast.show({
              type: "error",
              text1: "Delete failed",
              text2: getErrMessage(err, "Không xoá được brand"),
            });
          }
        },
      },
    ]);
  };

  const renderBrand = ({ item }: { item: Brand }) => (
    <CardPro className="mb-3">
      <View className="flex-row items-center">
        <View
          className={
            t(mode, "bg-gray-100", "bg-gray-900") +
            " w-14 h-10 rounded-xl overflow-hidden mr-3"
          }
        >
          {!!item.logo && (
            <Image
              source={{ uri: item.logo }}
              style={{ width: "100%", height: "100%" }}
              resizeMode="contain"
            />
          )}
        </View>

        <View className="flex-1">
          <Text
            className={
              t(mode, "text-gray-900", "text-white") +
              " font-extrabold text-base"
            }
            numberOfLines={1}
          >
            {item.name}
          </Text>

          <Text
            className={t(mode, "text-gray-500", "text-gray-400") + " mt-1"}
            numberOfLines={1}
          >
            slug: {item.slug}
          </Text>

          <Text
            className={t(mode, "text-gray-500", "text-gray-400") + " mt-1"}
            numberOfLines={2}
          >
            {item.description || "-"}
          </Text>
        </View>
      </View>

      <View className="flex-row gap-2 mt-4 self-end">
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
    </CardPro>
  );

  return (
    <ScreenPro title="Brands" subtitle="Quản lý thương hiệu">
      <SearchBox
        value={q}
        onChange={setQ}
        placeholder="Tìm theo name / slug / mô tả"
      />

      {loading && items.length === 0 ? (
        <View className="py-8 items-center">
          <ActivityIndicator />
        </View>
      ) : items.length === 0 ? (
        <EmptyState title="Chưa có brand" subtitle="Nhấn + để tạo brand mới." />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(x) => x._id}
          renderItem={renderBrand}
          onEndReached={() => {
            if (!loading && page < totalPages) loadBrands(page + 1);
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
        title={editing ? "Sửa brand" : "Thêm brand"}
        onClose={closeModal}
        footer={
          <PrimaryBtn
            label={
              saving ? "Đang lưu..." : editing ? "Lưu thay đổi" : "Tạo brand"
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
          placeholder="Nike"
          error={errors.name}
        />

        <FieldPro
          label="Slug *"
          value={slug}
          onChange={(v) => {
            setSlug(v);
            if (errors.slug) setErrors((e) => ({ ...e, slug: undefined }));
          }}
          placeholder="nike"
          error={errors.slug}
        />

        <FieldPro
          label="Logo URL"
          value={logo}
          onChange={(v) => {
            setLogo(v);
            if (errors.logo) setErrors((e) => ({ ...e, logo: undefined }));
          }}
          placeholder="https://..."
          helper="Để trống sẽ tự dùng placeholder."
          error={errors.logo}
        />

        <FieldPro
          label="Description"
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
