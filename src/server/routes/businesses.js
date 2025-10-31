import express from 'express';
import database from '../data/database.js';

const router = express.Router();

// get all businesses, or businesses for a specific building via query param ?buildingId=
router.get('/', async (req, res) => {
  try {
    const db = database.getDB();
    const { buildingId } = req.query;

    if (buildingId) {
      db.all('SELECT * FROM businesses WHERE building_id = ?', [buildingId], (err, rows) => {
        if (err) {
          console.error('Error fetching businesses for building:', err);
          res.status(500).json({ error: 'Failed to fetch businesses for building' });
        } else {
          res.json(rows);
        }
      });
    } else {
      db.all('SELECT * FROM businesses', [], (err, rows) => {
        if (err) {
          console.error('Error fetching businesses:', err);
          res.status(500).json({ error: 'Failed to fetch businesses' });
        } else {
          res.json(rows);
        }
      });
    }
  } catch (error) {
    console.error('Error in businesses route:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// get a single business by id
router.get('/:id', async (req, res) => {
  try {
    const db = database.getDB();
    const { id } = req.params;

    db.get('SELECT * FROM businesses WHERE id = ?', [id], (err, row) => {
      if (err) {
        console.error('Error fetching business:', err);
        res.status(500).json({ error: 'Failed to fetch business' });
      } else if (!row) {
        res.status(404).json({ error: 'Business not found' });
      } else {
        res.json(row);
      }
    });
  } catch (error) {
    console.error('Error in business route:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
