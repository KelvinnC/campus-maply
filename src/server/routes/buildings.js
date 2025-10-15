import express from 'express';
import database from '../data/database.js';

const router = express.Router();

// get all buildings
router.get('/', async (req, res) => {
  try {
    const db = database.getDB();
    db.all('SELECT * FROM buildings', [], (err, rows) => {
      if (err) {
        console.error('Error fetching buildings:', err);
        res.status(500).json({ error: 'Failed to fetch buildings' });
      } else {
        res.json(rows);
      }
    });
  } catch (error) {
    console.error('Error in buildings route:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// get a single building by id
router.get('/:id', async (req, res) => {
  try {
    const db = database.getDB();
    const { id } = req.params;
    
    db.get('SELECT * FROM buildings WHERE id = ?', [id], (err, row) => {
      if (err) {
        console.error('Error fetching building:', err);
        res.status(500).json({ error: 'Failed to fetch building' });
      } else if (!row) {
        res.status(404).json({ error: 'Building not found' });
      } else {
        res.json(row);
      }
    });
  } catch (error) {
    console.error('Error in building route:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;

