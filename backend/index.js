const express = require('express');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const SECRET = 'DEIN_GEHEIMNIS'; // in prod: env var

const pool = new Pool({ connectionString: process.env.DATABASE_URL || 'postgres://localhost/watchcraft' });

const app = express();
app.use(cors());
app.use(express.json());

/* --- Auth Endpoints --- */
// Registrierung
app.post('/api/register', async (req, res) => {
  const { username, email, password } = req.body;
  const hash = await bcrypt.hash(password, 10);
  const result = await pool.query('INSERT INTO users (username,email,password_hash) VALUES ($1,$2,$3) RETURNING id, username', [username,email,hash]);
  res.json({ user: result.rows[0] });
});

// Login
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const r = await pool.query('SELECT * FROM users WHERE username=$1', [username]);
  const user = r.rows[0];
  if (!user) return res.status(401).json({ error: 'Kein Nutzer' });
  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) return res.status(401).json({ error: 'Falsch' });
  const token = jwt.sign({ userId: user.id, username: user.username }, SECRET, { expiresIn: '7d' });
  res.json({ token, user: { id: user.id, username: user.username } });
});

/* --- Parts Endpoints --- */
app.get('/api/parts', async (req, res) => {
  const r = await pool.query('SELECT * FROM parts ORDER BY created_at DESC');
  res.json(r.rows);
});

app.post('/api/parts', async (req, res) => {
  const { name, price, img, description } = req.body;
  const r = await pool.query('INSERT INTO parts (name,price,img,description) VALUES ($1,$2,$3,$4) RETURNING *', [name, price, img, description]);
  res.json(r.rows[0]);
});

/* --- Forum Endpoints (simplifiziert) --- */
app.get('/api/threads', async (req, res) => {
  const r = await pool.query('SELECT * FROM forum_threads ORDER BY created_at DESC');
  res.json(r.rows);
});

// ... weitere Endpunkte: create thread, posts, etc.

const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: '*' } });

io.on('connection', (socket) => {
  console.log('Socket verbunden', socket.id);

  socket.on('chat-message', async (data) => {
    // data: { token, message }
    // Optional: verify token then save message to DB
    io.emit('chat-message', { message: data.message, from: data.from, created_at: new Date() });
  });
});

server.listen(3000, () => console.log('Server läuft auf :3000'));
