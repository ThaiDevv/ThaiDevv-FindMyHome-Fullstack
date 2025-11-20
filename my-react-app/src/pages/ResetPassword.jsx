import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { toast } from 'react-toastify';
const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token'); // Lấy token từ URL
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp!");
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/auth/reset-password', { 
        token, 
        newPassword 
      });
      toast.success("Đổi mật khẩu thành công! Vui lòng đăng nhập.");
      navigate('/auth');
    } catch (err) {
      toast.error(err.response?.data?.message || "Lỗi đổi mật khẩu.");
    }
  };

  if (!token) return <p style={{textAlign:'center', marginTop:'50px'}}>Link không hợp lệ (Thiếu token).</p>;

  return (
    <>
      <Navbar />
      <div style={{height: '60vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#f5f5f7'}}>
        <form onSubmit={handleSubmit} style={{background: 'white', padding: '40px', borderRadius: '12px', width: '100%', maxWidth: '400px'}}>
          <h2>Đặt Lại Mật Khẩu</h2>
          <div style={{marginBottom: '15px'}}>
            <input 
              type="password" placeholder="Mật khẩu mới" required 
              value={newPassword} onChange={e => setNewPassword(e.target.value)}
              style={{width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd'}}
            />
          </div>
          <div style={{marginBottom: '20px'}}>
            <input 
              type="password" placeholder="Xác nhận mật khẩu mới" required 
              value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
              style={{width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd'}}
            />
          </div>
          <button type="submit" className="primary-btn" style={{width: '100%'}}>Lưu Mật Khẩu</button>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default ResetPassword;