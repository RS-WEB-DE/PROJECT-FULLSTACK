// backend/db.js
require('dotenv').config();
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'watchcraft',
  waitForConnections: true,
  connectionLimit: Number(process.env.DB_CONN_LIMIT) || 10,
  queueLimit: 0,
  // optional: set timezone if needed
  timezone: process.env.DB_TIMEZONE || 'Z'
});

async function query(sql, params = []) {
  // Wrapper, gibt immer { rows, result } zurück für Komfort
  const conn = await pool.getConnection();
  try {
    const [rows, fields] = await conn.execute(sql, params);
    return { rows, fields };
  } finally {
    conn.release();
  }
}

module.exports = {
  pool,
  query
};
