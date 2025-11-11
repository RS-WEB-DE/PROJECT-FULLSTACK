// backend/routes/auth.js
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db');
const router = express.Router();
const SECRET = process.env.JWT_SECRET || 'dev_secret';

// Register
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'username & password benötigt' });
  try {
    const hash = await bcrypt.hash(password, 10);
    // INSERT und hole insertId
    const insertRes = await db.executeRaw('INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)', [username, email || null, hash]);
    const id = insertRes.insertId;
    const rows = await db.query('SELECT id, username, email, role, created_at FROM users WHERE id = ?', [id]);
    return res.status(201).json({ user: rows[0] });
  } catch (e) {
    console.error('register error', e);
    // Konflikte abfangen
    if (e && e.code === 'ER_DUP_ENTRY') return res.status(409).json({ error: 'Nutzername bereits vorhanden' });
    res.status(500).json({ error: 'Server Error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'username & password benötigt' });
  try {
    const rows = await db.query('SELECT * FROM users WHERE username = ?', [username]);
    const user = rows[0];
    if (!user) return res.status(401).json({ error: 'Ungültig' });
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ error: 'Ungültig' });
    const token = jwt.sign({ userId: user.id, username: user.username, role: user.role }, SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, username: user.username, role: user.role } });
  } catch (e) {
    console.error('login error', e);
    res.status(500).json({ error: 'Server Error' });
  }
});

// optional: get profile
router.get('/me', async (req, res) => {
  const header = req.headers['authorization'];
  if (!header) return res.json({ user: null });
  const token = header.split(' ')[1];
  try {
    const payload = jwt.verify(token, SECRET);
    const rows = await db.query('SELECT id, username, email, role, created_at FROM users WHERE id = ?', [payload.userId]);
    return res.json({ user: rows[0] || null });
  } catch (e) {
    return res.json({ user: null });
  }
});

module.exports = router;
