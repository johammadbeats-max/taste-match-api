
const axios = require('axios');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST allowed' });
  }

  const { hostAnswers, guestAnswers } = req.body;

  if (!hostAnswers || !guestAnswers) {
    return res.status(400).json({ error: 'Missing hostAnswers or guestAnswers' });
  }

  try {
    // Example placeholder logic. Replace with real scoring/recommendation system.
    const sampleResults = [
      { name: "Spicy Palace", cuisine: "Szechuan", score: 9.5 },
      { name: "Sweet Haven", cuisine: "Dessert Bar", score: 8.8 },
      { name: "Green Fork", cuisine: "Vegan Fusion", score: 8.6 }
    ];

    return res.status(200).json(sampleResults);
  } catch (err) {
    console.error("API error:", err.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
