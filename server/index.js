const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt'); 
const jwt = require('jsonwebtoken');
const db = require('./db'); 
const app = express();
const PORT = process.env.PORT || 5000;
const { verifyToken, verifyAdmin } = require('./middleware/authMiddleware');
app.use(cors());
app.use(express.json());
const crypto = require('crypto'); 
app.get('/api/rooms', (req, res) => {
  const sql = "SELECT * FROM rooms WHERE status = 'approved' ORDER BY created_at DESC";
  
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Lỗi lấy danh sách phòng:", err);
      return res.status(500).json({ error: "Lỗi server" });
    }
    const mappedResults = results.map(room => ({
      ...room,
      rawPrice: room.price,   
      image: room.image_url || "https://via.placeholder.com/300" 
    }));
    res.json(mappedResults); 
  });
});
app.get('/api/rooms/:id', (req, res) => {
  const id = req.params.id;
  const sql = `
    SELECT 
      r.*, 
      u.full_name as owner_name, 
      u.phone as owner_phone,
      u.email as owner_email
    FROM rooms r
    LEFT JOIN users u ON r.owner_id = u.id
    WHERE r.id = ?
  `;

  db.query(sql, [id], (err, results) => {
    if (err) return res.status(500).json({ error: "Lỗi server" });
    if (results.length === 0) return res.status(404).json({ message: "Không tìm thấy" });
    
    const room = results[0];
    res.json({ ...room, rawPrice: room.price });
  });
});


