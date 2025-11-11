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
  timezone: process.env.DB_TIMEZONE || 'Z'
});

// query: für SELECT (gibt rows zurück)
async function query(sql, params = []) {
  const [rows] = await pool.execute(sql, params);
  return rows;
}

// executeRaw: für INSERT/UPDATE/DELETE (gibt result-Objekt zurück)
async function executeRaw(sql, params = []) {
  const [result] = await pool.execute(sql, params);
  return result;
}

// getConnection: für Transaktionen (conn.beginTransaction(), commit(), rollback())
async function getConnection() {
  return await pool.getConnection();
}

module.exports = {
  pool,
  query,
  executeRaw,
  getConnection
};
