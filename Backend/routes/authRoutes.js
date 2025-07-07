// backend/routes/authRoutes.js

const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

/**
 * ✅ Signup Route
 * Creates a new user (admin can create initial admin using createAdmin script).
 */
router.post('/signup', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = new User({ email, password });
    await user.save();

    console.log(`✅ User created: ${email}`);
    res.status(201).json({ message: 'User created' });
  } catch (err) {
    console.error('❌ Signup error:', err);
    res.status(400).json({ message: err.message });
  }
});

/**
 * ✅ Login Route
 * Logs in user, checks password, returns JWT with isAdmin flag.
 */
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log(`❌ Login failed: User not found (${email})`);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.log(`❌ Login failed: Incorrect password for ${email}`);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '1d' }
    );

    console.log(`✅ Login successful: ${email} | Admin: ${user.isAdmin}`);
    res.json({ token, isAdmin: user.isAdmin });
  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

module.exports = router;
