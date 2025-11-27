import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // 1. Import để chuyển trang
import { toast } from 'react-toastify';         // 2. Import để hiện thông báo đẹp
import axios from '../api/axiosClient';
import { useAuth } from './AuthContext';

export const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const navigate = useNavigate(); // Khởi tạo hook điều hướng

  // Tải danh sách khi user thay đổi
  useEffect(() => {
    if (user) {
      fetchFavorites();
    } else {
      setFavorites([]); // Reset nếu logout
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

  // --- HÀM XỬ LÝ LIKE / UNLIKE ---
  const toggleFavorite = async (room) => {
    // 1. KIỂM TRA ĐĂNG NHẬP (Chặn ngay tại đây)
    if (!user) {
      toast.warning("Bạn cần đăng nhập để lưu phòng yêu thích!");
      navigate('/auth'); // Chuyển ngay sang trang Login
      return;
    }

    const isLiked = favorites.some(fav => fav.id === room.id);

    try {
      if (isLiked) {
        // Nếu đã thích -> Bỏ thích
        await axios.delete(`/favorites/${room.id}`);
        setFavorites(prev => prev.filter(fav => fav.id !== room.id));
        toast.info("Đã bỏ khỏi danh sách yêu thích");
      } else {
        // Nếu chưa thích -> Thêm vào
        await axios.post('/favorites', { room_id: room.id });
        setFavorites(prev => [...prev, room]);
        toast.success("Đã thêm vào danh sách yêu thích");
      }
    } catch (error) {
      toast.error("Lỗi cập nhật! Vui lòng thử lại.");
      fetchFavorites(); // Load lại nếu lỗi để đồng bộ
    }
  };

  const isLiked = (id) => favorites.some(fav => fav.id === id);

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isLiked }}>
      {children}
    </FavoritesContext.Provider>
  );
};