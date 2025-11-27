import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext'; // Import Context để cập nhật Navbar
import '../App.css'; 
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
const Auth = () => {
  // State điều khiển hiệu ứng trượt (false = Login, true = Register)
  const [isActive, setIsActive] = useState(false);
  const [regPhone, setRegPhone] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth(); // Lấy hàm login từ Context

  // State cho form Đăng nhập
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // State cho form Đăng ký
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState('tenant'); // Mặc định là người thuê

  // --- XỬ LÝ ĐĂNG NHẬP ---
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Gọi API đăng nhập
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        email: loginEmail,
        password: loginPassword
      });
      
      // Nếu thành công: Gọi hàm login của Context
      // (Hàm này sẽ tự lưu vào localStorage và cập nhật Navbar)
      login(res.data.user, res.data.token);
      
      toast.success('Đăng nhập thành công!');
      navigate('/'); // Chuyển hướng về trang chủ
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Email hoặc mật khẩu không đúng!");
    }
  };

  // --- XỬ LÝ ĐĂNG KÝ ---
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/register', {
        full_name: regName,
        email: regEmail,
        password: regPassword,
        role: regRole,
        phone: regPhone // <--- Gửi thêm dòng này
      });
      
      toast.success('Đăng ký thành công! Vui lòng đăng nhập.'); // Dùng toast cho đẹp
      
      // Reset form
      setRegName('');
      setRegEmail('');
      setRegPassword('');
      setRegPhone(''); // <--- Reset SĐT
      setIsActive(false); 
    } catch (err) {
      toast.error(err.response?.data?.message || "Lỗi đăng ký.");
    }
  };

  return (
    <>
      <Navbar />
      <main className="auth-body">
        <div className={`container ${isActive ? 'active' : ''}`}>
          
          {/* --- FORM ĐĂNG NHẬP --- */}
          <div className="form-box login">
            <form onSubmit={handleLogin}>
              <h1>Đăng Nhập</h1>
              <div className="input-box">
                <input 
                  type="email" 
                  placeholder="Email" 
                  required 
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                />
                <i className='bx bxs-user'></i>
              </div>
              <div className="input-box">
                <input 
                  type="password" 
                  placeholder="Mật khẩu" 
                  required 
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                />
                <i className='bx bxs-lock-alt'></i>
              </div>
              <div className="forgot-link">
                <Link to="/forgot-password">Quên mật khẩu?</Link>
              </div>
              <button type="submit" className="btn">Đăng Nhập</button>
            </form>
          </div>

          {/* --- FORM ĐĂNG KÝ --- */}
          <div className="form-box register">
            <form onSubmit={handleRegister}>
              <h1>Đăng Ký</h1>
              
              {/* Input Họ tên */}
              <div className="input-box">
                <input type="text" placeholder="Họ và tên" required 
                  value={regName} onChange={(e) => setRegName(e.target.value)}
                />
                <i className='bx bxs-user'></i>
              </div>

              {/* --- 3. THÊM INPUT SỐ ĐIỆN THOẠI VÀO ĐÂY --- */}
              <div className="input-box">
                <input 
                  type="text" 
                  placeholder="Số điện thoại" 
                  required 
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                />
                <i className='bx bxs-phone'></i> {/* Icon điện thoại nếu có, hoặc bỏ thẻ i này */}
              </div>
              {/* -------------------------------------------- */}

              {/* Input Email */}
              <div className="input-box">
                <input type="email" placeholder="Email" required 
                  value={regEmail} onChange={(e) => setRegEmail(e.target.value)}
                />
                <i className='bx bxs-envelope'></i>
              </div>

              {/* Input Mật khẩu */}
              <div className="input-box">
                <input type="password" placeholder="Mật khẩu" required 
                  value={regPassword} onChange={(e) => setRegPassword(e.target.value)}
                />
                <i className='bx bxs-lock-alt'></i>
              </div>

              {/* Phần chọn Role */}
              <div style={{ margin: '15px 0', textAlign: 'left' }}>
                  <p style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>Bạn muốn đăng ký làm:</p>
                  
                  <div style={{ display: 'flex', gap: '20px' }}>
                    {/* Lựa chọn 1: Người thuê */}
                    <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', gap: '5px' }}>
                      <input 
                        type="radio" 
                        name="role" 
                        value="tenant"
                        checked={regRole === 'tenant'}
                        onChange={() => setRegRole('tenant')}
                        style={{ width: '16px', height: '16px', margin: 0 }} 
                      />
                      <span style={{ fontSize: '15px', color: '#333' }}>Người tìm phòng</span>
                    </label>

                    {/* Lựa chọn 2: Chủ trọ */}
                    <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', gap: '5px' }}>
                      <input 
                        type="radio" 
                        name="role" 
                        value="host"
                        checked={regRole === 'host'}
                        onChange={() => setRegRole('host')}
                        style={{ width: '16px', height: '16px', margin: 0 }}
                      />
                      <span style={{ fontSize: '15px', color: '#333' }}>Chủ trọ / Môi giới</span>
                    </label>
                  </div>
</div>
              {/* Nút Submit giữ nguyên... */}
      
              <button type="submit" className="btn">Đăng Ký</button>
            </form>
          </div>

          {/* --- TOGGLE PANEL (Thanh trượt chuyển đổi) --- */}
          <div className="toggle-box">
            <div className="toggle-panel toggle-left">
              <h1>Xin chào!</h1>
              <p>Bạn chưa có tài khoản?</p>
              <button className="btn" onClick={() => setIsActive(true)}>Đăng Ký Ngay</button>
            </div>
            <div className="toggle-panel toggle-right">
              <h1>Chào mừng trở lại!</h1>
              <p>Bạn đã có tài khoản? Đăng nhập để tiếp tục tìm nhà.</p>
              <button className="btn" onClick={() => setIsActive(false)}>Đăng Nhập</button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Auth;