import axios from 'axios';

// Lấy API Base URL từ biến môi trường .env
// Cập nhật EXPO_PUBLIC_API_BASE_URL trong file .env theo môi trường:
// - Điện thoại thật: http://192.168.1.136:3000 (IP máy)
// - Android Emulator: http://10.0.2.2:3000
// - iOS Simulator/Web: http://localhost:3000
const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:3000';

// Tạo axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - thêm token vào header
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - xử lý error chung
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server trả về error
      const { status, data } = error.response;
      
      if (status === 401) {
        // Unauthorized - redirect to login
        console.log('Unauthorized, redirecting to login...');
      } else if (status === 500) {
        console.error('Server error:', data);
      }
    } else if (error.request) {
      // Request được gửi nhưng không nhận được response
      console.error('Network error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default api;
