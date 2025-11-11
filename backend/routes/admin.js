// backend/routes/admin.js
const express = require('express');
const db = require('../db');
const auth = require('../middleware/authMiddleware');
const admin = require('../middleware/adminMiddleware');
const router = express.Router();

// Beispiel: Statistik-Endpunkt nur für Admins
router.get('/stats', auth, admin, async (req, res) => {
  try {
    const usersCount = (await db.query('SELECT COUNT(*) AS cnt FROM users'))[0].cnt;
    const partsCount = (await db.query('SELECT COUNT(*) AS cnt FROM parts'))[0].cnt;
    res.json({ users: usersCount, parts: partsCount });
  } catch (e) {
    console.error('admin stats error', e);
    res.status(500).json({ error: 'Server Error' });
  }
});

module.exports = router;
