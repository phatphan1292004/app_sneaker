import api from "./api";

export interface Review {
  _id?: string;
  product_id: string;
  user_id: string;
  content: string;
  rating: number;
  parent_id?: string;
  createdAt?: string;
  user?: {
    username?: string;
    avatar?: string;
  };
}

export const reviewService = {
  // Lấy tất cả bình luận của sản phẩm (dạng phẳng)
  getReviews: async (productId: string): Promise<Review[]> => {
    const res = await api.get(`/reviews/product/${productId}`);
    return res.data;
  },

  // Đăng bình luận mới
  postReview: async (
    review: Omit<Review, "_id" | "createdAt">
  ): Promise<Review> => {
    // Nếu là reply thì loại bỏ rating
    const { rating, ...rest } = review;
    const data = review.parent_id ? rest : review;
    const res = await api.post(`/reviews`, data);
    return res.data;
  },
};
