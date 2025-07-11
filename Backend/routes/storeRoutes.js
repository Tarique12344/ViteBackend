// backend/routes/storeRoutes.js
const express = require('express');
const router = express.Router();
const ShopItem = require('../models/shopItem');
const jwt = require('jsonwebtoken');

// Middleware to verify admin
const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ message: 'No token provided' });

  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Token missing' });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    if (!decoded.isAdmin) return res.status(403).json({ message: 'Admin access required' });
    next();
  });
};

// GET all store items (public)
router.get('/', async (req, res) => {
  try {
    const items = await ShopItem.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST new store item (admin only)
router.post('/', verifyToken, async (req, res) => {
  const item = new ShopItem({
    name: req.body.name,
    price: req.body.price,
    description: req.body.description,
    image: req.body.image,
    stock: req.body.stock || 0,
  });

  try {
    const newItem = await item.save();
    res.status(201).json(newItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE store item (admin only)
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const item = await ShopItem.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    await item.remove();
    res.json({ message: 'Item deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
