import express from 'express';
import database from '../data/database.js';

const router = express.Router();

// get all rooms, or rooms for a specific building via query param ?buildingId=
router.get('/', async (req, res) => {
  try {
    const db = database.getDB();
    const { buildingId } = req.query;

    if (buildingId) {
      db.all('SELECT * FROM rooms WHERE building_id = ?', [buildingId], (err, rows) => {
        if (err) {
          console.error('Error fetching rooms for building:', err);
          res.status(500).json({ error: 'Failed to fetch rooms for building' });
        } else {
          res.json(rows);
        }
      });
    } else {
      db.all('SELECT * FROM rooms', [], (err, rows) => {
        if (err) {
          console.error('Error fetching rooms:', err);
          res.status(500).json({ error: 'Failed to fetch rooms' });
        } else {
          res.json(rows);
        }
      });
    }
  } catch (error) {
    console.error('Error in rooms route:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// available rooms for a time range
// GET /api/rooms/available?start=ISO&end=ISO[&building_id=][&min_capacity=]
router.get('/available', async (req, res) => {
  try {
    const db = database.getDB();
    const startParam = req.query.start;
    const endParam = req.query.end;
    const buildingId = req.query.building_id || null;
    const minCapacity = req.query.min_capacity ? parseInt(req.query.min_capacity, 10) : null;
    const isFaculty = req.query.isFaculty;
    const userId = parseInt(req.query.userId);

    console.log(isFaculty)

    if (!startParam || !endParam) {
      return res.status(400).json({ error: 'start and end are required query params (ISO 8601)' });
    }
    const start = new Date(startParam);
    const end = new Date(endParam);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end <= start) {
      return res.status(400).json({ error: 'Invalid time range' });
    }

    const conditions = [];
    const params = [];
    if (buildingId) {
      conditions.push('r.building_id = ?');
      params.push(buildingId);
    }
    if (Number.isFinite(minCapacity)) {
      conditions.push('r.capacity >= ?');
      params.push(minCapacity);
    }

    db.all("SELECT * FROM user_building_access", (err, rows) => console.log("Users:", rows));
    const whereRooms = `WHERE 1=1${conditions.length ? ' AND ' + conditions.join(' AND ') : ''}`;

    const sqlForFaculty = `
      SELECT r.*, b.code AS building_code, b.name AS building_name
      FROM rooms r
      JOIN buildings b ON r.building_id = b.id JOIN user_building_access u ON u.building_id = r.building_id AND u.user_id = ?
      ${whereRooms}
      AND NOT EXISTS (
        SELECT 1
        FROM room_bookings rb
        WHERE rb.room_id = r.id
          AND NOT (rb.end_time <= ? OR rb.start_time >= ?)

      )`;

    const sql = `
      SELECT r.*, b.code AS building_code, b.name AS building_name
      FROM rooms r
      LEFT JOIN buildings b ON r.building_id = b.id
      ${whereRooms}
      AND NOT EXISTS (
        SELECT 1
        FROM room_bookings rb
        WHERE rb.room_id = r.id
          AND NOT (rb.end_time <= ? OR rb.start_time >= ?)
      )`;
    if(isFaculty){
        db.all(sqlForFaculty, [userId, ...params, start.toISOString(), end.toISOString()], (err, rows) => {
        if (err) {
          console.error('Error searching available rooms:', err);
          return res.status(500).json({ error: 'Failed to search available rooms' });
        }
        console.log(rows)
        res.json(rows || []);
      });
    }
    else{
      db.all(sql, [...params, start.toISOString(), end.toISOString()], (err, rows) => {
        if (err) {
          console.error('Error searching available rooms:', err);
          return res.status(500).json({ error: 'Failed to search available rooms' });
        }
        res.json(rows || []);
      });
    }
  } catch (error) {
    console.error('Error in rooms available route:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Check room availability in a range
// GET /api/rooms/:roomId/availability?start=ISO&end=ISO
router.get('/:roomId/availability', async (req, res) => {
  try {
    console.log("THIS ONE")
    const db = database.getDB();
    const { roomId } = req.params;
    const { start: startParam, end: endParam } = req.query;
    if (!startParam || !endParam) {
      return res.status(400).json({ error: 'start and end are required query params (ISO 8601)' });
    }
    const start = new Date(startParam);
    const end = new Date(endParam);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end <= start) {
      return res.status(400).json({ error: 'Invalid time range' });
    }

    db.all(
      `SELECT rb.*, e.title AS event_title
       FROM room_bookings rb
       LEFT JOIN events e ON rb.event_id = e.id
       WHERE rb.room_id = ?
         AND NOT (rb.end_time <= ? OR rb.start_time >= ?)
       ORDER BY rb.start_time ASC`,
      [roomId, start.toISOString(), end.toISOString()],
      (err, rows) => {
        if (err) {
          console.error('Error checking room availability:', err);
          return res.status(500).json({ error: 'Failed to check room availability' });
        }
        const conflicts = rows || [];
        const available = conflicts.length === 0;
        res.json({ room_id: Number(roomId), available, conflicts });
      }
    );
  } catch (error) {
    console.error('Error in room availability route:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// get a single room by id (keep this after the more specific routes)
router.get('/:id', async (req, res) => {
  try {
    const db = database.getDB();
    const { id } = req.params;

    db.get('SELECT * FROM rooms WHERE id = ?', [id], (err, row) => {
      if (err) {
        console.error('Error fetching room:', err);
        res.status(500).json({ error: 'Failed to fetch room' });
      } else if (!row) {
        res.status(404).json({ error: 'Room not found' });
      } else {
        res.json(row);
      }
    });
  } catch (error) {
    console.error('Error in room route:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
