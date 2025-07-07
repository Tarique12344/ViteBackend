// backend/routes/petRoutes.js

const express = require('express');
const router = express.Router();
const Pet = require('../models/pets');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// ✅ Utility middleware to verify JWT for protected routes
const verifyToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Token missing' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    req.userId = decoded.userId;

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error('Token verification error:', err);
    return res.status(403).json({ message: 'Invalid token' });
  }
};

// ✅ GET all pets (public)
router.get('/', async (req, res) => {
  try {
    const pets = await Pet.find();
    res.json(pets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ POST new pet (admin protected)
router.post('/', verifyToken, async (req, res) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ message: 'Access denied: Admins only' });
  }

  const pet = new Pet({
    name: req.body.name,
    type: req.body.type,
    breed: req.body.breed,
    age: req.body.age,
    description: req.body.description,
    image: req.body.image,
    likes: req.body.likes || 0,
  });

  try {
    const newPet = await pet.save();
    res.status(201).json(newPet);
  } catch (err) {
    console.error('Error creating pet:', err);
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
