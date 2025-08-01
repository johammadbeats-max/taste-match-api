const axios = require('axios');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST allowed' });
  }

  const { hostAnswers, guestAnswers, location = 'New York, NY' } = req.body;

  if (!hostAnswers || !guestAnswers) {
    return res.status(400).json({ error: 'Missing hostAnswers or guestAnswers' });
  }

  const YELP_API_KEY = process.env.YELP_API_KEY;

  if (!YELP_API_KEY) {
    return res.status(500).json({ error: 'Missing Yelp API Key in environment variables' });
  }

  try {
    // Combine answers to simulate preference matching (simple average for now)
    const scores = hostAnswers.map((val, i) => (val + guestAnswers[i]) / 2);
    const spicyTolerance = scores[0]; // Index 0 is spicy
    const adventurousness = scores[7]; // Index 7 is adventurousness

    // Optional: Customize search term or categories based on scores
    const term = adventurousness > 7 ? 'fusion' : 'food';
    const categories = spicyTolerance > 7 ? 'szechuan,mexican' : 'italian,japanese';

    const yelpResponse = await axios.get('https://api.yelp.com/v3/businesses/search', {
      headers: {
        Authorization: `Bearer ${YELP_API_KEY}`
      },
      params: {
        location,
        term,
        categories,
        sort_by: 'rating',
        limit: 5
      }
    });

    const restaurants = yelpResponse.data.businesses.map(b => ({
      name: b.name,
      rating: b.rating,
      address: b.location.display_address.join(', '),
      image_url: b.image_url,
      url: b.url,
      categories: b.categories.map(c => c.title).join(', ')
    }));

    return res.status(200).json(restaurants);
  } catch (err) {
    console.error('Yelp API error:', err.message);
    return res.status(500).json({ error: 'Failed to fetch restaurant recommendations.' });
  }
};
