const express = require('express');
const db = require('../db');
const auth = require('../middleware/authMiddleware');
const admin = require('../middleware/adminMiddleware');
const router = express.Router();

// GET /api/parts  - öffentliche Liste
router.get('/', async (req, res) => {
  try {
    const rows = await db.query('SELECT * FROM parts ORDER BY created_at DESC');
    res.json(rows);
  } catch (e) {
    console.error('GET parts error', e);
    res.status(500).json({ error: 'Server Error' });
  }
});

// GET /api/parts/:id
router.get('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const rows = await db.query('SELECT * FROM parts WHERE id = ?', [id]);
    if (!rows[0]) return res.status(404).json({ error: 'Nicht gefunden' });
    res.json(rows[0]);
  } catch (e) {
    console.error('GET part by id error', e);
    res.status(500).json({ error: 'Server Error' });
  }
});

// POST /api/parts  - Admin
router.post('/', auth, admin, async (req, res) => {
  const { name, price, img, description } = req.body;
  if (!name || price == null) return res.status(400).json({ error: 'name & price nötig' });
  try {
    const result = await db.executeRaw('INSERT INTO parts (name, price, img, description) VALUES (?, ?, ?, ?)', [name, price, img || null, description || null]);
    const insertId = result.insertId;
    const rows = await db.query('SELECT * FROM parts WHERE id = ?', [insertId]);
    res.status(201).json(rows[0]);
  } catch (e) {
    console.error('POST parts error', e);
    res.status(500).json({ error: 'Server Error' });
  }
});

// PUT /api/parts/:id - Admin
router.put('/:id', auth, admin, async (req, res) => {
  const id = req.params.id;
  const { name, price, img, description } = req.body;
  try {
    await db.executeRaw('UPDATE parts SET name = ?, price = ?, img = ?, description = ? WHERE id = ?', [name, price, img || null, description || null, id]);
    const rows = await db.query('SELECT * FROM parts WHERE id = ?', [id]);
    res.json(rows[0]);
  } catch (e) {
    console.error('PUT parts error', e);
    res.status(500).json({ error: 'Server Error' });
  }
});

// DELETE /api/parts/:id - Admin
router.delete('/:id', auth, admin, async (req, res) => {
  const id = req.params.id;
  try {
    await db.executeRaw('DELETE FROM parts WHERE id = ?', [id]);
    res.json({ ok: true });
  } catch (e) {
    console.error('DELETE parts error', e);
    res.status(500).json({ error: 'Server Error' });
  }
});

module.exports = router;
