import CartItem from "@/components/order/CartItem";
import { useCart } from "@/contexts/CartContext";
import { applyVoucher } from "@/services/vouchersApi"; // <-- chỉnh path đúng file applyVoucher bạn viết
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

function money(v?: number) {
  if (v == null) return "—";
  return new Intl.NumberFormat("vi-VN").format(v) + " đ";
}

function getErrMessage(err: any, fallback: string) {
  return err?.response?.data?.message || err?.message || fallback;
}

export default function CartScreen() {
  const {
    items,
    updateQuantity,
    removeItem,
    getSubTotal,
    getDiscount,
    getTotalPrice,
    voucher,
    setVoucher,
    clearVoucher,
  } = useCart();

  const [couponCode, setCouponCode] = useState("");
  const [applying, setApplying] = useState(false);

  const subtotal = getSubTotal();
  const discount = getDiscount();
  const shipping = 0;
  const total = getTotalPrice() + shipping;

  // Khi subtotal đổi -> clear voucher để tránh sai discount
  useEffect(() => {
    if (voucher) {
      clearVoucher();
      setCouponCode("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subtotal]);

  const onApply = async () => {
    const code = couponCode.trim().toUpperCase();

    if (!code) {
      Toast.show({
        type: "error",
        text1: "Thiếu mã",
        text2: "Vui lòng nhập voucher trước.",
      });
      return;
    }

    if (subtotal <= 0) {
      Toast.show({
        type: "error",
        text1: "Giỏ hàng trống",
        text2: "Không thể áp dụng voucher.",
      });
      return;
    }

    setApplying(true);
    try {
      const r = await applyVoucher(code, subtotal);

      if (!r.success || !r.data) {
        Toast.show({
          type: "error",
          text1: "Apply failed",
          text2: r.message || "Voucher không hợp lệ",
        });
        return;
      }

      // Lưu vào context (và storage)
      setVoucher({ code: r.data.code, discount: r.data.discount });

      Toast.show({
        type: "success",
        text1: "Success",
        text2: `Đã áp dụng ${r.data.code} • Giảm ${money(r.data.discount)}`,
      });
    } catch (err: any) {
      Toast.show({
        type: "error",
        text1: "Apply failed",
        text2: getErrMessage(err, "Không áp dụng được voucher"),
      });
    } finally {
      setApplying(false);
    }
  };

  const onRemoveVoucher = () => {
    clearVoucher();
    setCouponCode("");
    Toast.show({
      type: "success",
      text1: "Removed",
      text2: "Đã gỡ voucher.",
    });
  };

  return (
    <View className="flex-1 bg-gray-100 pt-12">
      {/* Header */}
      <View
        className="px-5 py-4 border-b border-gray-200 flex-row items-center"
        style={{ paddingTop: StatusBar.currentHeight || 20 }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 items-center justify-center"
        >
          <Ionicons name="chevron-back" size={28} color="#000" />
        </TouchableOpacity>

        <Text className="text-xl font-bold text-gray-900 flex-1 text-center">
          My Cart
        </Text>

        <View className="w-10 h-10" />
      </View>

      {items.length === 0 ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Image
            source={{
              width: 200,
              height: 200,
              uri: "https://i.pinimg.com/1200x/f7/b3/11/f7b3113394e96105685b79f80a374eb5.jpg",
            }}
            className="w-14 h-14 rounded-lg"
          />
          <Text className="text-gray-400 text-lg mt-4">Your cart is empty</Text>
        </View>
      ) : (
        <ScrollView
          className="flex-1 px-5"
          contentContainerStyle={{ paddingBottom: 300, paddingTop: 20 }}
        >
          {items.map((item) => (
            <CartItem
              key={item.variantId}
              item={item}
              updateQuantity={updateQuantity}
              removeItem={removeItem}
            />
          ))}
        </ScrollView>
      )}

      {/* Bottom Section - Fixed */}
      {items.length > 0 && (
        <View
          className="bg-gray-100 border-t border-gray-200"
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            paddingBottom: 30,
          }}
        >
          {/* Voucher Code */}
          <View className="px-5 pt-4 pb-3">
            <View className="flex-row bg-white items-center border border-gray-200 rounded-xl overflow-hidden">
              <TextInput
                value={couponCode}
                onChangeText={setCouponCode}
                placeholder="Enter coupon code"
                placeholderTextColor="#9CA3AF"
                autoCapitalize="characters"
                className="flex-1 px-4 py-5 text-gray-900"
              />

              {voucher ? (
                <TouchableOpacity
                  className="px-5 py-3"
                  onPress={onRemoveVoucher}
                >
                  <Text style={{ color: "#DC2626" }} className="font-semibold">
                    Remove
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  className="px-5 py-3"
                  onPress={onApply}
                  disabled={applying}
                >
                  {applying ? (
                    <ActivityIndicator />
                  ) : (
                    <Text
                      style={{ color: "#496c60" }}
                      className="font-semibold"
                    >
                      Apply
                    </Text>
                  )}
                </TouchableOpacity>
              )}
            </View>

            {voucher ? (
              <Text className="text-xs text-gray-500 mt-2">
                Applied: <Text className="font-bold">{voucher.code}</Text> •
                giảm{" "}
                <Text className="font-bold">{money(voucher.discount)}</Text>
              </Text>
            ) : null}
          </View>

          {/* Order Summary */}
          <View className="px-5 py-3 border-t border-gray-100">
            <Text className="font-bold text-gray-900 text-lg mb-3">
              Order Summary
            </Text>

            <View className="flex-row justify-between mb-2">
              <Text className="text-gray-600">Sub Total</Text>
              <Text className="text-gray-900 font-semibold">
                {money(subtotal)}
              </Text>
            </View>

            {/* Discount */}
            <View className="flex-row justify-between mb-2">
              <Text className="text-gray-600">Discount</Text>
              <Text className="text-gray-900 font-semibold">
                -{money(discount)}
                {voucher?.code ? ` (${voucher.code})` : ""}
              </Text>
            </View>

            <View className="flex-row justify-between mb-3">
              <Text className="text-gray-600">Delivery fee</Text>
              <Text className="text-gray-900 font-semibold">
                {money(shipping)}
              </Text>
            </View>

            <View className="flex-row justify-between mb-4">
              <Text className="font-bold text-gray-900 text-lg">Total</Text>
              <Text className="font-bold text-gray-900 text-xl">
                {money(total)}
              </Text>
            </View>

            {/* Checkout Button */}
            <TouchableOpacity
              onPress={() => router.push("/checkout")}
              className="rounded-2xl py-4 items-center"
              style={{ backgroundColor: "#496c60" }}
            >
              <Text className="text-white font-bold text-base">Checkout</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}
