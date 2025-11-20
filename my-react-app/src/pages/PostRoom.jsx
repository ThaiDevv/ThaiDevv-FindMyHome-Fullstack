import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { toast } from 'react-toastify';
const PostRoom = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    type: 'Nhà trọ',
    price: '',
    area: '',
    location: 'Thành phố Thủ Đức',
    address: '',
    description: '',
    image_url: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.success("Vui lòng đăng nhập để đăng tin!");
      return;
    }
    try {
      // Gọi API đăng tin
      await axios.post('http://localhost:5000/api/rooms', {
        ...formData,
        owner_id: user.id
      });
      toast.success('Đăng tin thành công!');
      navigate('/search');
    } catch (err) {
      console.error(err);
      toast.error('Có lỗi xảy ra khi đăng tin.');
    }
  };

  return (
    <>
      <Navbar />
      
      {/* --- PHẦN SỬA ĐỔI CHÍNH Ở ĐÂY --- */}
      {/* Sử dụng Flexbox để căn giữa thay vì dùng class của Auth */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 'calc(100vh - 80px)', // Trừ đi chiều cao navbar
        backgroundColor: '#f5f5f7',
        padding: '40px 20px'
      }}>
        
        {/* Khung chứa Form màu trắng */}
        <div style={{
          backgroundColor: '#ffffff',
          width: '100%',
          maxWidth: '700px', // Giới hạn chiều rộng form
          padding: '40px',
          borderRadius: '20px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.08)'
        }}>
          
          <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
            <h1 style={{textAlign: 'center', color: '#1d1d1f', marginBottom: '10px'}}>Đăng Tin Mới</h1>
            <p style={{textAlign: 'center', color: '#86868b', marginTop: '-10px', marginBottom: '20px'}}>
              Nhập thông tin chi tiết để thu hút người thuê
            </p>

            {/* Tiêu đề */}
            <div className="input-group">
              <label style={{fontWeight: '500', marginBottom: '8px', display: 'block'}}>Tiêu đề bài đăng</label>
              <input 
                name="title" 
                type="text" 
                placeholder="VD: Phòng trọ giá rẻ gần đại học..." 
                required 
                onChange={handleChange}
                style={inputStyle}
              />
            </div>

            {/* Hàng đôi: Loại phòng + Khu vực */}
            <div style={{display: 'flex', gap: '20px', flexWrap: 'wrap'}}>
              <div style={{flex: 1, minWidth: '200px'}}>
                <label style={{fontWeight: '500', marginBottom: '8px', display: 'block'}}>Loại hình</label>
                <select name="type" onChange={handleChange} style={inputStyle}>
                    <option>Nhà trọ</option>
                    <option>Căn hộ chung cư</option>
                    <option>Nhà nguyên căn</option>
                    <option>Ở ghép</option>
                </select>
              </div>
              <div style={{flex: 1, minWidth: '200px'}}>
                <label style={{fontWeight: '500', marginBottom: '8px', display: 'block'}}>Khu vực</label>
                <select name="location" onChange={handleChange} style={inputStyle}>
                    <option>Thành phố Thủ Đức</option>
                    <option>Quận Gò Vấp</option>
                    <option>Quận 12</option>
                    <option>Quận 7</option>
                    <option>Quận Bình Thạnh</option>
                    <option>Quận 1</option>
                    <option>Quận Tân Bình</option>
                </select>
              </div>
            </div>

            {/* Hàng đôi: Giá + Diện tích */}
            <div style={{display: 'flex', gap: '20px', flexWrap: 'wrap'}}>
              <div style={{flex: 1, minWidth: '200px'}}>
                <label style={{fontWeight: '500', marginBottom: '8px', display: 'block'}}>Giá thuê (VNĐ)</label>
                <input name="price" type="number" placeholder="VD: 3000000" required onChange={handleChange} style={inputStyle} />
              </div>
              <div style={{flex: 1, minWidth: '200px'}}>
                <label style={{fontWeight: '500', marginBottom: '8px', display: 'block'}}>Diện tích (m²)</label>
                <input name="area" type="number" placeholder="VD: 25" required onChange={handleChange} style={inputStyle} />
              </div>
            </div>

            {/* Địa chỉ */}
            <div>
              <label style={{fontWeight: '500', marginBottom: '8px', display: 'block'}}>Địa chỉ chi tiết</label>
              <input name="address" type="text" placeholder="Số nhà, tên đường, phường..." required onChange={handleChange} style={inputStyle} />
            </div>

            {/* Hình ảnh */}
            <div>
              <label style={{fontWeight: '500', marginBottom: '8px', display: 'block'}}>Link hình ảnh (URL)</label>
              <input name="image_url" type="text" placeholder="https://..." required onChange={handleChange} style={inputStyle} />
            </div>

            {/* Mô tả */}
            <div>
              <label style={{fontWeight: '500', marginBottom: '8px', display: 'block'}}>Mô tả chi tiết</label>
              <textarea 
                  name="description" 
                  placeholder="Mô tả về tiện ích, giờ giấc, nội thất..." 
                  onChange={handleChange}
                  style={{...inputStyle, minHeight: '120px', resize: 'vertical'}}
              ></textarea>
            </div>

            <button 
              type="submit" 
              className="primary-btn" 
              style={{width: '100%', marginTop: '10px', padding: '16px', fontSize: '18px'}}
            >
              Đăng Tin Ngay
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

// Style chung cho các ô input để code gọn hơn
const inputStyle = {
  width: '100%',
  padding: '12px 16px',
  borderRadius: '12px',
  border: '1px solid #d2d2d7',
  backgroundColor: '#ffffff',
  fontSize: '16px',
  outline: 'none',
  transition: 'border-color 0.2s'
};

export default PostRoom;