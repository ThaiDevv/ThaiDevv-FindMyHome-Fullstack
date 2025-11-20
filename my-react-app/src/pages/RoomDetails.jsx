import React, { useContext, useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from '../api/axiosClient'; // Dùng client chuẩn
import { toast } from 'react-toastify'; // Thông báo đẹp

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { FavoritesContext } from '../context/FavoritesContext';
import { useAuth } from '../context/AuthContext';

export default function RoomDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { favorites, toggleFavorite } = useContext(FavoritesContext);
  
  const [room, setRoom] = useState(null);
  const [reviews, setReviews] = useState([]); // State lưu danh sách review
  const [loading, setLoading] = useState(true);

  // State cho Form Review
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  // State cho Form Đặt lịch
  const [bookingDate, setBookingDate] = useState('');
  const [bookingNote, setBookingNote] = useState('');

  useEffect(() => {
    // 1. Lấy thông tin phòng
    axios.get(`/rooms/${id}`)
      .then(res => {
        setRoom(res.data);
        setLoading(false);
      })
      .catch(err => setLoading(false));

    // 2. Lấy danh sách đánh giá (MỚI)
    loadReviews();
  }, [id]);

  const loadReviews = () => {
    axios.get(`/reviews/${id}`)
      .then(res => setReviews(res.data))
      .catch(err => console.error(err));
  };

  // Xử lý Gửi Đánh Giá (MỚI)
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.warning("Vui lòng đăng nhập để đánh giá!");
      return;
    }
    try {
      await axios.post('/reviews', { room_id: id, rating, comment });
      toast.success("Đã gửi đánh giá thành công!");
      setComment(''); // Xóa ô nhập
      loadReviews();  // Tải lại danh sách ngay lập tức
    } catch (error) {
      toast.error("Lỗi gửi đánh giá.");
    }
  };

  // Xử lý Đặt lịch
  const handleBooking = async (e) => {
    e.preventDefault();
    if (!user) return toast.warning("Vui lòng đăng nhập để đặt lịch!");

    try {
      await axios.post('/bookings', { room_id: id, user_id: user.id, booking_date: bookingDate, note: bookingNote });
      toast.success("Gửi yêu cầu thành công!");
      setBookingDate('');
      setBookingNote('');
    } catch (err) {
      toast.error(err.response?.data?.message || "Lỗi server");
    }
  };

  // Xử lý Báo cáo
  const handleReport = async () => {
    if (!user) return toast.warning("Vui lòng đăng nhập!");
    const reason = prompt("Lý do báo cáo:");
    if (reason) {
      try {
        await axios.post('/reports', { room_id: id, reason });
        toast.success("Đã gửi báo cáo!");
      } catch (err) { toast.error("Lỗi gửi báo cáo"); }
    }
  };

  if (loading) return <p style={{textAlign:'center', marginTop:'50px'}}>Đang tải...</p>;
  if (!room) return <p>Không tìm thấy phòng.</p>;

  const isFavorite = favorites.some(fav => String(fav.id) === String(room.id));

  return (
    <>
      <Navbar />
      <main className="room-details-page">
        <div className="room-hero-gallery">
          <img src={room.image_url} alt={room.title} className="hero-image" />
          <button className={`favorite-floating-btn ${isFavorite ? 'active' : ''}`} onClick={() => toggleFavorite(room)}>
            {isFavorite ? '❤️' : '🤍'}
          </button>
        </div>

        <div className="details-container">
          <div className="details-main">
            {/* Thông tin phòng */}
            <section className="room-header">
              <h1 className="room-title">{room.title}</h1>
              <div className="room-meta-bar">
                <span className="location-badge">📍 {room.location}</span>
                <span className="type-badge">{room.type}</span>
                <span className="size-badge">📐 {room.area} m²</span>
              </div>
            </section>

            <section className="room-price-section">
              <div className="price-box">
                <p className="label">Giá cho thuê</p>
                <h2 className="price">{room.formatted_price}</h2>
              </div>
            </section>

            <section className="room-description">
              <h3>Mô tả chi tiết</h3>
              <p>{room.description}</p>
              <p><strong>Địa chỉ:</strong> {room.address}</p>
            </section>

            {/* --- PHẦN MỚI: ĐÁNH GIÁ & BÌNH LUẬN --- */}
            <section className="room-reviews" style={{marginTop: '40px', borderTop: '1px solid #eee', paddingTop: '30px'}}>
              <h3>Đánh giá từ khách hàng ({reviews.length})</h3>
              
              {/* Form nhập đánh giá */}
              <div style={{background: '#f9f9f9', padding: '20px', borderRadius: '12px', marginBottom: '30px'}}>
                <h4 style={{marginTop:0}}>Viết đánh giá của bạn</h4>
                <form onSubmit={handleSubmitReview}>
                  <div style={{marginBottom: '10px', marginTop : '10px'}}>
                    <span style={{marginRight: '10px'}}>Đánh giá:</span>
                    <select value={rating} onChange={e => setRating(e.target.value)} style={{padding: '5px', borderRadius: '10px'}}>
                      <option value="5">5 Sao - Tuyệt vời</option>
                      <option value="4">4 Sao - Tốt</option>
                      <option value="3">3 Sao - Bình thường</option>
                      <option value="2">2 Sao - Tệ</option>
                      <option value="1">1 Sao - Rất tệ</option>
                    </select>
                  </div>
                  <textarea 
                    placeholder="Chia sẻ trải nghiệm của bạn về phòng này..."
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                    required
                    style={{width: '100%', height: '80px', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', marginBottom: '10px'}}
                  ></textarea>
                  <button type="submit" className="btn btn-primary">Gửi đánh giá</button>
                </form>
              </div>

              {/* Danh sách đánh giá */}
              <div className="reviews-list">
                {reviews.length === 0 ? <p>Chưa có đánh giá nào. Hãy là người đầu tiên!</p> : (
                  reviews.map(rv => (
                    <div key={rv.id} style={{borderBottom: '1px solid #eee', padding: '15px 0'}}>
                      <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '5px'}}>
                        <strong>{rv.full_name}</strong>
                        <span style={{color: '#f5a623'}}>{"⭐".repeat(rv.rating)}</span>
                      </div>
                      <p style={{margin: '5px 0', color: '#555'}}>{rv.comment}</p>
                      <span style={{fontSize: '12px', color: '#999'}}>{new Date(rv.created_at).toLocaleDateString('vi-VN')}</span>
                    </div>
                  ))
                )}
              </div>
            </section>
            {/* ---------------------------------------- */}

          </div>

          <aside className="details-sidebar">
            {/* Form Đặt Lịch */}
            <div className="action-card">
              <h3>📅 Đặt Lịch Xem Phòng</h3>
              <form onSubmit={handleBooking} style={{marginTop: '15px', display:'flex', flexDirection:'column', gap:'10px'}}>
                <div>
                  <label style={{fontSize:'13px', fontWeight:'600'}}>Chọn ngày xem:</label>
                  <input type="date" required value={bookingDate} onChange={e => setBookingDate(e.target.value)} style={{width:'100%', padding:'10px', borderRadius:'8px', border:'1px solid #ddd'}} />
                </div>
                <div>
                  <input type="text" placeholder="Lời nhắn..." value={bookingNote} onChange={e => setBookingNote(e.target.value)} style={{width:'100%', padding:'10px', borderRadius:'8px', border:'1px solid #ddd'}} />
                </div>
                <button type="submit" className="btn btn-primary btn-large">Gửi Yêu Cầu</button>
              </form>
              <div style={{marginTop: '15px', borderTop:'1px solid #eee', paddingTop:'15px'}}>
                 <button className={`btn btn-outline-large ${isFavorite ? 'active' : ''}`} onClick={() => toggleFavorite(room)}>
                  {isFavorite ? '❤️ Đã thích' : '🤍 Thêm vào yêu thích'}
                </button>
              </div>
            </div>

            {/* Thông tin chủ nhà */}
            <div className="owner-card">
              <h4>Liên hệ chủ nhà</h4>
              <p>{room.owner_name}</p>
              <div className="contact-buttons">
                {room.owner_phone ? (
                  <a href={`tel:${room.owner_phone}`} className="btn btn-contact" style={{textDecoration: 'none', textAlign: 'center', color: 'inherit', display: 'block'}}>📱 {room.owner_phone}</a>
                ) : <button className="btn btn-contact" disabled> Thiếu SĐT</button>}

                {room.owner_phone ? (
                  <a href={`https://zalo.me/${room.owner_phone}`} target="_blank" rel="noreferrer" className="btn btn-contact" style={{textDecoration: 'none', textAlign: 'center', color: 'inherit', display: 'block'}}>💬 Chat Zalo</a>
                ) : <button className="btn btn-contact" disabled>Thiếu Zalo</button>}
              </div>
            </div>

            <div style={{marginTop: '20px', textAlign: 'center'}}>
               <button onClick={handleReport} style={{background: 'transparent', border: 'none', color: '#888', textDecoration: 'underline', cursor: 'pointer', fontSize: '13px'}}>⚠️ Báo cáo tin này</button>
            </div>
          </aside>
        </div>
      </main>
      <Footer />
    </>
  );
}