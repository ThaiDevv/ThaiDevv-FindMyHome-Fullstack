import React, { useEffect, useState } from 'react';
import axios from '../api/axiosClient'; 
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2'; // Import SweetAlert2
const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('rooms'); // rooms (duyệt) | all-rooms (quản lý) | users | reports
  
  const [pendingRooms, setPendingRooms] = useState([]);
  const [allRooms, setAllRooms] = useState([]); // State cho tất cả bài
  const [usersList, setUsersList] = useState([]);
  const [reportsList, setReportsList] = useState([]);

  useEffect(() => {
    if (user && user.role === 'admin') {
      loadData();
    }
  }, [user, activeTab]);

  const loadData = () => {
    if (activeTab === 'rooms') {
      axios.get('/admin/pending-rooms').then(res => setPendingRooms(res.data));
    } else if (activeTab === 'all-rooms') {
      // Gọi API lấy tất cả bài
      axios.get('/admin/all-rooms').then(res => setAllRooms(res.data));
    } else if (activeTab === 'users') {
      axios.get('/admin/users').then(res => setUsersList(res.data));
    } else if (activeTab === 'reports') {
      axios.get('/admin/reports').then(res => setReportsList(res.data));
    }
  };

  // --- CÁC HÀM XỬ LÝ ---
  const handleApproveRoom = async (id, status) => {
    if (!window.confirm('Xác nhận thao tác?')) return;
    await axios.put(`/admin/rooms/${id}`, { status });
    loadData();
  };

  const handleDeleteRoom = (id) => {
    // Gọi hộp thoại đẹp của SweetAlert2
    Swal.fire({
      title: 'Bạn chắc chắn muốn xóa?',
      text: "Hành động này không thể hoàn tác!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33', // Màu đỏ cho nút xóa
      cancelButtonColor: '#3085d6', // Màu xanh cho nút hủy
      confirmButtonText: 'Vâng, xóa luôn!',
      cancelButtonText: 'Hủy bỏ'
    }).then(async (result) => {
      // Nếu người dùng bấm nút "Vâng, xóa luôn!"
      if (result.isConfirmed) {
        try {
          await axios.delete(`/admin/rooms/${id}`);
          
          // Hiện thông báo thành công (Có thể dùng Swal hoặc toast đều được)
          Swal.fire(
            'Đã xóa!',
            'Bài đăng đã bị xóa khỏi hệ thống.',
            'success'
          );
          
          loadData(); // Tải lại danh sách
        } catch (err) {
          toast.error("Lỗi khi xóa bài.");
        }
      }
    });
  };

