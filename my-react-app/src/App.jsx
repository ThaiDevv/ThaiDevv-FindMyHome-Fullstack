import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Search from './pages/Search';
import Like from './pages/Like';
import Auth from './pages/Auth';
import RoomDetails from './pages/RoomDetails';
import { FavoritesProvider } from './context/FavoritesContext';
import { AuthProvider } from './context/AuthContext'; // <--- 1. Import cái này
import PostRoom from './pages/PostRoom';
import HostDashboard from './pages/HostDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function App() {
  return (
    // 2. Bọc AuthProvider ra ngoài cùng (hoặc lồng nhau với FavoritesProvider)
    <AuthProvider> 
      <FavoritesProvider>
        <ToastContainer position="top-right" autoClose={3000} />
        <Routes>
          <Route path="/host-dashboard" element={<HostDashboard />} />
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/like" element={<Like />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/room/:id" element={<RoomDetails />} />
          <Route path="/post-room" element={<PostRoom />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Routes>
      </FavoritesProvider>
    </AuthProvider>
  );
}

export default App;