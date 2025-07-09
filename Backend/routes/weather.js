// backend/routes/weather.js
const express = require('express');
const fetch = require('node-fetch');
require('dotenv').config();

const router = express.Router();

router.get('/', async (req, res) => {
  const city = req.query.city || 'Toledo';
  const apiKey = process.env.WEATHER_API_KEY;

  const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=3&aqi=no&alerts=no`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.error('Weather API error:', response.status, await response.text());
      return res.status(500).json({ error: 'Failed to fetch weather data' });
    }
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error('Weather fetch error:', err);
    res.status(500).json({ error: 'Server error fetching weather' });
  }
});

module.exports = router;
