// backend/index.js
require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

// routes
const authRoutes = require('./backend/routes/auth');
const partsRoutes = require('./backend/routes/parts');
const cartRoutes = require('./backend/routes/cart');
const forumRoutes = require('./backend/routes/forum');
const adminRoutes = require('./backend/routes/admin');
const sockets = require('./backend/sockets');

const app = express();
app.use(cors()); 
app.use(express.json());

// API Routen
app.use('/api/auth', authRoutes);
app.use('/api/parts', partsRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/forum', forumRoutes);
app.use('/api/admin', adminRoutes);


app.get('/api/health', (req, res) => res.json({ ok: true }));




const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: true, credentials: true } // in Prod: specific origin
});
sockets(io);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server läuft auf ${PORT}`));
