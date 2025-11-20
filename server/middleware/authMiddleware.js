const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  // Lấy token từ header gửi lên (Dạng: "Bearer abcxyz...")
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: "Bạn chưa đăng nhập!" });
  }

  // Giải mã Token để lấy ID thật của user
  jwt.verify(token, 'SECRET_KEY_CUA_BAN', (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Token hết hạn hoặc không hợp lệ" });
    }
    req.user = user; // Lưu thông tin thật vào biến req
    next();
  });
};

// Middleware kiểm tra Admin
const verifyAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.role === 'admin') {
      next();
    } else {
      res.status(403).json({ message: "Bạn không phải Admin!" });
    }
  });
};

module.exports = { verifyToken, verifyAdmin };