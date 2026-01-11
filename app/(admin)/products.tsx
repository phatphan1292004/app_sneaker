import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import { Alert, FlatList, Image, Pressable, Text, View } from "react-native";
import { useAdminStore } from "../../components/admin/AdminStore";
import { t, useAdminTheme } from "../../components/admin/theme";

import {
  CardPro,
  FAB,
  Field,
  MiniBtn,
  ModalSheetPro,
  PrimaryBtn,
  Row,
  ScreenPro,
  SearchBox,
} from "../../components/admin/ui-pro";
import { EmptyState } from "../../components/admin/ux";
import type { Product } from "../../types/admin";

export default function AdminProducts() {
  const { state, actions } = useAdminStore();
  const { mode } = useAdminTheme();

  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);

  const [name, setName] = useState("");
  const [brandId, setBrandId] = useState(state.brands[0]?._id || "");
  const [price, setPrice] = useState("3200000");
  const [discount, setDiscount] = useState("0");
  const [images, setImages] = useState("");
  const [description, setDescription] = useState("");

  const list = useMemo(() => {
    const k = q.trim().toLowerCase();
    if (!k) return state.products;
    return state.products.filter((p) =>
      [p.name, p.description].some((x) => x.toLowerCase().includes(k))
    );
  }, [q, state.products]);

  const brandName = (id: string) =>
    state.brands.find((b) => b._id === id)?.name || "Unknown";

  const startAdd = () => {
    setEditing(null);
    setName("");
    setBrandId(state.brands[0]?._id || "");
    setPrice("3200000");
    setDiscount("0");
    setImages("");
    setDescription("");
    setOpen(true);
  };

  const startEdit = (p: Product) => {
    setEditing(p);
    setName(p.name);
    setBrandId(p.brand_id);
    setPrice(String(p.base_price));
    setDiscount(String(p.discount));
    setImages(p.images.join("\n"));
    setDescription(p.description);
    setOpen(true);
  };

  const save = () => {
    if (!name.trim()) {
      Alert.alert("Thiếu thông tin", "Vui lòng nhập tên sản phẩm");
      return;
    }
    const base_price = Number(price) || 0;
    const disc = Number(discount) || 0;
    const imgs = images
      .split("\n")
      .map((x) => x.trim())
      .filter(Boolean);

    const payload = {
      brand_id: brandId || state.brands[0]?._id || "unknown",
      name: name.trim(),
      description: description.trim(),
      base_price,
      discount: disc,
      views: editing?.views ?? 0,
      sold: editing?.sold ?? 0,
      favorites: editing?.favorites ?? 0,
      images: imgs.length
        ? imgs
        : [
            "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1200&auto=format&fit=crop",
          ],
    };

    if (editing) actions.updateProduct(editing._id, payload);
    else actions.addProduct(payload);

    setOpen(false);
  };

  const remove = (id: string) => {
    Alert.alert("Xoá product?", "Sẽ xoá variants thuộc product.", [
      { text: "Huỷ", style: "cancel" },
      {
        text: "Xoá",
        style: "destructive",
        onPress: () => actions.removeProduct(id),
      },
    ]);
  };

  return (
    <ScreenPro title="Products" subtitle="Quản lý sản phẩm">
      <SearchBox value={q} onChange={setQ} placeholder="Tìm theo tên / mô tả" />

      {list.length === 0 ? (
        <EmptyState
          title="Chưa có sản phẩm"
          subtitle="Nhấn + để tạo sản phẩm mới."
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
            const thumb = item.images?.[0];
            const variantCount = state.variants.filter(
              (v) => v.product_id === item._id
            ).length;

            return (
              <Pressable
                onPress={() =>
                  router.push(`/(admin)/products/${item._id}` as any)
                }
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
                                t(mode, "text-gray-500", "text-gray-400") +
                                " mt-1"
                              }
                              numberOfLines={1}
                            >
                              Brand: {brandName(item.brand_id)} • Variants:{" "}
                              {variantCount}
                            </Text>
                            <Text
                              className={
                                t(mode, "text-gray-500", "text-gray-400") +
                                " mt-1"
                              }
                              numberOfLines={1}
                            >
                              {item.base_price.toLocaleString("vi-VN")} ₫ • -
                              {item.discount}% • Sold {item.sold}
                            </Text>
                          </View>
                        }
                        right={
                          <Ionicons
                            name="chevron-forward"
                            size={18}
                            color="#496c60"
                          />
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
          }}
        />
      )}

      <FAB onPress={startAdd} />

      <ModalSheetPro
        visible={open}
        title={editing ? "Sửa product" : "Thêm product"}
        onClose={() => setOpen(false)}
        footer={
          <PrimaryBtn
            label={editing ? "Lưu thay đổi" : "Tạo product"}
            onPress={save}
          />
        }
      >
        <Field
          label="Name"
          value={name}
          onChange={setName}
          placeholder="Air Jordan..."
        />
        <Field
          label="Brand ID"
          value={brandId}
          onChange={setBrandId}
          placeholder="brand_id"
        />
        <Field
          label="Base price"
          value={price}
          onChange={setPrice}
          keyboardType="numeric"
        />
        <Field
          label="Discount (%)"
          value={discount}
          onChange={setDiscount}
          keyboardType="numeric"
        />
        <Field
          label="Images (mỗi dòng 1 url)"
          value={images}
          onChange={setImages}
          placeholder="https://...\nhttps://..."
          multiline
        />
        <Field
          label="Description"
          value={description}
          onChange={setDescription}
          multiline
        />
      </ModalSheetPro>
    </ScreenPro>
  );
}
