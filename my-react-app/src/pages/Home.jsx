import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
// Import ảnh (giữ nguyên như cũ)
import kitchenImg from '../images/Kitchen.webp';
import livingRoomImg from '../images/livingRoom.webp';
import bedroomImg from '../images/bedRoom.webp';
import officeRoomImg from '../images/officeRoom.jpg';

const Home = () => {
  const navigate = useNavigate();

  // Hàm xử lý cuộn mượt xuống dưới
  const scrollToContent = () => {
    const section = document.getElementById('explore-section');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <Navbar />
      
      {/* HERO SECTION */}
      <section className="hero" style={{ padding: "0px" }}>
        <h1>Tìm Nhà Dễ Dàng, Nhanh Chóng & Tin Cậy</h1>
        <p>Khám phá hàng nghìn không gian sống tuyệt vời. Đánh giá, xem hình ảnh, đọc đánh giá và thuê nhà chỉ trong vài phút.</p>
        
        <div className="hero-buttons">
          <button className="primary-btn" onClick={() => navigate('/search')}>
            Tìm Kiếm Ngay
          </button>
          
          {/* Nút này giờ sẽ cuộn xuống dưới */}
          <button className="secondary-btn" onClick={scrollToContent}>
            Tìm Hiểu Thêm
          </button>
        </div>
      </section>

      {/* IMAGE SECTION */}
      {/* Thêm id="explore-section"  */}
      <section id="explore-section" className="image-section">
        <h2>Những Không Gian Tuyệt Vời Đang Chờ Bạn</h2>
        <div className="image-grid">
          <div className="image-card">
            <img src={kitchenImg} alt="Phòng bếp sang trọng" onError={(e)=>e.target.src='https://via.placeholder.com/300'} />
            <div className="image-card-title">Phòng Bếp Sang Trọng</div>
          </div>
          <div className="image-card">
            <img src={livingRoomImg} alt="Phòng khách mát mẻ" onError={(e)=>e.target.src='https://via.placeholder.com/300'} />
            <div className="image-card-title">Phòng Khách Mát Mẻ</div>
          </div>
          <div className="image-card">
            <img src={bedroomImg} alt="Phòng ngủ tiện nghi" onError={(e)=>e.target.src='https://via.placeholder.com/300'} />
            <div className="image-card-title">Phòng Ngủ Tiện Nghi</div>
          </div>
          <div className="image-card">
            <img src={officeRoomImg} alt="Không gian sống hiện đại" onError={(e)=>e.target.src='https://via.placeholder.com/300'} />
            <div className="image-card-title">Không Gian Sống Hiện Đại</div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Home;