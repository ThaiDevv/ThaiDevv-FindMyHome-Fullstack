import axios from 'axios';

const axiosClient = axios.create({
  // CƠ CHẾ TỰ ĐỘNG CHUYỂN ĐỔI URL:
  // 1. Nếu có biến môi trường VITE_API_URL (lúc deploy), nó dùng link đó.
  // 2. Nếu không có (lúc chạy máy local), nó dùng mặc định http://localhost:5000/api
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor: Tự động gắn Token vào mọi request (Giữ nguyên như cũ)
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosClient;