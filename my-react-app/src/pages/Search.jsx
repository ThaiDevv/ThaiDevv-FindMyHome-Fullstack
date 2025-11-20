import React, { useState, useEffect, useMemo } from 'react';
import axios from '../api/axiosClient'; // Khuyên dùng axiosClient nếu đã cấu hình
// Hoặc dùng: import axios from 'axios'; (như code cũ của bạn)

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import RoomCard from '../components/RoomCard';

const Search = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State cho bộ lọc
  const [searchText, setSearchText] = useState('');
  const [priceFilter, setPriceFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  // Gọi API lấy danh sách phòng
  useEffect(() => {
    // Nếu dùng axios thường: axios.get('http://localhost:5000/api/rooms')
    // Nếu dùng axiosClient: axios.get('/rooms')
    axios.get('/rooms') 
      .then(response => {
        setRooms(response.data); 
        setLoading(false);
      })
      .catch(err => {
        console.error("Lỗi:", err);
        setError("Không thể tải dữ liệu.");
        setLoading(false);
      });
  }, []);

  // Logic lọc dữ liệu
  const filteredRooms = useMemo(() => {
    return rooms.filter(room => {
      const matchText = room.title.toLowerCase().includes(searchText.toLowerCase()) || 
                        room.location.toLowerCase().includes(searchText.toLowerCase());

      let matchPrice = true;
      // Lọc theo giá (Dựa vào rawPrice từ DB)
      if (priceFilter === 'under2') matchPrice = room.rawPrice < 2000000;
      else if (priceFilter === '2to5') matchPrice = room.rawPrice >= 2000000 && room.rawPrice <= 5000000;
      else if (priceFilter === '5to10') matchPrice = room.rawPrice > 5000000 && room.rawPrice <= 10000000;
      else if (priceFilter === 'over10') matchPrice = room.rawPrice > 10000000;

      // Lọc theo loại (Chính xác theo chuỗi trong DB)
      const matchType = typeFilter === 'all' || room.type === typeFilter;

      return matchText && matchPrice && matchType;
    });
  }, [rooms, searchText, priceFilter, typeFilter]);

  return (
    <>
      <Navbar />
      <section className="hero">
        <h1>Tìm Kiếm Nhà</h1>
        <p>Chọn giá – khu vực – loại nhà phù hợp với bạn.</p>
      </section>

      <div className="search-container">
        <div className="filter-box">
          <input 
            type="text" 
            placeholder="Tìm khu vực, tên đường..." 
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          
          {/* Bộ lọc giá (Đã cập nhật cho phù hợp giá nhà/chung cư) */}
          <select value={priceFilter} onChange={(e) => setPriceFilter(e.target.value)}>
            <option value="all">Tất cả mức giá</option>
            <option value="under2">Dưới 2 triệu</option>
            <option value="2to5">2 - 5 triệu</option>
            <option value="5to10">5 - 10 triệu</option>
            <option value="over10">Trên 10 triệu</option>
          </select>

          {/* --- CẬP NHẬT PHẦN NÀY: DANH SÁCH LOẠI NHÀ MỚI --- */}
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
            <option value="all">Tất cả loại nhà</option>
            <option value="Nhà trọ">Nhà trọ</option>
            <option value="Căn hộ chung cư">Căn hộ chung cư</option>
            <option value="Chung cư cao cấp">Chung cư cao cấp</option>
            <option value="Nhà nguyên căn">Nhà nguyên căn</option>
            <option value="Nhà phố">Nhà phố</option>
          </select>
          {/* -------------------------------------------------- */}
          
        </div>

        <div className="search-list">
          {loading && <p style={{textAlign: 'center'}}>Đang tải dữ liệu...</p>}
          {error && <p style={{color: 'red', textAlign: 'center'}}>{error}</p>}
          
          {!loading && !error && filteredRooms.length > 0 ? (
            filteredRooms.map(room => (
              <RoomCard key={room.id} room={room} />
            ))
          ) : (
            !loading && !error && <p style={{textAlign: 'center'}}>Không tìm thấy phòng nào phù hợp.</p>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Search;