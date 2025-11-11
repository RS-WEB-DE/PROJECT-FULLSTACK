const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const db = require('./db');

const authRoutes = require('./routes/auth');
const partsRoutes = require('./routes/parts');
const cartRoutes = require('./routes/cart');
const forumRoutes = require('./routes/forum');
const adminRoutes = require('./routes/admin');

const initSockets = require('./sockets'); // <- direkt die Funktion importieren

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*', methods: ['GET','POST'] } });

app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/parts', partsRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/forum', forumRoutes);
app.use('/api/admin', adminRoutes);

// Healthcheck
app.get('/api/health', (req,res)=>res.json({ok:true}));

// Socket.IO
initSockets(io);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Backend läuft auf Port ${PORT}`));
