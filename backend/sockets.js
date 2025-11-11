// backend/sockets.js
const jwt = require('jsonwebtoken');
const db = require('./db');
const SECRET = process.env.JWT_SECRET || 'dev_secret';

module.exports = function(io) {
  io.on('connection', socket => {
    console.log('Socket verbunden:', socket.id);

    // Optional: token im Query prüfen
    socket.on('join', (data) => {
      // data könnte Raum oder token enthalten
      // socket.join(room) ...
    });

    socket.on('chat-message', async (payload) => {
      try {
        let userId = null;
        if (payload.token) {
          try {
            const p = jwt.verify(payload.token, SECRET);
            userId = p.userId;
          } catch (e) {
            // token invalid -> treat as guest
          }
        }
        const fromName = payload.from || (userId ? `user-${userId}` : 'guest');
        const message = payload.message || '';
        if (!message) return;

        // Save to DB (from_user_id nullable)
        await db.executeRaw('INSERT INTO chat_messages (from_user_id, message) VALUES (?, ?)', [userId, message]);

        // Broadcast to all
        io.emit('chat-message', { from: fromName, message, created_at: new Date() });
      } catch (e) {
        console.error('socket chat error', e);
      }
    });

    socket.on('disconnect', () => {
      console.log('Socket getrennt', socket.id);
    });
  });
};
