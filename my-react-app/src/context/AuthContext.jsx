// src/context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Khi web vừa load, kiểm tra xem trong kho lưu trữ có user chưa
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Hàm Đăng nhập
  const login = (userData, token) => {
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', token);
    setUser(userData); // Cập nhật State để Navbar tự đổi ngay lập tức
  };

  // Hàm Đăng xuất
  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null); // Navbar sẽ tự quay về nút Login
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook để gọi nhanh ở các component khác
export const useAuth = () => useContext(AuthContext);