// backend/routes/cart.js
const express = require('express');
const db = require('../db');
const auth = require('../middleware/authMiddleware');
const router = express.Router();

// GET /api/cart - holt den Warenkorb des eingeloggten Nutzers
router.get('/', auth, async (req, res) => {
  try {
    const userId = req.user.userId;
    // join parts für Details
    const rows = await db.query(
      `SELECT ci.id AS cart_id, ci.qty, p.id AS part_id, p.name, p.price, p.img
       FROM cart_items ci
       JOIN parts p ON p.id = ci.part_id
       WHERE ci.user_id = ?`, [userId]
    );
    res.json(rows);
  } catch (e) {
    console.error('GET cart error', e);
    res.status(500).json({ error: 'Server Error' });
  }
});

// POST /api/cart - item hinzufügen oder qty erhöhen
router.post('/', auth, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { part_id, qty } = req.body;
    if (!part_id) return res.status(400).json({ error: 'part_id nötig' });
    // prüfen ob schon im cart
    const existing = await db.query('SELECT * FROM cart_items WHERE user_id = ? AND part_id = ?', [userId, part_id]);
    if (existing[0]) {
      // update qty
      const newQty = (existing[0].qty || 0) + (Number(qty) || 1);
      await db.executeRaw('UPDATE cart_items SET qty = ? WHERE id = ?', [newQty, existing[0].id]);
      return res.json({ ok: true });
    } else {
      await db.executeRaw('INSERT INTO cart_items (user_id, part_id, qty) VALUES (?, ?, ?)', [userId, part_id, Number(qty) || 1]);
      return res.status(201).json({ ok: true });
    }
  } catch (e) {
    console.error('POST cart error', e);
    res.status(500).json({ error: 'Server Error' });
  }
});

// DELETE /api/cart/:id - item entfernen (cart item id)
router.delete('/:id', auth, async (req, res) => {
  try {
    const id = req.params.id;
    const userId = req.user.userId;
    // optional: prüfe owner
    await db.executeRaw('DELETE FROM cart_items WHERE id = ? AND user_id = ?', [id, userId]);
    res.json({ ok: true });
  } catch (e) {
    console.error('DELETE cart error', e);
    res.status(500).json({ error: 'Server Error' });
  }
});

// POST /api/cart/clear - leere Warenkorb
router.post('/clear', auth, async (req, res) => {
  try {
    const userId = req.user.userId;
    await db.executeRaw('DELETE FROM cart_items WHERE user_id = ?', [userId]);
    res.json({ ok: true });
  } catch (e) {
    console.error('CLEAR cart error', e);
    res.status(500).json({ error: 'Server Error' });
  }
});

module.exports = router;
