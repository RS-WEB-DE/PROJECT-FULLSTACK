// backend/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET || 'dev_secret';

// Prüft Authorization Header "Bearer <token>" und setzt req.user
function authMiddleware(req, res, next) {
  const header = req.headers['authorization'];
  if (!header) return res.status(401).json({ error: 'Kein Token' });
  const parts = header.split(' ');
  if (parts.length !== 2) return res.status(401).json({ error: 'Ungültiger Header' });
  const token = parts[1];
  try {
    const payload = jwt.verify(token, SECRET);
    req.user = payload; // enthält userId, username, role
    next();
  } catch (e) {
    return res.status(401).json({ error: 'Ungültiges Token' });
  }
}

module.exports = authMiddleware;
