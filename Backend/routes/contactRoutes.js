// backend/routes/contactRoutes.js
const express = require('express');
const router = express.Router();
const Contact = require('../models/contact');

router.post('/', async (req, res) => {
  const { name, email, topic, message } = req.body;

  try {
    const contact = new Contact({
      name,
      email,
      topic,
      message
    });

    await contact.save();
    res.status(201).json({ message: 'Contact message saved successfully' });
  } catch (error) {
    console.error('Error saving contact message:', error);
    res.status(500).json({ message: 'Server error saving contact message' });
  }
});

module.exports = router;
