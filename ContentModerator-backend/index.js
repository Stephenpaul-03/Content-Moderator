const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');
const { errorHandler } = require('./middlewares/errorHandler');
const app = express();

app.use(cors({
  origin: 'http://localhost:5173', 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], 
  allowedHeaders: ['Content-Type', 'Authorization'], 
  credentials: true 
}));

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use(errorHandler);

app.get('/test', (req, res) => {
  res.json({ message: 'Backend is working!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
