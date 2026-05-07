const express = require('express')
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());



// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.log('❌ MongoDB error:', err));

// Routes
app.get('/', (req, res) => {
  res.json({ message: '✅ Hangman API is running!' });
});
app.use('/api/auth', require('./routes/auth'));
app.use('/api/user', require('./routes/user'));
app.use('/api/game', require('./routes/game'));
app.use('/api/stats', require('./routes/stats'));
app.use('/api/dashboard', require('./routes/dashboard'));

// Health
app.get('/api/health', (req, res) => {
  res.json({ message: '✅ Server is running' });
});

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  console.log(`🚀 Server on http://localhost:${PORT}`);
});