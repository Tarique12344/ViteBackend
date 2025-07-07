// === backend/server.js ===
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

/* -------------------- Middleware -------------------- */
app.use(cors());

// Increase JSON and URL-encoded payload size limits to handle base64 images
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));

/* -------------------- Routes -------------------- */
const petRoutes = require('./routes/petRoutes');
const authRoutes = require('./routes/authRoutes');
const contactRoutes = require('./routes/contactRoutes'); // ✅ contact routes included
// const shopRoutes = require('./routes/shopRoutes'); // ✅ shop routes included

app.use('/api/pets', petRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/contact', contactRoutes);
// app.use('/api/shop', shopRoutes); // ✅ add shop API route

/* -------------------- MongoDB Connection -------------------- */
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
  })
  .catch((err) => console.error('❌ MongoDB connection error:', err));