import React, { useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { toast } from 'react-toastify';
const ForgotPassword = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/forgot-password', { email });
      toast.success(res.data.message);
    } catch (err) {
      toast.error("Lỗi gửi yêu cầu.");
    }
  };

  return (
    <>
      <Navbar />
      <div style={{height: '60vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#f5f5f7'}}>
        <form onSubmit={handleSubmit} style={{background: 'white', padding: '40px', borderRadius: '12px', width: '100%', maxWidth: '400px'}}>
          <h2>Quên Mật Khẩu?</h2>
          <p>Nhập email để nhận link khôi phục.</p>
          <input 
            type="email" placeholder="Nhập email của bạn" required 
            value={email} onChange={e => setEmail(e.target.value)}
            style={{width: '100%', padding: '12px', margin: '20px 0', borderRadius: '8px', border: '1px solid #ddd'}}
          />
          <button type="submit" className="primary-btn" style={{width: '100%'}}>Gửi Yêu Cầu</button>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default ForgotPassword;