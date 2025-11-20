import React, { useContext } from 'react';
import { FavoritesContext } from '../context/FavoritesContext';
import { Link } from 'react-router-dom';

// Hàm format giá tiền (Giữ nguyên logic của bạn)
const formatPrice = (price) => {
  if (!price) return "Thỏa thuận";
  if (price >= 1000000) {
    return (price / 1000000).toFixed(1).replace('.0', '').replace('.', ',') + ' triệu/tháng';
  }
  return price.toLocaleString('vi-VN') + ' đ/tháng';
};

export default function RoomCard({ room }) {
  const { favorites, toggleFavorite } = useContext(FavoritesContext);
  const isFavorite = favorites.some(fav => fav.id === room.id);

  // Hàm xử lý khi bấm Tim (Chặn sự kiện click để không bị chuyển trang)
  const handleFavoriteClick = (e) => {
    e.preventDefault(); 
    toggleFavorite(room);
  };

  return (
    <Link 
      to={`/room/${room.id}`} 
      className="room-card" 
      style={{textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', height: '100%'}}
    >
      
      {/* 1. PHẦN ẢNH (Có nút tim đè lên góc) */}
      <div style={{position: 'relative', width: '100%', height: '220px'}}>
        <img 
          src={room.image_url || "https://via.placeholder.com/300"} 
          alt={room.title} 
          style={{width: '100%', height: '100%', objectFit: 'cover'}}
          onError={(e) => {e.target.src = 'https://via.placeholder.com/300'}}
        />
        
        {/* Nút Tim nằm góc phải ảnh */}
        <button
          onClick={handleFavoriteClick}
          className={isFavorite ? 'active' : ''}
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            zIndex: 10,
            border: 'none',
            background: 'rgba(255, 255, 255, 0.9)',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '18px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
          }}
          title={isFavorite ? 'Bỏ thích' : 'Yêu thích'}
        >
          {isFavorite ? '❤️' : '🤍'}
        </button>
      </div>

      {/* 2. PHẦN THÔNG TIN (Nằm bên dưới, nền trắng, chữ đen) */}
      <div className="room-info" style={{padding: '15px', flex: 1, display: 'flex', flexDirection: 'column', gap: '8px'}}>
        
        {/* Tiêu đề */}
        <h3 style={{
          fontSize: '17px', 
          fontWeight: '600', 
          color: '#1d1d1f', 
          margin: 0,
          lineHeight: '1.4',
          // Cắt bớt nếu tên quá dài
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden'
        }}>
          {room.title}
        </h3>

        {/* Giá tiền */}
        <p style={{fontSize: '18px', color: '#007AFF', fontWeight: '700', margin: 0}}>
          {formatPrice(room.rawPrice || room.price)}
        </p>

        {/* Thông tin phụ (Địa chỉ - Diện tích - Loại) */}
        <div style={{marginTop: 'auto', paddingTop: '10px', borderTop: '1px solid #f0f0f0', fontSize: '14px', color: '#666'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '4px'}}>
             <span>📍 {room.location}</span>
          </div>
          <div style={{display: 'flex', justifyContent: 'space-between'}}>
             <span>🏠 {room.type}</span>
             <span>📐 {room.area} m²</span>
          </div>
        </div>

      </div>
    </Link>
  );
}