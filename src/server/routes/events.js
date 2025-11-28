import express from 'express';
import database from '../data/database.js';

const router = express.Router();
//List all events given a building ID
router.get('/get/:buildingId', async (req, res) => {
  try {
    const { buildingId } = req.params;
    const db = database.getDB();
    db.all(
      `SELECT *
      FROM room_bookings r LEFT JOIN events e ON r.event_id = e.id 
      LEFT JOIN rooms ON rooms.id = r.room_id
      WHERE rooms.building_id = ?`,
      [buildingId],
      (err, rows) => {
        if (err) {
          console.error('Error fetching events:', err);
          return res.status(500).json({ error: 'Failed to fetch events' });
        }
        res.json(rows);
      }
    );
  } catch (error) {
    console.error('Error in events route:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
// List all events (basic fields)
router.get('/', async (req, res) => {
  try {
    const db = database.getDB();
    db.all(
      `SELECT e.*,
              b.code AS building_code,
              b.name AS building_name,
              (SELECT json_object(
                'booking_id', rb.id,
                'room_id', r.id,
                'room_number', r.room_number,
                'capacity', r.capacity,
                'building_code', b2.code,
                'building_name', b2.name
              )
              FROM room_bookings rb
              LEFT JOIN rooms r ON rb.room_id = r.id
              LEFT JOIN buildings b2 ON r.building_id = b2.id
              WHERE rb.event_id = e.id
              ORDER BY rb.id DESC
              LIMIT 1) AS booking
       FROM events e
       LEFT JOIN buildings b ON e.building_id = b.id
       ORDER BY e.start_time DESC, e.id DESC`,
      [],
      (err, rows) => {
        if (err) {
          console.error('Error fetching events:', err);
          return res.status(500).json({ error: 'Failed to fetch events' });
        }
        const events = (rows || []).map(row => ({
          ...row,
          booking: row.booking ? JSON.parse(row.booking) : null
        }));
        res.json(events);
      }
    );
  } catch (error) {
    console.error('Error in events route:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// Get one event with optional booked room details
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const db = database.getDB();

    db.get(
      `SELECT e.*,
              b.code AS building_code,
              b.name AS building_name
       FROM events e
       LEFT JOIN buildings b ON e.building_id = b.id
       WHERE e.id = ?`,
      [id],
      (err, event) => {
        if (err) {
          console.error('Error fetching event:', err);
          return res.status(500).json({ error: 'Failed to fetch event' });
        }
        if (!event) return res.status(404).json({ error: 'Event not found' });

        db.get(
          `SELECT rb.id AS booking_id,
                  r.id AS room_id,
                  r.room_number,
                  r.capacity,
                  rb.start_time,
                  rb.end_time,
                  b.code AS building_code,
                  b.name AS building_name
           FROM room_bookings rb
           LEFT JOIN rooms r ON rb.room_id = r.id
           LEFT JOIN buildings b ON r.building_id = b.id
           WHERE rb.event_id = ?
           ORDER BY rb.id DESC
           LIMIT 1`,
          [id],
          (err2, booking) => {
            if (err2) {
              console.error('Error fetching event booking:', err2);
              return res.status(500).json({ error: 'Failed to fetch event booking' });
            }
            res.json({ ...event, booking: booking || null });
          }
        );
      }
    );
  } catch (error) {
    console.error('Error in event route:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

//Edit an Event
router.post('/edit', async (req, res) => {
  try {
        const db = database.getDB();
    const {
      id,
      title,
      description = null,
      building_id = null,
      start_time = null,
      end_time = null,
      room_id = null,
    } = req.body || {};

    db.run(
      `
      UPDATE events
      SET title=?, description=?, start_time=?, end_time=?, building_id=?
      WHERE id = ?
      `,[title, description, start_time, end_time,building_id, id], (err,) =>{
        if (err) {
          console.error('Error fetching event:', err);
          return res.status(500).json({ error: 'Failed to fetch event' });
        }},(err, updateData) =>{

       
          db.get(
            `
              SELECT room_id, start_time, end_time
              FROM room_bookings
              WHERE event_id = ?
            `,[id], (err, data) =>{
              if (err) {
                console.error('Error fetching event:', err);
                return res.status(500).json({ error: 'Failed to fetch event' });
              }
              console.log(data)
              if(room_id !== null || !data && (data.room_id !== room_id || data.start_time !== start_time || data.end_time !== end_time)){
                db.run(
                  `
                  DELETE FROM room_bookings WHERE event_id = ?
                  `,[id], (err) =>{
                    if (err) {
                      console.error('Error fetching event:', err);
                      return res.status(500).json({ error: 'Failed to fetch event' });
                    }
                  }
                )
                db.run(
                  `
                    INSERT INTO room_bookings (room_id, event_id, start_time, end_time)
                    VALUES(?,?,?,?)
                  `,[room_id,id,start_time,end_time], (err) =>{
                    if (err) {
                      console.error('Error fetching event:', err);
                      return res.status(500).json({ error: 'Failed to fetch event' });
                    }
                  }
                )
              }
              console.log("DONE")
              return res.status(201).json({ id: id, title: title, description: description, building_id:building_id, start_time: start_time, end_time: end_time});
            }
          )
     }
    )
    
  } catch (error) {
    console.error('Error in events route:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// Create an event, optionally reserve a room if provided
router.post('/', async (req, res) => {
  try {
    const db = database.getDB();
    const {
      title,
      description = null,
      building_id = null,
      latitude = null,
      longitude = null,
      start_time = null,
      end_time = null,
      created_by = null,
      room_id = null,
    } = req.body || {};

    if (!title || !start_time || !end_time) {
      return res.status(400).json({ error: 'title, start_time, and end_time are required' });
    }

    const start = new Date(start_time);
    const end = new Date(end_time);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      return res.status(400).json({ error: 'Invalid start_time or end_time' });
    }
    if (end <= start) {
      return res.status(400).json({ error: 'end_time must be after start_time' });
    }

    db.run(
      `INSERT INTO events (title, description, building_id, latitude, longitude, start_time, end_time, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, description, building_id, latitude, longitude, start.toISOString(), end.toISOString(), created_by],
      function (err) {
        if (err) {
          console.error('Error creating event:', err);
          return res.status(500).json({ error: 'Failed to create event' });
        }

        const eventId = this.lastID;

        // If no room requested, return created event
        if (!room_id) {
          return res.status(201).json({ id: eventId, title, description, building_id, latitude, longitude, start_time: start.toISOString(), end_time: end.toISOString(), created_by });
        }

        // Check room availability
        db.get(
          `SELECT 1 AS conflict
           FROM room_bookings
           WHERE room_id = ?
             AND NOT (end_time <= ? OR start_time >= ?)
           LIMIT 1`,
          [room_id, start.toISOString(), end.toISOString()],
          (confErr, conflictRow) => {
            if (confErr) {
              console.error('Error checking room availability:', confErr);
              return res.status(500).json({ error: 'Failed to verify room availability' });
            }
            if (conflictRow) {
              return res.status(409).json({ error: 'Room is not available for the selected time range' });
            }

            // Reserve room for this event
            db.run(
              `INSERT INTO room_bookings (room_id, event_id, start_time, end_time)
               VALUES (?, ?, ?, ?)`,
              [room_id, eventId, start.toISOString(), end.toISOString()],
              function (bookErr) {
                if (bookErr) {
                  console.error('Error creating room booking:', bookErr);
                  return res.status(500).json({ error: 'Failed to create room booking' });
                }
                return res.status(201).json({
                  id: eventId,
                  title,
                  description,
                  building_id,
                  latitude,
                  longitude,
                  start_time: start.toISOString(),
                  end_time: end.toISOString(),
                  created_by,
                  booking: { id: this.lastID, room_id, start_time: start.toISOString(), end_time: end.toISOString() }
                });
              }
            );
          }
        );
      }
    );
  } catch (error) {
    console.error('Error creating event route:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
