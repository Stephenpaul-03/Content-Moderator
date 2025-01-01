const express = require('express');
const cors = require('cors');
const http = require('http');
const { setupWebSocketServer } = require('./websocketServer');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');
const { errorHandler } = require('./middlewares/errorHandler');
const app = express();
const server = http.createServer(app);

app.use(express.json({limit: '10mb'}));
app.use(express.urlencoded({limit: '10mb', extended: true}));

setupWebSocketServer(server);

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use(errorHandler);

app.get('/test', (req, res) => {
  res.json({ message: 'Backend is working!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

server.listen(8080, () => {
  console.log('WebSocket server running on port 8080');
});
