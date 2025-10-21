import express from 'express';
import database from '../data/database.js';

const router = express.Router();

// get all parking lots
router.get('/', async (req, res) => {
  try {
    const db = database.getDB();
    db.all('SELECT * FROM parking_lots', [], (err, rows) => {
      if (err) {
        console.error('Error fetching parking lots:', err);
        res.status(500).json({ error: 'Failed to fetch parking lots' });
      } else {
        res.json(rows);
      }
    });
  } catch (error) {
    console.error('Error in parking lots route:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// get a single parking lot by id
router.get('/:id', async (req, res) => {
  try {
    const db = database.getDB();
    const { id } = req.params;
    
    db.get('SELECT * FROM parking_lots WHERE id = ?', [id], (err, row) => {
      if (err) {
        console.error('Error fetching parking lot:', err);
        res.status(500).json({ error: 'Failed to fetch parking lot' });
      } else if (!row) {
        res.status(404).json({ error: 'Parking lot not found' });
      } else {
        res.json(row);
      }
    });
  } catch (error) {
    console.error('Error in parking lot route:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