const handleLockUser = (id, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'banned' : 'active';
    const isBanning = newStatus === 'banned';

    Swal.fire({
      title: isBanning ? 'Khóa tài khoản này?' : 'Mở khóa tài khoản?',
      text: isBanning ? "Người dùng này sẽ không thể đăng nhập được nữa." : "Người dùng sẽ được phép hoạt động trở lại.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: isBanning ? '#d33' : '#28a745',
      confirmButtonText: isBanning ? 'Khóa ngay' : 'Mở khóa',
      cancelButtonText: 'Hủy'
    }).then(async (result) => {
      if (result.isConfirmed) {
        await axios.put(`/admin/users/${id}`, { status: newStatus });
        Swal.fire('Thành công!', `Đã ${isBanning ? 'khóa' : 'mở khóa'} tài khoản.`, 'success');
        loadData();
      }
    });
  };

  const handleResolveReport = async (id) => {
    await axios.put(`/admin/reports/${id}`);
    loadData();
  };

  const getStatusLabel = (status) => {
    if (status === 'approved') return <span style={{color:'green', fontWeight:'bold'}}>Đang hiện</span>;
    if (status === 'pending') return <span style={{color:'#f5a623', fontWeight:'bold'}}>Chờ duyệt</span>;
    return <span style={{color:'red', fontWeight:'bold'}}>Bị từ chối</span>;
  };

  if (!user || user.role !== 'admin') return null;

  return (
    <>
      <Navbar />
      <div style={{padding: '40px 20px', background: '#f5f5f7', minHeight: '80vh'}}>
        <div style={{maxWidth: '1200px', margin: '0 auto'}}>
          <h1>Admin Dashboard</h1>

          {/* THANH TAB MENU */}
          <div style={{display:'flex', gap:'10px', marginTop:'20px', borderBottom:'1px solid #ddd', overflowX:'auto'}}>
            <button onClick={() => setActiveTab('rooms')} style={tabStyle(activeTab === 'rooms')}> Duyệt Bài ({pendingRooms.length})</button>
            <button onClick={() => setActiveTab('all-rooms')} style={tabStyle(activeTab === 'all-rooms')}>Tất Cả Bài</button>
            <button onClick={() => setActiveTab('users')} style={tabStyle(activeTab === 'users')}>👥 Người Dùng</button>
            <button onClick={() => setActiveTab('reports')} style={tabStyle(activeTab === 'reports')}>Báo Cáo</button>
          </div>

          {/* NỘI DUNG CHÍNH */}
          <div style={{background: 'white', padding: '20px', borderRadius: '0 8px 8px 8px', minHeight:'400px', boxShadow:'0 2px 10px rgba(0,0,0,0.05)'}}>
            
            {/* TAB 1: DUYỆT BÀI (PENDING) */}
            {activeTab === 'rooms' && (
              <div>
                {pendingRooms.length === 0 ? <p>Không có bài chờ duyệt.</p> : pendingRooms.map(room => (
                  <div key={room.id} style={itemStyle}>
                    <img src={room.image_url} style={{width:'100px', height:'80px', objectFit:'cover', borderRadius:'4px'}} onError={(e)=>e.target.src='https://via.placeholder.com/150'} />
                    <div style={{flex:1}}>
                       <h4>{room.title}</h4>
                       <p style={{fontSize:'13px', color:'#666'}}>{room.address} | {room.price} VNĐ</p>
                    </div>
                    <div>
                       <button onClick={() => handleApproveRoom(room.id, 'approved')} className="btn" style={{background:'green', color:'white', marginRight:'5px', padding:'5px 10px'}}>Duyệt</button>
                       <button onClick={() => handleApproveRoom(room.id, 'rejected')} className="btn" style={{background:'red', color:'white', padding:'5px 10px'}}>Từ chối</button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* TAB 2: QUẢN LÝ TẤT CẢ BÀI (MỚI) */}
            {activeTab === 'all-rooms' && (
              <table style={{width:'100%', borderCollapse:'collapse', fontSize:'14px'}}>
                <thead>
                  <tr style={{textAlign:'left', background:'#f8f9fa', borderBottom:'2px solid #eee'}}>
                    <th style={{padding:'12px'}}>ID</th>
                    <th style={{padding:'12px'}}>Ảnh</th>
                    <th style={{padding:'12px'}}>Tiêu đề & Địa chỉ</th>
                    <th style={{padding:'12px'}}>Người đăng</th>
                    <th style={{padding:'12px'}}>Trạng thái</th>
                    <th style={{padding:'12px'}}>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {allRooms.map(room => (
                    <tr key={room.id} style={{borderBottom:'1px solid #eee'}}>
                      <td style={{padding:'10px'}}>#{room.id}</td>
                      <td style={{padding:'10px'}}>
                        <img src={room.image_url} style={{width:'60px', height:'40px', objectFit:'cover', borderRadius:'4px'}} onError={(e)=>e.target.src='https://via.placeholder.com/60'} />
                      </td>
                      <td style={{padding:'10px', maxWidth:'300px'}}>
                        <div style={{fontWeight:'bold', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>{room.title}</div>
                        <div style={{color:'#666', fontSize:'12px'}}>{room.location}</div>
                      </td>
                      <td style={{padding:'10px'}}>
                        {room.owner_name}<br/>
                        <span style={{color:'#888', fontSize:'12px'}}>{room.owner_email}</span>
                      </td>
                      <td style={{padding:'10px'}}>{getStatusLabel(room.status)}</td>
                      <td style={{padding:'10px'}}>
                        <button 
                          onClick={() => handleDeleteRoom(room.id)}
                          style={{background:'#ff3b30', color:'white', border:'none', padding:'6px 12px', borderRadius:'4px', cursor:'pointer'}}
                        >
                          Xóa
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {/* TAB 3: NGƯỜI DÙNG */}
            {activeTab === 'users' && (
              <table style={{width:'100%', borderCollapse:'collapse'}}>
                <thead>
                  <tr style={{textAlign:'left', background:'#f8f9fa'}}><th style={{padding:'10px'}}>ID</th><th>Tên</th><th>Email</th><th>Vai trò</th><th>Trạng thái</th><th>Hành động</th></tr>
                </thead>
                <tbody>
                  {usersList.map(u => (
                    <tr key={u.id} style={{borderBottom:'1px solid #eee'}}>
                      <td style={{padding:'10px'}}>{u.id}</td>
                      <td>{u.full_name}</td>
                      <td>{u.email}</td>
                      <td>{u.role === 'admin' ? 'Admin' : (u.role === 'host' ? 'Chủ trọ' : 'Khách')}</td>
                      <td>{u.status === 'active' ? <span style={{color:'green'}}>Hoạt động</span> : <span style={{color:'red'}}>Đã khóa</span>}</td>
                      <td>
                        {u.role !== 'admin' && (
                          <button onClick={() => handleLockUser(u.id, u.status)} style={{padding:'5px 10px', background: u.status === 'active' ? '#ff3b30' : '#34c759', color:'white', border:'none', borderRadius:'4px', cursor:'pointer'}}>
                            {u.status === 'active' ? 'Khóa' : 'Mở'}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {/* TAB 4: BÁO CÁO */}
            {activeTab === 'reports' && (
              <table style={{width:'100%', borderCollapse:'collapse'}}>
                <thead>
                  <tr style={{textAlign:'left', background:'#f8f9fa'}}><th style={{padding:'10px'}}>Người báo</th><th>Phòng bị báo</th><th>Lý do</th><th>Trạng thái</th><th>Xử lý</th></tr>
                </thead>
                <tbody>
                  {reportsList.map(r => (
                     <tr key={r.id} style={{borderBottom:'1px solid #eee'}}>
                        <td style={{padding:'10px'}}>{r.reporter_email}</td>
                        <td>
                          <a href={`/room/${r.room_id}`} target="_blank" style={{color:'#007AFF'}}>Xem phòng #{r.room_id}</a>
                        </td>
                        <td style={{color:'red'}}>{r.reason}</td>
                        <td>{r.status === 'pending' ? 'Chờ xử lý' : 'Đã xong'}</td>
                        <td>
                          {r.status === 'pending' && <button onClick={() => handleResolveReport(r.id)} style={{padding:'5px'}}>✅ Xong</button>}
                        </td>
                     </tr>
                  ))}
                </tbody>
              </table>
            )}

          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

// Style helper
const tabStyle = (isActive) => ({
  padding: '12px 20px', border: 'none', cursor: 'pointer', fontWeight: 'bold',
  background: isActive ? '#1d1d1f' : 'transparent',
  color: isActive ? 'white' : '#555',
  borderRadius: '8px 8px 0 0',
  whiteSpace: 'nowrap'
});

const itemStyle = { display:'flex', gap:'15px', padding:'15px', border:'1px solid #eee', marginBottom:'10px', borderRadius:'8px', alignItems:'center', background:'#fff' };

export default AdminDashboard;