app.post('/api/auth/register', async (req, res) => {
  const { email, password, full_name, role, phone } = req.body; 
  if (!email || !password || !full_name || !phone) {
    return res.status(400).json({ message: "Vui lòng điền đầy đủ thông tin (bao gồm SĐT)!" });
  }
  try {
    const checkUserSql = "SELECT * FROM users WHERE email = ?";
    db.promise().query(checkUserSql, [email])
      .then(async ([rows]) => {
        if (rows.length > 0) {
          return res.status(400).json({ message: "Email này đã được sử dụng!" });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const insertSql = "INSERT INTO users (email, password, full_name, role, phone) VALUES (?, ?, ?, ?, ?)";
        await db.promise().query(insertSql, [email, hashedPassword, full_name, role || 'tenant', phone]);

        res.status(201).json({ message: "Đăng ký thành công!" });
      })
      .catch(err => {
        console.error(err);
        res.status(500).json({ message: "Lỗi server khi đăng ký" });
      });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server" });
  }
});

// 2. API Đăng nhập (Login)
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  const sql = "SELECT * FROM users WHERE email = ?";
  db.query(sql, [email], async (err, results) => {
    if (err) return res.status(500).json({ error: "Lỗi server" });
    
    // Nếu không tìm thấy email
    if (results.length === 0) {
      return res.status(401).json({ message: "Email hoặc mật khẩu không đúng!" });
    }
    const user = results[0];
    // Nếu trạng thái là 'banned' thì chặn ngay lập tức
    if (user.status === 'banned') {
      return res.status(403).json({ 
        message: "Tài khoản của bạn đã bị KHÓA do vi phạm quy định! Vui lòng liên hệ Admin." 
      });
    }
    // So sánh mật khẩu (Giữ nguyên)
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Email hoặc mật khẩu không đúng!" });
    }

    // Tạo Token (Giữ nguyên)
    const token = jwt.sign(
      { id: user.id, role: user.role, name: user.full_name }, 
      'SECRET_KEY_CUA_BAN', 
      { expiresIn: '1d' } 
    );
    res.json({
      message: "Đăng nhập thành công",
      token,
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        role: user.role
      }
    });
  });
});
//Đăng Tin
app.post('/api/rooms', (req, res) => {
  // Nhận dữ liệu từ Frontend
  const { 
    title, 
    type, 
    price, 
    area, 
    location, 
    address, 
    description, 
    image_url, 
    owner_id 
  } = req.body;
  const formatted_price = (price / 1000000).toFixed(1).replace('.0', '') + ' triệu/tháng';
  const sql = `
    INSERT INTO rooms 
    (title, type, price, formatted_price, area, location, address, description, image_url, owner_id) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const values = [
    title, 
    type, 
    price, 
    formatted_price, 
    area, 
    location, 
    address, 
    description, 
    image_url, 
    owner_id
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Lỗi đăng tin:", err);
      return res.status(500).json({ message: "Lỗi server khi đăng tin" });
    }
    res.status(201).json({ message: "Đăng tin thành công!", roomId: result.insertId });
  });
});
// 4. API Đặt lịch xem phòng (Yêu cầu đăng nhập)
app.post('/api/bookings', (req, res) => {
  const { room_id, user_id, booking_date, note } = req.body;

  if (!booking_date) {
    return res.status(400).json({ message: "Vui lòng chọn ngày xem phòng!" });
  }

  const sql = "INSERT INTO bookings (room_id, user_id, booking_date, note) VALUES (?, ?, ?, ?)";
  
  db.query(sql, [room_id, user_id, booking_date, note], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Lỗi server" });
    }
    res.status(201).json({ message: "Đặt lịch thành công! Chủ trọ sẽ sớm liên hệ lại." });
  });
});
// 5. API: Lấy danh sách phòng của 1 chủ trọ cụ thể
app.get('/api/host/rooms/:ownerId', (req, res) => {
  const ownerId = req.params.ownerId;
  const sql = "SELECT * FROM rooms WHERE owner_id = ? ORDER BY created_at DESC";
  db.query(sql, [ownerId], (err, results) => {
    if (err) return res.status(500).json({ error: "Lỗi server" });
    // Map lại rawPrice cho khớp frontend
    const mappedResults = results.map(room => ({ ...room, rawPrice: room.price }));
    res.json(mappedResults);
  });
});
// 6. API: Lấy danh sách lịch hẹn (Booking) gửi đến chủ trọ này
app.get('/api/host/bookings/:ownerId', (req, res) => {
  const ownerId = req.params.ownerId;
  const sql = `
    SELECT 
      b.id, 
      b.booking_date, 
      b.note, 
      b.status,
      r.title as room_title,
      u.full_name as tenant_name,
      u.email as tenant_email
    FROM bookings b
    JOIN rooms r ON b.room_id = r.id
    JOIN users u ON b.user_id = u.id
    WHERE r.owner_id = ? 
    ORDER BY b.created_at DESC
  `;

  db.query(sql, [ownerId], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Lỗi server" });
    }
    res.json(results);
  });
});

// 7. API: Cập nhật trạng thái lịch hẹn (Xác nhận / Từ chối)
app.put('/api/bookings/:id', (req, res) => {
  const bookingId = req.params.id;
  const { status } = req.body; // status = 'confirmed' hoặc 'rejected'

  const sql = "UPDATE bookings SET status = ? WHERE id = ?";
  db.query(sql, [status, bookingId], (err, result) => {
    if (err) return res.status(500).json({ error: "Lỗi server" });
    res.json({ message: "Đã cập nhật trạng thái!" });
  });
});

// 8. Lấy tất cả bài đang chờ duyệt
app.get('/api/admin/pending-rooms', (req, res) => {
  const sql = "SELECT * FROM rooms WHERE status = 'pending' ORDER BY created_at DESC";
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: "Lỗi server" });
    res.json(results);
  });
});

// 9. Duyệt bài hoặc Từ chối
app.put('/api/admin/rooms/:id', (req, res) => {
  const roomId = req.params.id;
  const { status } = req.body; // 'approved' hoặc 'rejected'

  const sql = "UPDATE rooms SET status = ? WHERE id = ?";
  db.query(sql, [status, roomId], (err, result) => {
    if (err) return res.status(500).json({ error: "Lỗi server" });
    res.json({ message: "Đã cập nhật trạng thái bài đăng!" });
  });
});
// 10. Yêu cầu reset mật khẩu (Gửi Email giả lập)
app.post('/api/auth/forgot-password', (req, res) => {
  const { email } = req.body;
  // Kiểm tra email có tồn tại không
  db.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
    if (err) return res.status(500).json({ message: "Lỗi server" });
    if (results.length === 0) {
      // Bảo mật: Không báo lỗi nếu email không tồn tại, chỉ báo đã gửi
      return res.json({ message: "Nếu email tồn tại, link reset đã được gửi!" });
    }
    // Tạo token ngẫu nhiên
    const token = crypto.randomBytes(32).toString('hex');
    const expires = Date.now() + 3600000; // Hết hạn sau 1 giờ (ms)
    // Lưu token vào DB
    db.query(
      "UPDATE users SET reset_token = ?, reset_expires = ? WHERE email = ?",
      [token, expires, email],
      (updateErr) => {
        if (updateErr) return res.status(500).json({ message: "Lỗi lưu token" });
        const resetLink = `http://localhost:5173/reset-password?token=${token}`;
        console.log(" [MOCK EMAIL] Yêu cầu reset pass cho:", email);
        console.log("Link Reset :", resetLink);
        res.json({ message: "Yêu cầu đã được gửi! Hãy kiểm tra Email (hoặc Terminal)." });
      }
    );
  });
});
// 11. Đặt lại mật khẩu mới
app.post('/api/auth/reset-password', async (req, res) => {
  const { token, newPassword } = req.body;
  // Tìm user có token khớp và chưa hết hạn
  // Lưu ý: reset_expires là số (BIGINT) nên so sánh > Date.now()
  const sql = "SELECT * FROM users WHERE reset_token = ? AND reset_expires > ?";
  db.query(sql, [token, Date.now()], async (err, results) => {
    if (err) return res.status(500).json({ message: "Lỗi server" });
    if (results.length === 0) {
      return res.status(400).json({ message: "Link không hợp lệ hoặc đã hết hạn!" });
    }
    const user = results[0];
    // Mã hóa mật khẩu mới
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    // Cập nhật mật khẩu và xóa token
    db.query(
      "UPDATE users SET password = ?, reset_token = NULL, reset_expires = NULL WHERE id = ?",
      [hashedPassword, user.id],
      (updateErr) => {
        if (updateErr) return res.status(500).json({ message: "Lỗi cập nhật mật khẩu" });
        res.json({ message: "Đặt lại mật khẩu thành công! Hãy đăng nhập." });
      }
    );
  });
});

