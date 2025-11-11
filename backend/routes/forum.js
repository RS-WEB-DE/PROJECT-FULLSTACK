// backend/routes/forum.js
const express = require('express');
const db = require('../db');
const auth = require('../middleware/authMiddleware');
const router = express.Router();

// GET /api/forum/threads
router.get('/threads', async (req, res) => {
  try {
    const threads = await db.query('SELECT ft.*, u.username FROM forum_threads ft LEFT JOIN users u ON u.id = ft.user_id ORDER BY ft.created_at DESC');
    res.json(threads);
  } catch (e) {
    console.error('GET threads error', e);
    res.status(500).json({ error: 'Server Error' });
  }
});

// POST /api/forum/threads - neuen Thread anlegen (auth)
router.post('/threads', auth, async (req, res) => {
  const { title } = req.body;
  if (!title) return res.status(400).json({ error: 'title nötig' });
  try {
    const result = await db.executeRaw('INSERT INTO forum_threads (title, user_id) VALUES (?, ?)', [title, req.user.userId]);
    const insertId = result.insertId;
    const rows = await db.query('SELECT ft.*, u.username FROM forum_threads ft LEFT JOIN users u ON u.id = ft.user_id WHERE ft.id = ?', [insertId]);
    res.status(201).json(rows[0]);
  } catch (e) {
    console.error('POST thread error', e);
    res.status(500).json({ error: 'Server Error' });
  }
});

// GET /api/forum/threads/:id/posts
router.get('/threads/:id/posts', async (req, res) => {
  try {
    const threadId = req.params.id;
    const posts = await db.query('SELECT fp.*, u.username FROM forum_posts fp LEFT JOIN users u ON u.id = fp.user_id WHERE fp.thread_id = ? ORDER BY fp.created_at ASC', [threadId]);
    res.json(posts);
  } catch (e) {
    console.error('GET posts error', e);
    res.status(500).json({ error: 'Server Error' });
  }
});

// POST /api/forum/threads/:id/posts - neuen Post (auth)
router.post('/threads/:id/posts', auth, async (req, res) => {
  try {
    const threadId = req.params.id;
    const { content } = req.body;
    if (!content) return res.status(400).json({ error: 'content nötig' });
    const result = await db.executeRaw('INSERT INTO forum_posts (thread_id, user_id, content) VALUES (?, ?, ?)', [threadId, req.user.userId, content]);
    const insertId = result.insertId;
    const rows = await db.query('SELECT fp.*, u.username FROM forum_posts fp LEFT JOIN users u ON u.id = fp.user_id WHERE fp.id = ?', [insertId]);
    res.status(201).json(rows[0]);
  } catch (e) {
    console.error('POST post error', e);
    res.status(500).json({ error: 'Server Error' });
  }
});

module.exports = router;
