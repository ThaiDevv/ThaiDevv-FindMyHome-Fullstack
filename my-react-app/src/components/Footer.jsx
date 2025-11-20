import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.svg';

export default function Footer() {
  const year = new Date().getFullYear();
  
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <div className="footer-brand">
              <img src={logo} alt="FindMyHome Logo" className="footer-logo" />
              <span className="footer-brand-text">FindMyHome</span>
            </div>
            <p className="footer-description">
              Tìm nhà trọ dễ dàng, nhanh chóng và tin cậy. Khám phá hàng nghìn không gian sống tuyệt vời.
            </p>
          </div>

          <div className="footer-section">
            <h3 className="footer-heading">Khám Phá</h3>
            <ul className="footer-links">
              <li><Link to="/">Trang Chủ</Link></li>
              <li><Link to="/search">Tìm Kiếm</Link></li>
              <li><Link to="/like">Yêu Thích</Link></li>
              <li><Link to="/auth">Đăng Nhập</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3 className="footer-heading">Hỗ Trợ</h3>
            <ul className="footer-links">
              <li><Link to="/">Trợ Giúp</Link></li>
              <li><Link to="/">Liên Hệ</Link></li>
              <li><Link to="/">Câu Hỏi Thường Gặp</Link></li>
              <li><Link to="/">Điều Khoản</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3 className="footer-heading">Kết Nối</h3>
            <ul className="footer-links">
              <li><Link to="/">Facebook</Link></li>
              <li><Link to="/">Instagram</Link></li>
              <li><Link to="/">Twitter</Link></li>
              <li><Link to="/">LinkedIn</Link></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copyright">
            &copy; {year} FindMyHome. All rights reserved.
          </p>
          <div className="footer-legal">
            <Link to="/">Privacy Policy</Link>
            <span className="footer-separator">|</span>
            <Link to="/">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
