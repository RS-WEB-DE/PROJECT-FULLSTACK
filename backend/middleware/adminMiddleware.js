// backend/middleware/adminMiddleware.js
function adminMiddleware(req, res, next) {
  if (!req.user) return res.status(401).json({ error: 'Nicht eingeloggt' });
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin nur' });
  next();
}

module.exports = adminMiddleware;
