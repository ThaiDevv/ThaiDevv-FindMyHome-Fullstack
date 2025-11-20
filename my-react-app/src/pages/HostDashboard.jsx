import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { toast } from 'react-toastify';
const HostDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [myRooms, setMyRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [activeTab, setActiveTab] = useState('bookings'); // 'rooms' hoặc 'bookings'

  // 1. Load dữ liệu khi vào trang
  useEffect(() => {
    if (!user || user.role !== 'host') {
      toast.success("Trang này chỉ dành cho Chủ trọ!");
      navigate('/');
      return;
    }

    // Lấy danh sách bài đăng của tôi
    axios.get(`http://localhost:5000/api/host/rooms/${user.id}`)
      .then(res => setMyRooms(res.data))
      .catch(err => console.error(err));

    // Lấy danh sách lịch hẹn khách đặt
    axios.get(`http://localhost:5000/api/host/bookings/${user.id}`)
      .then(res => setBookings(res.data))
      .catch(err => console.error(err));

  }, [user, navigate]);

  // 2. Xử lý duyệt lịch hẹn
  const handleUpdateStatus = async (bookingId, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/bookings/${bookingId}`, { status: newStatus });
      toast.success("Đã cập nhật thành công!");
      
      // Cập nhật lại giao diện ngay lập tức
      setBookings(prev => prev.map(b => 
        b.id === bookingId ? { ...b, status: newStatus } : b
      ));
    } catch (err) {
      toast.error("Lỗi cập nhật");
    }
  };

  // Style trạng thái
  const getStatusBadge = (status) => {
    if(status === 'confirmed') return <span style={{color:'green', fontWeight:'bold'}}>✅ Đã xác nhận</span>;
    if(status === 'rejected') return <span style={{color:'red', fontWeight:'bold'}}>❌ Đã từ chối</span>;
    return <span style={{color:'#f5a623', fontWeight:'bold'}}>⏳ Chờ duyệt</span>;
  };
  const getRoomStatusBadge = (status) => {
    if (status === 'approved') {
      return <p style={{fontSize:'13px', color:'green', fontWeight:'500'}}>Đang hiển thị</p>;
    }
    if (status === 'rejected') {
      return <p style={{fontSize:'13px', color:'red', fontWeight:'500'}}>Bị từ chối</p>;
    }
    // Mặc định là pending
    return <p style={{fontSize:'13px', color:'#f5a623', fontWeight:'500'}}>Đang chờ duyệt</p>;
  };
  return (
    <>
      <Navbar />
      <div className="main-content" style={{padding: '40px 20px', backgroundColor: '#f5f5f7', minHeight: '80vh'}}>
        <div style={{maxWidth: '1000px', margin: '0 auto'}}>
          
          <h1>👋 Chào, {user?.full_name}</h1>
          <p>Quản lý tin đăng và lịch hẹn của bạn tại đây.</p>

          {/* Tab chuyển đổi */}
          <div style={{display:'flex', gap:'15px', marginTop:'30px', borderBottom:'1px solid #ddd'}}>
            <button 
              onClick={() => setActiveTab('bookings')}
              style={{
                padding:'12px 20px', 
                border:'none', 
                background: activeTab === 'bookings' ? '#007AFF' : 'transparent',
                color: activeTab === 'bookings' ? 'white' : '#333',
                borderRadius:'8px 8px 0 0', cursor:'pointer', fontWeight:'500'
              }}
            >
              📅 Quản lý Lịch hẹn ({bookings.length})
            </button>
            <button 
               onClick={() => setActiveTab('rooms')}
               style={{
                padding:'12px 20px', 
                border:'none', 
                background: activeTab === 'rooms' ? '#007AFF' : 'transparent',
                color: activeTab === 'rooms' ? 'white' : '#333',
                borderRadius:'8px 8px 0 0', cursor:'pointer', fontWeight:'500'
              }}
            >
              🏠 Bài đăng của tôi ({myRooms.length})
            </button>
          </div>

          {/* NỘI DUNG TAB LỊCH HẸN */}
          {activeTab === 'bookings' && (
            <div style={{background:'white', padding:'20px', borderRadius:'0 8px 8px 8px', boxShadow:'0 2px 10px rgba(0,0,0,0.05)'}}>
              {bookings.length === 0 ? <p>Chưa có ai đặt lịch xem phòng.</p> : (
                <table style={{width:'100%', borderCollapse:'collapse'}}>
                  <thead>
                    <tr style={{textAlign:'left', borderBottom:'2px solid #eee'}}>
                      <th style={{padding:'10px'}}>Khách hàng</th>
                      <th style={{padding:'10px'}}>Phòng quan tâm</th>
                      <th style={{padding:'10px'}}>Ngày xem</th>
                      <th style={{padding:'10px'}}>Lời nhắn</th>
                      <th style={{padding:'10px'}}>Trạng thái</th>
                      <th style={{padding:'10px'}}>Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map(item => (
                      <tr key={item.id} style={{borderBottom:'1px solid #eee'}}>
                        <td style={{padding:'15px 10px'}}>
                          <strong>{item.tenant_name}</strong><br/>
                          <span style={{fontSize:'13px', color:'#666'}}>{item.tenant_email}</span>
                        </td>
                        <td style={{padding:'10px'}}>{item.room_title}</td>
                        <td style={{padding:'10px'}}>{new Date(item.booking_date).toLocaleDateString('vi-VN')}</td>
                        <td style={{padding:'10px'}}>{item.note || 'Không có'}</td>
                        <td style={{padding:'10px'}}>{getStatusBadge(item.status)}</td>
                        <td style={{padding:'10px'}}>
                          {item.status === 'pending' && (
                            <div style={{display:'flex', gap:'5px'}}>
                              <button onClick={() => handleUpdateStatus(item.id, 'confirmed')} style={{padding:'5px 10px', background:'green', color:'white', border:'none', borderRadius:'4px', cursor:'pointer'}}>Duyệt</button>
                              <button onClick={() => handleUpdateStatus(item.id, 'rejected')} style={{padding:'5px 10px', background:'red', color:'white', border:'none', borderRadius:'4px', cursor:'pointer'}}>Hủy</button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
          
          {/* NỘI DUNG TAB BÀI ĐĂNG */}
          {activeTab === 'rooms' && (
            <div style={{background:'white', padding:'20px', borderRadius:'0 8px 8px 8px', boxShadow:'0 2px 10px rgba(0,0,0,0.05)'}}>
               {myRooms.length === 0 ? <p>Bạn chưa đăng bài nào.</p> : (
                 <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(250px, 1fr))', gap:'20px'}}>
                    {myRooms.map(room => (
                      <div key={room.id} style={{border:'1px solid #eee', borderRadius:'8px', overflow:'hidden'}}>
                        <img src={room.image_url} alt={room.title} style={{width:'100%', height:'150px', objectFit:'cover'}}/>
                        <div style={{padding:'10px'}}>
                          <h4 style={{margin:'0 0 5px', fontSize:'16px', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'}}>{room.title}</h4>
                          <p style={{color:'#007AFF', fontWeight:'bold'}}>{room.formatted_price}</p>
                          {getRoomStatusBadge(room.status)}
                        </div>
                      </div>
                    ))}
                 </div>
               )}
            </div>
          )}

        </div>
      </div>
      <Footer />
    </>
  );
};

export default HostDashboard;