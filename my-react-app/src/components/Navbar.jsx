import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom'; // Thêm useNavigate
import { useAuth } from '../context/AuthContext'; // <--- 1. Import Hook
import logo from '../assets/logo.svg';
import '../App.css';


const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth(); // <--- 2. Lấy user và hàm logout

  const handleLogout = () => {
    logout();
    navigate('/auth'); // Đăng xuất xong thì đá về trang login hoặc home
  };

  return (
    <nav className="navbar">
      <div className="nav-box">
        {/* ... Phần Logo giữ nguyên ... */}
        <div className="find-house">
          <Link to="/" className="brand">
            <img src={logo} alt="Logo" className="logo-icon" />
            <span className="brand-text">FindMyHome</span>
          </Link>
        </div>
        
        {/* ... Phần Menu giữa giữ nguyên ... */}
        <ul className="nav-list">
          <li><Link to="/" className={location.pathname === '/' ? 'nav-link active' : 'nav-link'}>Home</Link></li>
          <li><Link to="/search" className={location.pathname === '/search' ? 'nav-link active' : 'nav-link'}>Search</Link></li>
          <li><Link to="/like" className={location.pathname === '/like' ? 'nav-link active' : 'nav-link'} style={{marginRight: '15px'}}>Like</Link></li>
        </ul>

        {/* 3. PHẦN QUAN TRỌNG: Đã thêm marginLeft để tạo khoảng cách */}
        <div className="">
          {/* Nút Đăng tin chỉ hiện nếu User là HOST */}
          {user && user.role === 'host' && (
             <Link to="/post-room" className="btn btn-primary" style={{marginRight: '10px', marginLeft: '10px'
             }}>
              Đăng tin
             </Link>
          )}
          {user && user.role === 'admin' && (
            <Link to="/admin" className="btn btn-primary" style={{marginRight: '10px',marginLeft: '10px', background: '#0f0a0aff'}}>
                Admin
            </Link>
          )}
          {user && user.role === 'host' && (
            <>
              {/* THÊM NÚT NÀY */}
              <Link to="/host-dashboard" className="btn btn-outline" style={{marginRight: '10px'}}>Quản lý</Link>
            </>
          )}
        
        </div>
        <div className="auth-actions">
          {user ? (
            // NẾU ĐÃ ĐĂNG NHẬP
            
            <div style={{
              display: 'flex', 
              alignItems: 'center', 
              gap: '15px', 
              marginLeft: '40px' // <--- THÊM DÒNG NÀY (Chỉnh số px to nhỏ tùy ý bạn)
            }}>
              <span style={{fontWeight: '500', color: '#1d1d1f'}}>
                Hi, {user.full_name}
              </span>
              <button 
                onClick={handleLogout}
                className="btn-logout"
              >
                Logout
              </button>
            </div>
          ) : (
            // NẾU CHƯA ĐĂNG NHẬP
            <Link to="/auth" className="btn btn-outline">Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;