import { router, useLocalSearchParams } from "expo-router";
import React, { useMemo, useState } from "react";
import { Alert, FlatList, Image, Text, View } from "react-native";

import { useAdminStore } from "../../../components/admin/AdminStore";
import { t, useAdminTheme } from "../../../components/admin/theme";
import {
  CardPro,
  FAB,
  Field,
  MiniBtn,
  ModalSheetPro,
  PrimaryBtn,
  Row,
  ScreenPro,
} from "../../../components/admin/ui-pro";
import { EmptyState } from "../../../components/admin/ux";
import type { Variant } from "../../../types/admin";

export default function ProductDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { state, actions } = useAdminStore();
  const { mode } = useAdminTheme();

  const product = state.products.find((p) => p._id === id);
  const brand = product
    ? state.brands.find((b) => b._id === product.brand_id)
    : undefined;

  const variants = useMemo(
    () => state.variants.filter((v) => v.product_id === id),
    [state.variants, id]
  );

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Variant | null>(null);
  const [color, setColor] = useState("");
  const [size, setSize] = useState("40");
  const [stock, setStock] = useState("10");
  const [price, setPrice] = useState("3200000");

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

  const startAdd = () => {
    setEditing(null);
    setColor("");
    setSize("40");
    setStock("10");
    setPrice(String(product.base_price));
    setOpen(true);
  };

  const startEdit = (v: Variant) => {
    setEditing(v);
    setColor(v.color);
    setSize(String(v.size));
    setStock(String(v.stock));
    setPrice(String(v.price));
    setOpen(true);
  };

  const save = () => {
    if (!color.trim()) {
      Alert.alert("Thiếu thông tin", "Vui lòng nhập color");
      return;
    }
    const payload = {
      product_id: product._id,
      color: color.trim(),
      size: Number(size) || 0,
      stock: Number(stock) || 0,
      price: Number(price) || 0,
    };

    if (editing) actions.updateVariant(editing._id, payload);
    else actions.addVariant(payload);

    setOpen(false);
  };

  const remove = (vid: string) => {
    Alert.alert("Xoá variant?", "Không thể hoàn tác", [
      { text: "Huỷ", style: "cancel" },
      {
        text: "Xoá",
        style: "destructive",
        onPress: () => actions.removeVariant(vid),
      },
    ]);
  };

  return (
    <ScreenPro
      title="Product detail"
      subtitle={
        brand
          ? `${brand.name} • ${product._id.slice(-6)}`
          : product._id.slice(-6)
      }
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
                        Price: {product.base_price.toLocaleString("vi-VN")} ₫ •
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

          const v: Variant = item.v;
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
                      {v.price.toLocaleString("vi-VN")} ₫
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
        onClose={() => setOpen(false)}
        footer={
          <PrimaryBtn
            label={editing ? "Lưu thay đổi" : "Tạo variant"}
            onPress={save}
          />
        }
      >
        <Field
          label="Color"
          value={color}
          onChange={setColor}
          placeholder="White"
        />
        <Field
          label="Size"
          value={size}
          onChange={setSize}
          keyboardType="numeric"
        />
        <Field
          label="Stock"
          value={stock}
          onChange={setStock}
          keyboardType="numeric"
        />
        <Field
          label="Price"
          value={price}
          onChange={setPrice}
          keyboardType="numeric"
        />
      </ModalSheetPro>
    </ScreenPro>
  );
}
