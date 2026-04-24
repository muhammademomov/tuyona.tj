const mysql = require('mysql2/promise');
require('dotenv').config();

// Пул соединений с MySQL
const pool = mysql.createPool({
  host:            process.env.DB_HOST     || 'localhost',
  port:            process.env.DB_PORT     || 3306,
  user:            process.env.DB_USER     || 'root',
  password:        process.env.DB_PASSWORD || '',
  database:        process.env.DB_NAME     || 'tuyona_db',
  waitForConnections: true,
  connectionLimit:    10,
  charset:            'utf8mb4',
});

// Проверка подключения при старте
pool.getConnection()
  .then(conn => {
    console.log('✅ MySQL подключён успешно');
    conn.release();
  })
  .catch(err => {
    console.error('❌ Ошибка подключения к MySQL:', err.message);
  });

module.exports = pool;