// 14. Lấy danh sách tất cả người dùng (Admin)
app.get('/api/admin/users', verifyAdmin, (req, res) => {
  const sql = "SELECT id, full_name, email, role, phone, status, created_at FROM users ORDER BY id DESC";
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: "Lỗi server" });
    res.json(results);
  });
});

// 15. Khóa / Mở khóa tài khoản (Admin)
app.put('/api/admin/users/:id', verifyAdmin, (req, res) => {
  const userId = req.params.id;
  const { status } = req.body; // 'active' hoặc 'banned'

  const sql = "UPDATE users SET status = ? WHERE id = ?";
  db.query(sql, [status, userId], (err, result) => {
    if (err) return res.status(500).json({ error: "Lỗi server" });
    res.json({ message: "Cập nhật trạng thái người dùng thành công!" });
  });
});

// 16. Gửi báo cáo mới (Người thuê)
app.post('/api/reports', verifyToken, (req, res) => {
  const { room_id, reason } = req.body;
  const user_id = req.user.id; // Lấy từ middleware giả
  const sql = "INSERT INTO reports (user_id, room_id, reason) VALUES (?, ?, ?)";
  db.query(sql, [user_id, room_id, reason], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Lỗi lưu vào Database: " + err.message });
    }
    res.status(201).json({ message: "Đã gửi báo cáo vi phạm!" });
  });
});

