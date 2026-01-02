import { useAuth } from "@/contexts/AuthContext";
import { Review } from "@/services/reviewService";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export interface ProductReviewProps {
  productId?: string;
  reviews?: Review[];
  onSubmitReview?: (review: Omit<Review, "_id" | "createdAt">) => Promise<void>;
  submitting?: boolean;
  onSubmitReply?: (reply: Omit<Review, "_id" | "createdAt">) => Promise<void>;
  submittingReplyId?: string;
}

const ProductReview: React.FC<ProductReviewProps> = ({
  productId,
  reviews = [],
  onSubmitReview,
  submitting,
  onSubmitReply,
  submittingReplyId,
}) => {
  const [content, setContent] = useState("");
  const [rating, setRating] = useState(5);
  const [error, setError] = useState("");
  const [replyContent, setReplyContent] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyError, setReplyError] = useState("");
  const user = useAuth().user;

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
          ({reviews.length} reviews)
        </Text>
      </View>

      {/* Form nhập review */}
      {onSubmitReview && (
        <View className="bg-gray-100 rounded-xl p-4 mb-4">
          <Text className="font-semibold mb-2">Review</Text>

          <View className="flex-row mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity key={star} onPress={() => setRating(star)}>
                <Ionicons
                  name={star <= rating ? "star" : "star-outline"}
                  size={20}
                  color="#FFC107"
                />
              </TouchableOpacity>
            ))}
          </View>

          <TextInput
            className="bg-white rounded-lg px-3 py-2 mb-2 min-h-[100px] border border-gray-200"
            placeholder="Nhập bình luận của bạn..."
            value={content}
            onChangeText={setContent}
            multiline
          />

          {!!error && <Text className="text-red-500 mb-2">{error}</Text>}

          <TouchableOpacity
            className="bg-[#496c60] rounded-lg py-3 items-center"
            onPress={() => {
              if (!content.trim()) {
                setError("Vui lòng nhập bình luận");
                return;
              }
              setError("");
              onSubmitReview({
                content: content,
                rating: rating,
                product_id: productId || "",
                user_id: user ? user.uid : "",
              });
            }}
            disabled={submitting}
          >
            {submitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white font-semibold">Submit</Text>
            )}
          </TouchableOpacity>
        </View>
      )}

      {/* Danh sách review */}
      {reviews.filter((review) => !review.parent_id).map((review) => (
        <View key={review._id} className="bg-gray-50 rounded-xl p-4 mb-3">
          <View className="flex-row justify-between mb-2">
            <View className="flex-row items-center flex-1">
              {review.user?.avatar ? (
                <Image
                  source={{ uri: review.user.avatar }}
                  className="w-8 h-8 rounded-full mr-2"
                />
              ) : (
                <View className="w-8 h-8 rounded-full bg-gray-300 mr-2 items-center justify-center">
                  <Ionicons name="person" size={16} color="#666" />
                </View>
              )}
              <Text className="font-semibold">
                {review.user?.username || "Người dùng"}
              </Text>
            </View>
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
          <Text className="text-sm text-gray-600 mb-2">{review.content}</Text>
          <TouchableOpacity
            className="mb-2 self-end"
            onPress={() => {
              setReplyingTo(replyingTo === review._id ? null : review._id || null);
              setReplyContent("");
              setReplyError("");
            }}
          >
            <Text className="text-xs text-gray-700 font-semibold">Reply</Text>
          </TouchableOpacity>
          {/* Form trả lời */}
          {replyingTo === review._id && (
            <View className="mb-2 ml-5">
              <TextInput
                className="bg-white rounded-lg px-3 py-2 mb-2 min-h-[80px] border border-gray-200"
                placeholder="Nhập trả lời của bạn..."
                value={replyContent}
                onChangeText={setReplyContent}
                multiline
              />
              {!!replyError && <Text className="text-red-500 mb-2">{replyError}</Text>}
              <TouchableOpacity
                className="bg-[#496c60] rounded-lg py-3 items-center"
                onPress={async () => {
                  if (!replyContent.trim()) {
                    setReplyError("Vui lòng nhập trả lời");
                    return;
                  }
                  setReplyError("");
                  if (onSubmitReply) {
                    await onSubmitReply({
                      content: replyContent,
                      rating: 0,
                      product_id: productId || "",
                      user_id: user ? user.uid : "",
                      parent_id: review._id,
                    });
                    setReplyContent("");
                    setReplyingTo(null);
                  }
                }}
                disabled={submittingReplyId === review._id}
              >
                {submittingReplyId === review._id ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text className="text-white font-semibold">Submit Reply</Text>
                )}
              </TouchableOpacity>
            </View>
          )}
          {/* Danh sách trả lời */}
          {reviews.filter((r) => r.parent_id === review._id).length > 0 && (
            <View className="pl-4 ml-4 border-l-2 border-gray-200 mt-2">
              {reviews
                .filter((r) => r.parent_id === review._id)
                .map((reply) => (
                  <View key={reply._id} className="mb-2">
                    <View className="flex-row items-center mb-1">
                      {reply.user?.avatar ? (
                        <Image
                          source={{ uri: reply.user.avatar }}
                          className="w-6 h-6 rounded-full mr-2"
                        />
                      ) : (
                        <View className="w-6 h-6 rounded-full bg-gray-300 mr-2 items-center justify-center">
                          <Ionicons name="person" size={12} color="#666" />
                        </View>
                      )}
                      <Text className="font-semibold text-xs">
                        {reply.user?.username || "Người dùng"}
                      </Text>
                    </View>
                    <Text className="text-xs text-gray-600 ml-8">{reply.content}</Text>
                  </View>
                ))}
            </View>
          )}
        </View>
      ))}
    </View>
  );
};

export default ProductReview;
