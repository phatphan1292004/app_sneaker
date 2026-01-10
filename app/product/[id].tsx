import ProductReview from "@/components/product/ProductReview";
import SimpleTabBar from "@/components/tabbar/SimpleTabBar";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { useProductDetail } from "@/hooks/useProductDetail";
import { favoriteService } from "@/services/favoriteService";
import { reviewService, Review as ReviewType } from "@/services/reviewService";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import Toast from "react-native-toast-message";

export default function ProductDetailScreen() {
  // State cho bình luận
  const [reviews, setReviews] = useState<ReviewType[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [reviewError, setReviewError] = useState<string | null>(null);
  const params = useLocalSearchParams();
  const productId = params.id as string;

  const { product, loading, error } = useProductDetail(productId);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [submittingReplyId, setSubmittingReplyId] = useState<
    string | undefined
  >(undefined);

  // Hàm gửi trả lời bình luận
  const handleSubmitReply = async (
    reply: Omit<ReviewType, "_id" | "createdAt">
  ) => {
    if (!reply.parent_id) return;
    setSubmittingReplyId(reply.parent_id);
    try {
      const newReply = await reviewService.postReview(reply);
      setReviews((prev) => [newReply, ...prev]);
      Toast.show({
        type: "success",
        text1: "Đã gửi trả lời!",
        position: "bottom",
      });
    } catch (e) {
      console.error(e);
      Toast.show({
        type: "error",
        text1: "Gửi trả lời thất bại!",
        position: "bottom",
      });
    } finally {
      setSubmittingReplyId(undefined);
    }
  };

  // Hàm gửi bình luận
  const handleSubmitReview = async (
    review: Omit<ReviewType, "_id" | "createdAt">
  ) => {
    setSubmittingReview(true);

    try {
      const newReview = await reviewService.postReview(review);
      setReviews((prev) => [newReview, ...prev]);
      Toast.show({
        type: "success",
        text1: "Đã gửi bình luận!",
        position: "bottom",
      });
    } catch (e) {
      Toast.show({
        type: "error",
        text1: "Gửi bình luận thất bại!",
        position: "bottom",
      });
    } finally {
      setSubmittingReview(false);
    }
  };

  // Lấy danh sách bình luận khi có productId
  useEffect(() => {
    if (!productId) return;
    setLoadingReviews(true);
    reviewService
      .getReviews(productId)
      .then(setReviews)
      .catch(() => setReviewError("Không thể tải bình luận"))
      .finally(() => setLoadingReviews(false));
  }, [productId]);

  const { addItem } = useCart();
  const { user } = useAuth();

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState<"description" | "review">(
    "description"
  );

  // Check if product is in favorites on load
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (!user || !product) return;

      try {
        const result = await favoriteService.getUserFavorites(user.uid);
        if (result.success) {
          const isFav = result.data.some((p) => p._id === product._id);
          setIsFavorite(isFav);
        }
      } catch (error) {
        console.error("Error checking favorite status:", error);
      }
    };

    checkFavoriteStatus();
  }, [user, product]);

  // Get unique colors from variants
  const availableColors = useMemo(() => {
    if (!product?.variants) return [];
    return [...new Set(product.variants.map((v) => v.color))];
  }, [product]);

  // Get sizes filtered by selected color
  const availableSizes = useMemo(() => {
    if (!product?.variants) return [];

    // If a color is selected, only show sizes for that color
    if (selectedColor) {
      return [
        ...new Set(
          product.variants
            .filter((v) => v.color === selectedColor)
            .map((v) => v.size)
        ),
      ].sort();
    }

    // If no color selected, show all sizes
    return [...new Set(product.variants.map((v) => v.size))].sort();
  }, [product, selectedColor]);

  // Reset selected size when color changes
  useEffect(() => {
    if (selectedColor && !availableSizes.includes(selectedSize)) {
      setSelectedSize("");
    }
  }, [selectedColor, availableSizes, selectedSize]);

  // Get brand name
  const brandName = useMemo(() => {
    if (!product) return "";
    return typeof product.brand_id === "object" ? product.brand_id.name : "";
  }, [product]);

  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  // Get selected variant
  const selectedVariant = useMemo(() => {
    if (!product?.variants || !selectedColor || !selectedSize) return null;
    return product.variants.find(
      (v) => v.color === selectedColor && v.size === selectedSize
    );
  }, [product, selectedColor, selectedSize]);

  // Handle toggle favorite
  const handleToggleFavorite = async () => {
    if (!user) {
      Toast.show({
        type: "error",
        text1: "Login Required",
        text2: "Please log in to add products to favorites",
        position: "bottom",
      });
      return;
    }

    if (!product) return;

    try {
      const result = await favoriteService.toggleFavorite(user.uid, product._id);

      if (result.success) {
        setIsFavorite(!isFavorite);
        Toast.show({
          type: "success",
          text1: result.message,
          position: "bottom",
        });
      } else {
        Toast.show({
          type: "error",
          text1: "Failed",
          text2: result.message,
          position: "bottom",
        });
      }
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error.message || "Failed to update favorite",
        position: "bottom",
      });
    }
  };

  // Handle add to cart
  const handleAddToCart = () => {
    if (!product) return;

    if (!selectedVariant) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Selected variant not available",
        position: "bottom",
      });
      return;
    }

    if (selectedVariant.stock <= 0) {
      Toast.show({
        type: "error",
        text1: "Out of Stock",
        text2: "This variant is currently unavailable",
        position: "bottom",
      });
      return;
    }

    // Calculate discounted price
    const finalPrice = product.discount && product.discount > 0
      ? selectedVariant.price * (1 - product.discount / 100)
      : selectedVariant.price;

    addItem({
      productId: product._id,
      variantId: selectedVariant._id,
      name: product.name,
      brand: brandName,
      image: product.images[0],
      color: selectedColor,
      size: selectedSize,
      price: finalPrice,
    });

    Toast.show({
      type: "success",
      text1: "Added to Cart",
      text2: `${product.name} (${selectedColor}, Size ${selectedSize}) has been added.`,
      position: "bottom",
    });
  };

  if (loading) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#496c60" />
        <Text className="mt-2 text-gray-600">Loading product</Text>
      </View>
    );
  }

  if (error || !product) {
    return (
      <View className="flex-1 bg-white items-center justify-center px-5">
        <Ionicons name="alert-circle-outline" size={64} color="#ef4444" />
        <Text className="text-lg font-semibold text-gray-900 mt-4">
          {error || "Product not found"}
        </Text>
        <TouchableOpacity
          onPress={() => router.back()}
          className="mt-6 px-6 py-3 rounded-full"
          style={{ backgroundColor: "#496c60" }}
        >
          <Text className="text-white font-semibold">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white pt-12">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-5 py-2 flex-row items-center justify-between">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center"
          >
            <Ionicons name="chevron-back" size={24} color="#000" />
          </TouchableOpacity>

          <Image
            source={{
              uri: typeof product.brand_id === "object" && product.brand_id.logo
                ? product.brand_id.logo
                : "https://cdn.dribbble.com/userupload/31584578/file/original-050b602625e120a96798e483b9199f46.png?format=webp&resize=450x338&vertical=center",
            }}
            className="w-14 h-14 rounded-lg"
            resizeMode="contain"
          />

          <TouchableOpacity
            onPress={handleToggleFavorite}
            className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center"
          >
            <Ionicons
              name={isFavorite ? "heart" : "heart-outline"}
              size={24}
              color={isFavorite ? "#FF4757" : "#000"}
            />
          </TouchableOpacity>
        </View>

        {/* Product Image with Overlapping Thumbnails */}
        <View className="mb-6 relative">
          <Image
            source={{ uri: product.images[selectedImageIndex] }}
            style={{ width: "100%", height: 320, borderRadius: 12 }}
            resizeMode="cover"
          />

          {/* Dark Overlay */}
          <View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              borderRadius: 12,
              backgroundColor: "rgba(0, 0, 0, 0.15)",
            }}
          />

          {/* Image Selector Overlay */}
          <View
            className="absolute -bottom-8 left-0 right-0 px-5"
            style={{
              flexDirection: "row",
              justifyContent: "center",
              gap: 12,
            }}
          >
            {product.images.map((image, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => setSelectedImageIndex(index)}
                className="rounded-xl overflow-hidden"
                style={{
                  borderWidth: selectedImageIndex === index ? 2 : 0,
                  borderColor: "#496c60",
                  backgroundColor: "rgba(255, 255, 255, 0.9)",
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.25,
                  shadowRadius: 3.84,
                  elevation: 5,
                }}
              >
                <Image
                  source={{ uri: image }}
                  className="w-20 h-20"
                  resizeMode="cover"
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Product Info */}
        <View className="px-5 pt-10">
          <Text className="text-sm mb-2 font-semibold" style={{ color: "#496c60" }}>
            {brandName}
          </Text>
          <Text className="text-2xl font-bold text-gray-900 mb-3">
            {product.name}
          </Text>

          {/* Discount and Sold Info */}
          <View className="flex-row items-center mb-6" style={{ gap: 8 }}>
            {product.discount && product.discount > 0 && (
              <View
                className="px-3 py-1 rounded-full"
                style={{ backgroundColor: "#fee2e2" }}
              >
                <Text className="text-xs font-bold" style={{ color: "#dc2626" }}>
                  -{product.discount}% OFF
                </Text>
              </View>
            )}
            {product.sold && product.sold > 0 && (
              <View
                className="px-3 py-1 rounded-full"
                style={{ backgroundColor: "#dbeafe" }}
              >
                <Text className="text-xs font-semibold" style={{ color: "#2563eb" }}>
                  {product.sold} Sold
                </Text>
              </View>
            )}
          </View>

          {/* Select Color */}
          {availableColors.length > 0 && (
            <>
              <Text className="text-base font-semibold text-gray-900 mb-3">
                Select Color
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                className="mb-6"
                contentContainerStyle={{ gap: 12 }}
              >
                {availableColors.map((color) => (
                  <TouchableOpacity
                    key={color}
                    onPress={() => setSelectedColor(color)}
                    className="px-3 h-10 rounded-full text-sm items-center justify-center"
                    style={{
                      backgroundColor:
                        selectedColor === color ? "#496c60" : "#f3f4f6",
                      borderWidth: selectedColor === color ? 2 : 0,
                      borderColor: "#496c60",
                    }}
                  >
                    <Text
                      className="font-semibold"
                      style={{
                        color: selectedColor === color ? "#fff" : "#6b7280",
                      }}
                    >
                      {color}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </>
          )}

          {/* Select Size */}
          {availableSizes.length > 0 && (
            <>
              <Text className="text-base font-semibold text-gray-900 mb-3">
                Select Size
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                className="mb-6"
                contentContainerStyle={{ gap: 12 }}
              >
                {availableSizes.map((size) => (
                  <TouchableOpacity
                    key={size}
                    onPress={() => setSelectedSize(size)}
                    className="w-10 h-10 rounded-full items-center justify-center"
                    style={{
                      backgroundColor:
                        selectedSize === size ? "#496c60" : "#f3f4f6",
                    }}
                  >
                    <Text
                      className="font-semibold"
                      style={{
                        color: selectedSize === size ? "#fff" : "#6b7280",
                      }}
                    >
                      {size}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </>
          )}

          {/* Tabs */}
          <View className="flex-row mb-4 border-b border-gray-200">
            <TouchableOpacity
              onPress={() => setActiveTab("description")}
              className="flex-1 pb-3"
              style={{
                borderBottomWidth: activeTab === "description" ? 2 : 0,
                borderBottomColor: "#496c60",
              }}
            >
              <Text
                className="text-center font-semibold"
                style={{
                  color: activeTab === "description" ? "#496c60" : "#9ca3af",
                }}
              >
                Description
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setActiveTab("review")}
              className="flex-1 pb-3"
              style={{
                borderBottomWidth: activeTab === "review" ? 2 : 0,
                borderBottomColor: "#496c60",
              }}
            >
              <Text
                className="text-center font-semibold"
                style={{
                  color: activeTab === "review" ? "#496c60" : "#9ca3af",
                }}
              >
                Review
              </Text>
            </TouchableOpacity>
          </View>

          {/* Tab Content */}
          {activeTab === "description" ? (
            <Text className="text-sm text-gray-600 leading-6 mb-8">
              {product.description}
            </Text>
          ) : (
            <ProductReview
              productId={productId}
              reviews={reviews}
              onSubmitReview={handleSubmitReview}
              submitting={submittingReview}
              onSubmitReply={handleSubmitReply}
              submittingReplyId={submittingReplyId}
            />
          )}
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <View
        className="py-2 pr-5 flex-row items-center gap-3 bg-white"
        style={{
          borderTopWidth: 1,
          borderTopColor: "#e5e7eb",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.05,
          shadowRadius: 4,
          elevation: 5,
        }}
      >
        <View className="flex-1 px-5 py-4" style={{ borderColor: "#496c60" }}>
          {product.discount && product.discount > 0 ? (
            <View>
              <Text
                className="text-sm text-gray-400 line-through mb-1"
              >
                {selectedVariant
                  ? formatPrice(selectedVariant.price)
                  : formatPrice(product.base_price)}
              </Text>
              <Text className="font-bold text-lg" style={{ color: "#496c60" }}>
                {selectedVariant
                  ? formatPrice(selectedVariant.price * (1 - product.discount / 100))
                  : formatPrice(product.base_price * (1 - product.discount / 100))}
              </Text>
            </View>
          ) : (
            <Text className="font-bold text-lg" style={{ color: "#496c60" }}>
              {selectedVariant
                ? formatPrice(selectedVariant.price)
                : formatPrice(product.base_price)}
            </Text>
          )}
        </View>

        <TouchableOpacity
          onPress={handleAddToCart}
          disabled={!selectedVariant || selectedVariant.stock <= 0}
          className="flex-1 rounded-full px-5 py-3 flex-row items-center justify-center"
          style={{
            backgroundColor:
              !selectedVariant || selectedVariant.stock <= 0
                ? "#9ca3af"
                : "#496c60",
          }}
        >
          <Ionicons name="cart-outline" size={20} color="#fff" />
          <Text className="text-white font-semibold text-base ml-2">
            {!selectedVariant
              ? "Select Options"
              : selectedVariant.stock <= 0
                ? "Out of Stock"
                : "Add to Cart"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Simple Tab Bar */}
      <SimpleTabBar />
    </View>
  );
}
