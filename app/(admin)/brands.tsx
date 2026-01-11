import React, { useMemo, useState } from "react";
import { Alert, FlatList, Image, Text, View } from "react-native";

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
import type { Brand } from "../../types/admin";

export default function AdminBrands() {
  const { state, actions } = useAdminStore();
  const { mode } = useAdminTheme();

  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Brand | null>(null);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [logo, setLogo] = useState("");
  const [description, setDescription] = useState("");

  const list = useMemo(() => {
    const k = q.trim().toLowerCase();
    if (!k) return state.brands;
    return state.brands.filter((b) =>
      [b.name, b.slug, b.description].some((x) => x.toLowerCase().includes(k))
    );
  }, [q, state.brands]);

  const startAdd = () => {
    setEditing(null);
    setName("");
    setSlug("");
    setLogo("");
    setDescription("");
    setOpen(true);
  };

  const startEdit = (b: Brand) => {
    setEditing(b);
    setName(b.name);
    setSlug(b.slug);
    setLogo(b.logo);
    setDescription(b.description);
    setOpen(true);
  };

  const save = () => {
    if (!name.trim() || !slug.trim()) {
      Alert.alert("Thiếu thông tin", "Vui lòng nhập name + slug");
      return;
    }
    if (editing) {
      actions.updateBrand(editing._id, {
        name: name.trim(),
        slug: slug.trim(),
        logo: logo.trim(),
        description: description.trim(),
      });
    } else {
      actions.addBrand({
        name: name.trim(),
        slug: slug.trim(),
        logo: logo.trim() || "https://via.placeholder.com/200x80?text=Brand",
        description: description.trim(),
      });
    }
    setOpen(false);
  };

  const remove = (id: string) => {
    Alert.alert("Xoá brand?", "Sẽ xoá cả products thuộc brand này.", [
      { text: "Huỷ", style: "cancel" },
      {
        text: "Xoá",
        style: "destructive",
        onPress: () => actions.removeBrand(id),
      },
    ]);
  };

  return (
    <ScreenPro title="Brands" subtitle="Quản lý thương hiệu">
      <SearchBox
        value={q}
        onChange={setQ}
        placeholder="Tìm theo name / slug / mô tả"
      />

      {list.length === 0 ? (
        <EmptyState title="Chưa có brand" subtitle="Nhấn + để tạo brand mới." />
      ) : (
        <FlatList
          data={list}
          keyExtractor={(x) => x._id}
          contentContainerStyle={{
            padding: 20,
            paddingTop: 12,
            paddingBottom: 100,
          }}
          renderItem={({ item }) => (
            <CardPro className="mb-3">
              {/* ===== INFO ===== */}
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
                    className={
                      t(mode, "text-gray-500", "text-gray-400") + " mt-1"
                    }
                    numberOfLines={1}
                  >
                    slug: {item.slug}
                  </Text>

                  <Text
                    className={
                      t(mode, "text-gray-500", "text-gray-400") + " mt-1"
                    }
                    numberOfLines={2}
                  >
                    {item.description || "-"}
                  </Text>
                </View>
              </View>

              {/* ===== ACTIONS (DƯỚI) ===== */}
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
          )}
        />
      )}

      <FAB onPress={startAdd} />

      <ModalSheetPro
        visible={open}
        title={editing ? "Sửa brand" : "Thêm brand"}
        onClose={() => setOpen(false)}
        footer={
          <PrimaryBtn
            label={editing ? "Lưu thay đổi" : "Tạo brand"}
            onPress={save}
          />
        }
      >
        <Field
          label="Name"
          value={name}
          onChange={setName}
          placeholder="Nike"
        />
        <Field
          label="Slug"
          value={slug}
          onChange={setSlug}
          placeholder="nike"
        />
        <Field
          label="Logo URL"
          value={logo}
          onChange={setLogo}
          placeholder="https://..."
        />
        <Field
          label="Description"
          value={description}
          onChange={setDescription}
          placeholder="Mô tả..."
          multiline
        />
      </ModalSheetPro>
    </ScreenPro>
  );
}
