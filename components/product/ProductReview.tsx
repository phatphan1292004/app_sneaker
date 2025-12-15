import { Review } from "@/services/reviewService";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export interface ProductReviewProps {
  reviews?: Review[];
  onSubmitReview?: (review: Omit<Review, "_id" | "createdAt">) => Promise<void>;
  submitting?: boolean;
}

const ProductReview: React.FC<ProductReviewProps> = ({
  reviews = [],
  onSubmitReview,
  submitting,
}) => {
  const [content, setContent] = useState("");
  const [rating, setRating] = useState(5);
  const [error, setError] = useState("");

  return (
    <View className="mb-8">
      {/* Header */}
      <View className="flex-row items-center mb-4">
        <Ionicons name="star" size={20} color="#FFC107" />
        <Text className="text-lg font-bold ml-1">
          {reviews.length > 0
            ? (
                reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
              ).toFixed(1)
            : "0.0"}
        </Text>
        <Text className="text-sm text-gray-500 ml-1">
          ({reviews.length} đánh giá)
        </Text>
      </View>

      {/* Form nhập review */}
      {onSubmitReview && (
        <View className="bg-gray-100 rounded-xl p-4 mb-4">
          <Text className="font-semibold mb-2">Đánh giá sản phẩm</Text>

          <View className="flex-row mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity key={star} onPress={() => setRating(star)}>
                <Ionicons
                  name={star <= rating ? "star" : "star-outline"}
                  size={22}
                  color="#FFC107"
                />
              </TouchableOpacity>
            ))}
          </View>

          <TextInput
            className="bg-white rounded-lg px-3 py-2 mb-2 border border-gray-200"
            placeholder="Nhập bình luận của bạn..."
            value={content}
            onChangeText={setContent}
            multiline
          />

          {!!error && <Text className="text-red-500 mb-2">{error}</Text>}

          <TouchableOpacity
            className="bg-[#496c60] rounded-full py-2 items-center"
            onPress={() => {
              if (!content.trim()) {
                setError("Vui lòng nhập bình luận");
                return;
              }
              setError("");
              onSubmitReview({
                content: content,
                rating: rating,
                product_id: "",
                user_id: "anonymous",
              });
            }}
            disabled={submitting}
          >
            {submitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white font-semibold">Gửi bình luận</Text>
            )}
          </TouchableOpacity>
        </View>
      )}

      {/* Danh sách review */}
      {reviews.map((review) => (
        <View key={review._id} className="bg-gray-50 rounded-xl p-4 mb-3">
          <View className="flex-row justify-between mb-2">
            <Text className="font-semibold">
              {review.user_id || "Người dùng"}
            </Text>

            <View className="flex-row">
              {[...Array(5)].map((_, i) => (
                <Ionicons
                  key={i}
                  name={i < review.rating ? "star" : "star-outline"}
                  size={14}
                  color="#FFC107"
                />
              ))}
            </View>
          </View>

          <Text className="text-sm text-gray-600">{review.content}</Text>
        </View>
      ))}
    </View>
  );
};

export default ProductReview;
