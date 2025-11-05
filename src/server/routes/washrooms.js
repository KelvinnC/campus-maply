import express from 'express';
import database from '../data/database.js';

const router = express.Router();

// get all washrooms, or washrooms for a specific building via query param ?buildingId=
router.get('/', async (req, res) => {
  try {
    const db = database.getDB();
    const { buildingId } = req.query;

    if (buildingId) {
      db.all('SELECT * FROM washrooms WHERE building_id = ?', [buildingId], (err, rows) => {
        if (err) {
          console.error('Error fetching washrooms for building:', err);
          res.status(500).json({ error: 'Failed to fetch washrooms for building' });
        } else {
          res.json(rows);
        }
      });
    } else {
      db.all('SELECT * FROM washrooms', [], (err, rows) => {
        if (err) {
          console.error('Error fetching washrooms:', err);
          res.status(500).json({ error: 'Failed to fetch washrooms' });
        } else {
          res.json(rows);
        }
      });
    }
  } catch (error) {
    console.error('Error in washrooms route:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// get a single washroom by id
router.get('/:id', async (req, res) => {
  try {
    const db = database.getDB();
    const { id } = req.params;

    db.get('SELECT * FROM washrooms WHERE id = ?', [id], (err, row) => {
      if (err) {
        console.error('Error fetching washroom:', err);
        res.status(500).json({ error: 'Failed to fetch washroom' });
      } else if (!row) {
        res.status(404).json({ error: 'Washroom not found' });
      } else {
        res.json(row);
      }
    });
  } catch (error) {
    console.error('Error in washroom route:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
