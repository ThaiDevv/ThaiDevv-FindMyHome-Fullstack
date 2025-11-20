import React, { createContext, useState, useEffect } from 'react';
import axios from '../api/axiosClient'; // Dùng client đã cấu hình Token
import { useAuth } from './AuthContext'; // Lấy thông tin User
import { toast } from 'react-toastify';
export const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const { user } = useAuth(); // Lấy user hiện tại
  const [favorites, setFavorites] = useState([]);

  // 1. Khi User thay đổi (Đăng nhập/Đăng xuất/F5), tải lại danh sách yêu thích của người đó
  useEffect(() => {
    if (user) {
      fetchFavorites();
    } else {
      setFavorites([]); // Nếu chưa đăng nhập thì danh sách rỗng
    }
  }, [user]);

  const fetchFavorites = async () => {
    try {
      const res = await axios.get('/favorites');
      setFavorites(res.data);
    } catch (error) {
      console.error("Lỗi tải danh sách yêu thích:", error);
    }
  };

  // 2. Hàm Toggle (Like/Unlike)
  const toggleFavorite = async (room) => {
    if (!user) {
      toast.success("Vui lòng đăng nhập để lưu phòng yêu thích!");
      return;
    }

    const isLiked = favorites.some(fav => fav.id === room.id);

    try {
      if (isLiked) {
        // Nếu đã thích -> Gọi API Xóa
        await axios.delete(`/favorites/${room.id}`);
        // Cập nhật giao diện ngay lập tức (Optimistic UI)
        setFavorites(prev => prev.filter(fav => fav.id !== room.id));
      } else {
        // Nếu chưa thích -> Gọi API Thêm
        await axios.post('/favorites', { room_id: room.id });
        // Cập nhật giao diện
        setFavorites(prev => [...prev, room]);
      }
    } catch (error) {
      alert("Lỗi cập nhật yêu thích!");
      fetchFavorites(); // Nếu lỗi thì load lại dữ liệu gốc cho đúng
    }
  };

  const isLiked = (id) => favorites.some(fav => fav.id === id);

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isLiked }}>
      {children}
    </FavoritesContext.Provider>
  );
};