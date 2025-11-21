const mysql = require('mysql2');
require('dotenv').config(); // Nhớ cài: npm install dotenv

const db = mysql.createConnection({
  host: 'localhost',       // Phải là process.env...
  user: 'root',
  password: '123456',
  database: 'findmyhome_db',
  port: '3306'
});

db.connect((err) => {
  if (err) {
    console.error('Lỗi kết nối Database:', err.message);
    return;
  }
  console.log('Đã kết nối thành công đến MySQL Database!');
});

module.exports = db;