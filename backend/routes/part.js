// backend/routes/parts.js
const express = require('express');
const db = require('../db');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM parts ORDER BY created_at DESC');
    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Server Error' });
  }
});

router.post('/', async (req, res) => {
  const { name, price, img, description } = req.body;
  try {
    const { rows } = await db.query('INSERT INTO parts (name, price, img, description) VALUES (?, ?, ?, ?)', [name, price, img, description]);
    // SELECT the inserted row (by last insert id)
    // Simpler: run one more query to return created item (matching name & created_at is not perfect)
    // Better: use pool.execute to get insertId:
    // const [result] = await db.pool.execute('INSERT ...', [..]); result.insertId
    const [res2] = await db.pool.execute('SELECT * FROM parts WHERE id = LAST_INSERT_ID()');
    res.status(201).json(res2[0]);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Server Error' });
  }
});

router.put('/:id', async (req, res) => {
  const id = req.params.id;
  const { name, price, img, description } = req.body;
  try {
    await db.query('UPDATE parts SET name = ?, price = ?, img = ?, description = ? WHERE id = ?', [name, price, img, description, id]);
    const { rows } = await db.query('SELECT * FROM parts WHERE id = ?', [id]);
    res.json(rows[0]);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Server Error' });
  }
});

router.delete('/:id', async (req, res) => {
  const id = req.params.id;
  try {
    await db.query('DELETE FROM parts WHERE id = ?', [id]);
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Server Error' });
  }
});

module.exports = router;
    