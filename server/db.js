const mysql = require('mysql2');
const db = mysql.createConnection({
  host: 'localhost',       
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