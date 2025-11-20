import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// 👇 ĐOẠN QUAN TRỌNG: Tự động gắn Token vào mọi yêu cầu gửi đi
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // Lấy token từ kho
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; // Gắn vào header
  }
  return config;
});
// ☝️

export default axiosClient;