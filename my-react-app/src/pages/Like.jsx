import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import RoomCard from '../components/RoomCard';
import { useFavorites } from '../context/useFavorites';

const Like = () => {
  const { favorites } = useFavorites();

  return (
    <>
      <Navbar />
      <section className="hero">
        <h1>Danh Sách Phòng Trọ Yêu Thích</h1>
        <p>Các phòng mà bạn đã nhấn ❤️ Thích.</p>
      </section>

      <div className="search-list">
        {favorites.length === 0 ? (
          <p className="empty-text" style={{textAlign:'center', fontSize:'22px', color:'#007AFF'}}>
              Bạn chưa thích phòng nào.
          </p>
        ) : (
          favorites.map(room => (
            <RoomCard key={room.id} room={room} showRemoveBtn={true} />
          ))
        )}
      </div>
      <Footer />
    </>
  );
};

export default Like;