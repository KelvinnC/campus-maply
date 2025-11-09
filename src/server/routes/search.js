import express from 'express';
import database from '../data/database.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const q = (req.query.q || '').trim();
  if (!q) return res.json([]);

  const tokens = q
    .split(/\s+/)
    .map(t => t.trim())
    .filter(Boolean)
    .slice(0, 5);

  try {
    const db = database.getDB();
    const results = [];

    const all = (sql, params = []) => new Promise((resolve, reject) => {
      db.all(sql, params, (err, rows) => {
        if (err) reject(err); else resolve(rows);
      });
    });

    // Buildings: every token must match some building field
    const buildingWhere = tokens
      .map(() => '(name LIKE ? OR code LIKE ? OR IFNULL(description, "") LIKE ?)')
      .join(' AND ');
    const buildingParams = tokens.flatMap(t => {
      const like = `%${t}%`;
      return [like, like, like];
    });

    const buildingSql = `
      SELECT id, code, name, description, latitude, longitude
      FROM buildings
      ${buildingWhere ? 'WHERE ' + buildingWhere : ''}
      ORDER BY name ASC
      LIMIT 25`;
    const buildingRows = await all(buildingSql, buildingParams);
    buildingRows.forEach(b => {
      results.push({
        type: 'building',
        id: b.id,
        code: b.code,
        name: b.name,
        description: b.description,
        latitude: b.latitude,
        longitude: b.longitude,
      });
    });

    const roomWhere = tokens
      .map(() => '((r.room_number LIKE ?) OR (IFNULL(r.room_type, "") LIKE ?) OR (IFNULL(b.code, "") LIKE ?) OR (IFNULL(b.name, "") LIKE ?))')
      .join(' AND ');
    const roomParams = tokens.flatMap(t => {
      const like = `%${t}%`;
      return [like, like, like, like];
    });

    const roomSql = `
      SELECT r.id AS id, r.room_number, r.capacity, r.furniture, r.layout, r.room_type, r.notes,
             b.id AS building_id, b.code AS building_code, b.name AS building_name,
             b.latitude AS latitude, b.longitude AS longitude
      FROM rooms r
      LEFT JOIN buildings b ON r.building_id = b.id
      ${roomWhere ? 'WHERE ' + roomWhere : ''}
      ORDER BY b.name ASC, r.room_number ASC
      LIMIT 50`;
    const roomRows = await all(roomSql, roomParams);
    roomRows.forEach(r => {
      results.push({
        type: 'room',
        id: r.id,
        room_number: r.room_number,
        capacity: r.capacity,
        room_type: r.room_type,
        building_id: r.building_id,
        building_code: r.building_code,
        building_name: r.building_name,
        latitude: r.latitude,
        longitude: r.longitude,
      });
    });

    const businessWhere = tokens
      .map(() => '(bs.name LIKE ? OR IFNULL(bs.category, "") LIKE ? OR IFNULL(bs.description, "") LIKE ?)')
      .join(' AND ');
    const businessParams = tokens.flatMap(t => {
      const like = `%${t}%`;
      return [like, like, like];
    });

    const businessSql = `
      SELECT bs.id AS id, bs.name AS name, bs.category AS category, bs.description AS description,
             bs.latitude AS latitude, bs.longitude AS longitude,
             b.id AS building_id, b.code AS building_code, b.name AS building_name
      FROM businesses bs
      LEFT JOIN buildings b ON bs.building_id = b.id
      ${businessWhere ? 'WHERE ' + businessWhere : ''}
      ORDER BY bs.name ASC
      LIMIT 50`;
    const businessRows = await all(businessSql, businessParams);
    businessRows.forEach(bz => {
      results.push({
        type: 'business',
        id: bz.id,
        name: bz.name,
        category: bz.category,
        description: bz.description,
        building_id: bz.building_id,
        building_code: bz.building_code,
        building_name: bz.building_name,
        latitude: bz.latitude,
        longitude: bz.longitude,
      });
    });

    const parkingWhere = tokens
      .map(() => '(name LIKE ? OR IFNULL(description, "") LIKE ?)')
      .join(' AND ');
    const parkingParams = tokens.flatMap(t => {
      const like = `%${t}%`;
      return [like, like];
    });

    const parkingSql = `
      SELECT id, name, description, latitude, longitude
      FROM parking_lots
      ${parkingWhere ? 'WHERE ' + parkingWhere : ''}
      ORDER BY name ASC
      LIMIT 50`;
    const parkingRows = await all(parkingSql, parkingParams);
    parkingRows.forEach(p => {
      results.push({
        type: 'parking',
        id: p.id,
        name: p.name,
        description: p.description,
        latitude: p.latitude,
        longitude: p.longitude,
      });
    });

    res.json(results);
  } catch (error) {
    console.error('Error in search route:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
