const express = require('express');
const axios = require('axios');
require('dotenv').config();

const router = express.Router();

router.get('/', async (req, res) => {
  const city = req.query.city || 'Cincinnati'; // ✅ default to Cincinnati
  const apiKey = process.env.WEATHER_API_KEY;

  if (!apiKey) {
    console.error('Missing WEATHER_API_KEY in environment variables');
    return res.status(500).json({ error: 'Server misconfiguration: missing API key' });
  }

  const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${encodeURIComponent(city)}&days=3&aqi=no&alerts=no`;

  try {
    const response = await axios.get(url);
    res.json(response.data);
  } catch (err) {
    console.error('Weather fetch error:', err.response?.status, err.response?.data || err.message);
    res.status(500).json({ error: 'Server error fetching weather data' });
  }
});

module.exports = router;
