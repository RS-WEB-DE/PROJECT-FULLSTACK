// backend/routes/auth.js
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db');
const router = express.Router();
const SECRET = process.env.JWT_SECRET || 'dev_secret';

router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Fehlerhafte Daten' });
  const hash = await bcrypt.hash(password, 10);

  try {
    const sql = 'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)';
    const { rows } = await db.query(sql, [username, email, hash]);
    // Bei mysql2 liefert execute nicht automatisch die Inserted Row. Wir lesen insertId so:
    // Alternativ: SELECT nochmal, oder benutze transactions / LAST_INSERT_ID()
    // Hier: SELECT the created user
    const sel = await db.query('SELECT id, username, email, role FROM users WHERE username = ?', [username]);
    return res.json({ user: sel.rows[0] });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Server Error' });
  }
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const { rows } = await db.query('SELECT * FROM users WHERE username = ?', [username]);
    const user = rows[0];
    if (!user) return res.status(401).json({ error: 'Ungültig' });
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ error: 'Ungültig' });
    const token = jwt.sign({ userId: user.id, username: user.username, role: user.role }, SECRET, { expiresIn: '7d' });
    return res.json({ token, user: { id: user.id, username: user.username, role: user.role } });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Server Error' });
  }
});

module.exports = router;
