const mysql = require('mysql2');
require('dotenv').config(); // Nhớ cài: npm install dotenv

const db = mysql.createConnection({
  host: process.env.DB_HOST,       // Không điền cứng, lấy từ môi trường
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306
});

db.connect((err) => {
  if (err) {
    console.error('Lỗi kết nối Database:', err.message);
    return;
  }
  console.log('Đã kết nối thành công đến MySQL Database!');
});

module.exports = db;