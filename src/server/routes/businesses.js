import express from 'express';
import database from '../data/database.js';

const router = express.Router({ mergeParams: true });

router.get('/', async (req, res) => {
  try {
    const db = database.getDB();
    const qp = req.query || {};
    const paramBuildingId = req.params?.buildingId;

    const where = [];
    const args = [];

    const buildingId = paramBuildingId || qp.buildingId;
    if (buildingId) {
      where.push('building_id = ?');
      args.push(buildingId);
    }

    if (qp.category) {
      where.push('category = ?');
      args.push(qp.category);
    }

    if (qp.q) {
      where.push('(name LIKE ? OR IFNULL(description, "") LIKE ?)');
      const like = `%${qp.q}%`;
      args.push(like, like);
    }

    const sql = `SELECT * FROM businesses ${where.length ? 'WHERE ' + where.join(' AND ') : ''} ORDER BY name ASC`;
    db.all(sql, args, (err, rows) => {
      if (err) {
        console.error('Error fetching businesses:', err);
        res.status(500).json({ error: 'Failed to fetch businesses' });
      } else {
        res.json(rows);
      }
    });
  } catch (error) {
    console.error('Error in businesses route:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/categories', async (req, res) => {
  try {
    const db = database.getDB();
    const { buildingId } = req.query || {};
    const where = [];
    const args = [];
    if (buildingId) {
      where.push('building_id = ?');
      args.push(buildingId);
    }
    const sql = `SELECT DISTINCT category FROM businesses ${where.length ? 'WHERE ' + where.join(' AND ') : ''} ORDER BY category ASC`;
    db.all(sql, args, (err, rows) => {
      if (err) {
        console.error('Error fetching business categories:', err);
        res.status(500).json({ error: 'Failed to fetch categories' });
      } else {
        res.json(rows.map(r => r.category));
      }
    });
  } catch (error) {
    console.error('Error in business categories route:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

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
