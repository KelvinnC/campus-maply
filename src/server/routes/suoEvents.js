import express from 'express';

const router = express.Router();

const SUO_EVENTS_API = 'https://www.suo.ca/wp-json/tribe/events/v1/events';

router.get('/', async (req, res) => {
  try {
    const response = await fetch(SUO_EVENTS_API);

    if (!response.ok) {
      console.error('Failed to fetch SUO events:', response.status, response.statusText);
      return res.status(502).json({ error: 'Failed to fetch events from SUO' });
    }

    const data = await response.json();
    const events = (data.events || []).map((event) => ({
      id: event.id,
      title: event.title,
      description: event.description,
      url: event.url,
      start_date: event.start_date,
      end_date: event.end_date,
      all_day: event.all_day,
      venue: event.venue
        ? {
            name: event.venue.venue || null,
            address: event.venue.address || null,
            city: event.venue.city || null,
            province: event.venue.province || null,
            zip: event.venue.zip || null,
          }
        : null,
      image_url: event.image && event.image.url ? event.image.url : null,
    }));

    res.json(events);
  } catch (error) {
    console.error('Error while fetching SUO events:', error);
    res.status(500).json({ error: 'Internal server error while fetching SUO events' });
  }
});

export default router;