// 17. Lấy danh sách báo cáo (Admin)
app.get('/api/admin/reports', verifyAdmin, (req, res) => {
  const sql = `
    SELECT rp.id, rp.reason, rp.status, rp.created_at,
           u.email as reporter_email,
           r.title as room_title, r.id as room_id
    FROM reports rp
    JOIN users u ON rp.user_id = u.id
    JOIN rooms r ON rp.room_id = r.id
    ORDER BY rp.created_at DESC
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: "Lỗi server" });
    res.json(results);
  });
});

// 18. Xử lý báo cáo (Đánh dấu đã xong)
app.put('/api/admin/reports/:id', verifyAdmin, (req, res) => {
  const reportId = req.params.id;
  const sql = "UPDATE reports SET status = 'resolved' WHERE id = ?";
  db.query(sql, [reportId], (err, result) => {
    if (err) return res.status(500).json({ error: "Lỗi server" });
    res.json({ message: "Đã xử lý báo cáo!" });
  });
});
// 19. Lấy danh sách phòng yêu thích của User đang đăng nhập
app.get('/api/favorites', verifyToken, (req, res) => {
  const userId = req.user.id;
  // Join bảng favorites với bảng rooms để lấy đầy đủ thông tin phòng
  const sql = `
    SELECT r.* FROM favorites f
    JOIN rooms r ON f.room_id = r.id
    WHERE f.user_id = ?
    ORDER BY f.created_at DESC
  `;
  db.query(sql, [userId], (err, results) => {
    if (err) return res.status(500).json({ error: "Lỗi server" });
    // Map lại dữ liệu cho khớp frontend (rawPrice)
    const mappedResults = results.map(room => ({ ...room, rawPrice: room.price }));
    res.json(mappedResults);
  });
});

// 20. Thêm vào yêu thích (Like)
app.post('/api/favorites', verifyToken, (req, res) => {
  const userId = req.user.id;
  const { room_id } = req.body;
  const sql = "INSERT IGNORE INTO favorites (user_id, room_id) VALUES (?, ?)";
  db.query(sql, [userId, room_id], (err, result) => {
    if (err) return res.status(500).json({ error: "Lỗi server" });
    res.json({ message: "Đã thích!" });
  });
});

// 21. Bỏ yêu thích (Unlike)
app.delete('/api/favorites/:roomId', verifyToken, (req, res) => {
  const userId = req.user.id;
  const roomId = req.params.roomId;

  const sql = "DELETE FROM favorites WHERE user_id = ? AND room_id = ?";
  db.query(sql, [userId, roomId], (err, result) => {
    if (err) return res.status(500).json({ error: "Lỗi server" });
    res.json({ message: "Đã bỏ thích!" });
  });
});
// API ĐÁNH GIÁ & BÌNH LUẬN (REVIEWS)
app.get('/api/reviews/:roomId', (req, res) => {
  const roomId = req.params.roomId;
  // Join với bảng users để lấy tên người bình luận
  const sql = `
    SELECT r.*, u.full_name 
    FROM reviews r 
    JOIN users u ON r.user_id = u.id 
    WHERE r.room_id = ? 
    ORDER BY r.created_at DESC
  `;
  
  db.query(sql, [roomId], (err, results) => {
    if (err) return res.status(500).json({ error: "Lỗi server" });
    res.json(results);
  });
});

app.post('/api/reviews', verifyToken, (req, res) => {
  const { room_id, rating, comment } = req.body;
  const user_id = req.user.id;

  if (!rating || !comment) {
    return res.status(400).json({ message: "Vui lòng chọn số sao và nhập nội dung!" });
  }

  const sql = "INSERT INTO reviews (user_id, room_id, rating, comment) VALUES (?, ?, ?, ?)";
  db.query(sql, [user_id, room_id, rating, comment], (err, result) => {
    if (err) return res.status(500).json({ error: "Lỗi gửi đánh giá" });
    res.status(201).json({ message: "Cảm ơn bạn đã đánh giá!" });
  });
});
// 24. API Admin: Lấy tất cả bài đăng (SỬA LẠI CHO CHẮC CHẮN)
app.get('/api/admin/all-rooms', verifyAdmin, (req, res) => {
  const sql = `
    SELECT r.*, u.email as owner_email, u.full_name as owner_name
    FROM rooms r
    LEFT JOIN users u ON r.owner_id = u.id  
    ORDER BY r.created_at DESC
  `;
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Lỗi lấy danh sách bài:", err); // In lỗi ra terminal để xem
      return res.status(500).json({ error: "Lỗi server" });
    }
    res.json(results);
  });
});

// 25. API Admin: Xóa bài đăng vĩnh viễn
app.delete('/api/admin/rooms/:id', verifyAdmin, (req, res) => {
  const roomId = req.params.id;
  const sql = "DELETE FROM rooms WHERE id = ?";
  
  db.query(sql, [roomId], (err, result) => {
    if (err) return res.status(500).json({ error: "Lỗi xóa bài" });
    res.json({ message: "Đã xóa bài đăng thành công!" });
  });
});
app.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
});