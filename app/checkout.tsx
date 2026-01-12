import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { Address, addressService } from "@/services/addressService";
import { orderService } from "@/services/orderService";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import Toast from "react-native-toast-message";
import { WebView } from "react-native-webview";
import api from "../services/api";

export default function CheckoutScreen() {
  const { items, getTotalItems, getTotalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const [selectedPayment, setSelectedPayment] = useState<string>("card");
  const [loading, setLoading] = useState(false);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [vnpayUrl, setVnpayUrl] = useState<string | null>(null);

  const subtotal = getTotalPrice();
  const shipping = 0;
  const total = subtotal + shipping;

  const paymentMethods = [
    {
      id: "card",
      name: "Credit/Debit Card",
      icon: "card-outline",
      description: "Visa, Mastercard, AMEX",
    },
    {
      id: "momo",
      name: "MoMo",
      icon: "wallet-outline",
      description: "MoMo e-wallet",
    },
    {
      id: "vnpay",
      name: "VNPay",
      icon: "phone-portrait-outline",
      description: "VNPay payment gateway",
    },
    {
      id: "cod",
      name: "Cash on Delivery",
      icon: "cash-outline",
      description: "Pay when you receive",
    },
  ];

  // Load addresses
  useEffect(() => {
    const fetchAddresses = async () => {
      if (!user?.uid) return;
      try {
        const response = await addressService.getAddressesByUserId(user.uid);
        if (response.success && response.data) {
          const mapped = response.data.map((addr: any) => ({
            id: addr._id || addr.id,
            user_id: addr.user_id,
            type: addr.type,
            street: addr.street,
            province: addr.province,
            district: addr.district,
            ward: addr.ward,
            isDefault: addr.isDefault || false,
          }));
          setAddresses(mapped);
          const defaultAddr = mapped.find((a) => a.isDefault) || mapped[0];
          setSelectedAddress(defaultAddr || null);
        } else {
          setAddresses([]);
          setSelectedAddress(null);
        }
      } catch {
        setAddresses([]);
        setSelectedAddress(null);
      }
    };
    fetchAddresses();
  }, [user?.uid]);

  // Handle order placement
  const handlePlaceOrder = async () => {
    if (!user) {
      Toast.show({ type: "error", text1: "Error", text2: "Please login" });
      router.push("/auth/login");
      return;
    }
    if (items.length === 0) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Your cart is empty",
      });
      return;
    }
    if (!selectedAddress) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Please select a delivery address.",
      });
      return;
    }

    try {
      setLoading(true);
      const orderData = {
        user_id: user.uid,
        items: items.map((item) => ({
          brand: item.brand,
          product_id: item.productId,
          variant_id: item.variantId,
          quantity: item.quantity,
          price: item.price,
        })),
        shipping_address: {
          street: selectedAddress.street,
          ward: selectedAddress.ward,
          district: selectedAddress.district,
          province: selectedAddress.province,
          country: "Vietnam",
        },
        payment_method: selectedPayment,
        total_amount: total,
      };

      const createOrderRes = await orderService.createOrder(orderData);
      if (!createOrderRes.success) {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: createOrderRes.message,
        });
        return;
      }

      const orderId = createOrderRes.data._id;

      if (selectedPayment === "vnpay") {
        const vnpayRes = await orderService.createVNPayPayment(orderId);
        if (vnpayRes.success && vnpayRes.url) {
          setVnpayUrl(vnpayRes.url);
        } else {
          Toast.show({
            type: "error",
            text1: "Error",
            text2: vnpayRes.message || "Cannot open VNPay",
          });
        }
      } else {
        clearCart();
        Toast.show({
          type: "success",
          text1: "Success",
          text2: "Order placed successfully!",
        });
        setTimeout(() => router.push("/(tabs)"), 700);
      }
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error.response?.data?.message || "Failed to place order",
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle VNPay WebView navigation
  const handleWebViewNavigation = async (navState: any) => {
    const url = navState.url;

    // Kiểm tra xem URL hiện tại có chứa chuỗi return do VNPay gọi về không
    if (url && url.includes("vnpay-return")) {
      try {
        setLoading(true);
        
        // 1. Phân tích URL để lấy các tham số query VNPay gửi về
        const parsedUrl = new URL(url);
        const params = Object.fromEntries(parsedUrl.searchParams.entries());

        console.log("VNPay return params:", params);

        // 2. Gọi API kiểm tra chữ ký thông qua instance 'api' của bạn
        const response = await api.get("/api/vnpay-return", { params });
        const data = response.data;

        if (data.success && data.status === "paid") {
          Toast.show({
            type: "success",
            text1: "Thành công",
            text2: "Thanh toán đơn hàng hoàn tất!",
          });
          clearCart();
          setVnpayUrl(null);
          setTimeout(() => router.push("/(tabs)"), 500);
        } else {
          Toast.show({
            type: "error",
            text1: "Thanh toán thất bại",
            text2: data.message || "Giao dịch không thành công",
          });
          setVnpayUrl(null);
        }
      } catch (error) {
        console.error("Verify error:", error);
        Toast.show({
          type: "error",
          text1: "Lỗi hệ thống",
          text2: "Không thể xác thực giao dịch",
        });
        setVnpayUrl(null);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <View className="flex-1 bg-white pt-12">
      <ScrollView
        className="flex-1 px-5"
        contentContainerStyle={{
          paddingTop: StatusBar.currentHeight || 20,
          paddingBottom: 100,
        }}
      >
        {/* Header */}
        <View className="flex-row items-center mb-6 mt-2">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 items-center justify-center"
          >
            <Ionicons name="chevron-back" size={28} color="#000" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-gray-900 flex-1 text-center mr-10">
            Checkout
          </Text>
        </View>

        {/* Delivery Address */}
        <View className="mb-6">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-lg font-bold text-gray-900">
              Delivery Address
            </Text>
            <TouchableOpacity
              onPress={() => router.push("/profile/address")}
              className="h-10 w-10 bg-[#496c60] rounded-xl flex items-center justify-center"
            >
              <Text className="text-white font-semibold text-xl">+</Text>
            </TouchableOpacity>
          </View>
          {addresses.length === 0 ? (
            <Text className="text-gray-500">
              No address found. Please add an address.
            </Text>
          ) : (
            <View style={{ maxHeight: 220 }}>
              <ScrollView>
                {addresses.map((addr) => (
                  <TouchableOpacity
                    key={addr.id}
                    className={`bg-gray-50 rounded-2xl p-4 mb-2 ${selectedAddress && selectedAddress.id === addr.id ? "border-2 border-[#496c60]" : ""}`}
                    onPress={() => setSelectedAddress(addr)}
                  >
                    <View className="flex-row items-start justify-between">
                      <View className="flex-1">
                        <Text className="font-semibold text-gray-900 mb-1">
                          {addr.type} {addr.isDefault ? "(Mặc định)" : ""}
                        </Text>
                        <Text className="text-gray-600 text-sm">
                          {addr.street}, {addr.ward}, {addr.district},{" "}
                          {addr.province}
                        </Text>
                      </View>
                      {selectedAddress && selectedAddress.id === addr.id && (
                        <Ionicons
                          name="checkmark-circle"
                          size={20}
                          color="#496c60"
                        />
                      )}
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>

        {/* Order Summary */}
        <View className="mb-6">
          <Text className="text-lg font-bold text-gray-900 mb-3">
            Order Summary
          </Text>
          <View className="bg-gray-50 rounded-2xl p-4">
            <View className="flex-row justify-between mb-2">
              <Text className="text-gray-600">
                Subtotal ({getTotalItems()} items)
              </Text>
              <Text className="text-gray-900 font-semibold">
                {subtotal.toLocaleString()} đ
              </Text>
            </View>
            <View className="flex-row justify-between mb-3">
              <Text className="text-gray-600">Shipping</Text>
              <Text className="text-gray-900 font-semibold">Free</Text>
            </View>
            <View className="h-px bg-gray-200 my-2" />
            <View className="flex-row justify-between">
              <Text className="font-bold text-gray-900 text-lg">Total</Text>
              <Text className="font-bold text-gray-900 text-xl">
                {total.toLocaleString()} đ
              </Text>
            </View>
          </View>
        </View>

        {/* Payment Method */}
        <View className="mb-6">
          <Text className="text-lg font-bold text-gray-900 mb-3">
            Payment Method
          </Text>
          {paymentMethods.map((method) => (
            <TouchableOpacity
              key={method.id}
              onPress={() => setSelectedPayment(method.id)}
              className="bg-gray-50 rounded-2xl p-4 mb-3 flex-row items-center"
              style={{
                borderWidth: 2,
                borderColor:
                  selectedPayment === method.id ? "#496c60" : "transparent",
              }}
            >
              <View
                className="w-12 h-12 rounded-xl items-center justify-center mr-3"
                style={{
                  backgroundColor:
                    selectedPayment === method.id ? "#d1e7dd" : "#e5e7eb",
                }}
              >
                <Ionicons
                  name={method.icon as any}
                  size={24}
                  color={selectedPayment === method.id ? "#496c60" : "#6B7280"}
                />
              </View>
              <View className="flex-1">
                <Text className="font-semibold text-gray-900 mb-1">
                  {method.name}
                </Text>
                <Text className="text-gray-500 text-xs">
                  {method.description}
                </Text>
              </View>
              {selectedPayment === method.id && (
                <Ionicons name="checkmark-circle" size={24} color="#496c60" />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Place Order Button */}
      <View
        className="px-5 py-4 border-t border-gray-200 bg-white"
        style={{ position: "absolute", bottom: 0, left: 0, right: 0 }}
      >
        <TouchableOpacity
          onPress={handlePlaceOrder}
          disabled={loading || items.length === 0}
          className="rounded-2xl py-4 items-center"
          style={{
            backgroundColor:
              loading || items.length === 0 ? "#9CA3AF" : "#496c60",
          }}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white font-bold text-base">Place Order</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* VNPay WebView Modal */}
      {vnpayUrl && (
        <Modal visible={true} animationType="slide">
          <View style={{ flex: 1 }}>
            {/* Header của Modal */}
            <View
              style={{
                height: 60,
                flexDirection: "row",
                alignItems: "center",
                paddingHorizontal: 10,
                backgroundColor: "#496c60",
              }}
            >
              <TouchableOpacity
                onPress={() => setVnpayUrl(null)}
                style={{ padding: 10 }}
              >
                <Ionicons name="close" size={28} color="#fff" />
              </TouchableOpacity>
              <Text style={{ color: "#fff", fontSize: 18, marginLeft: 10 }}>
                VNPay Payment
              </Text>
            </View>

            {/* ĐÂY LÀ CHỖ THAY THẾ/THÊM VÀO */}
            <WebView
              source={{ uri: vnpayUrl }}
              onNavigationStateChange={handleWebViewNavigation}
              // Thêm thuộc tính này để chặn trang 404 xuất hiện
              onShouldStartLoadWithRequest={(request) => {
                // Nếu URL chứa 'vnpay-return', ta chặn không cho load tiếp
                if (request.url.includes("vnpay-return")) {
                  handleWebViewNavigation(request); // Chạy logic xử lý kết quả
                  return false; // Trả về false để WebView dừng lại, không hiện trang 404
                }
                return true;
              }}
              // Thêm các thuộc tính này để WebView chạy mượt hơn
              javaScriptEnabled={true}
              domStorageEnabled={true}
              startInLoadingState={true}
              renderLoading={() => (
                <ActivityIndicator
                  color="#496c60"
                  size="large"
                  style={{ position: "absolute", top: "50%", left: "45%" }}
                />
              )}
            />
          </View>
        </Modal>
      )}
    </View>
  );
}
