import { describe, it, expect, vi } from 'vitest';
import express from 'express';
import request from 'supertest';
import testDb from './helpers/testDb.js';

// Mock the database module before importing the router
vi.mock('../data/database.js', () => {
  return {
    default: {
      getDB: () => testDb.getDB(),
      init: () => Promise.resolve(),
      close: () => {},
    },
  };
});

// Import the router after mocking
const { default: roomsRouter } = await import('../routes/rooms.js');

// Create test app
const app = express();
app.use(express.json());
app.use('/api/rooms', roomsRouter);

describe('Rooms API', () => {
  describe('GET /api/rooms', () => {
    it('should return all rooms', async () => {
      const response = await request(app).get('/api/rooms');
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(4);
    });

    it('should return rooms with correct properties', async () => {
      const response = await request(app).get('/api/rooms');
      
      expect(response.status).toBe(200);
      const room = response.body[0];
      expect(room).toHaveProperty('id');
      expect(room).toHaveProperty('building_id');
      expect(room).toHaveProperty('room_number');
      expect(room).toHaveProperty('capacity');
    });

    it('should filter rooms by building ID', async () => {
      const response = await request(app).get('/api/rooms?buildingId=1');
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(2);
      response.body.forEach(room => {
        expect(room.building_id).toBe(1);
      });
    });

    it('should return empty array for building with no rooms', async () => {
      const response = await request(app).get('/api/rooms?buildingId=999');
      
      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });
  });

  describe('GET /api/rooms/:id', () => {
    it('should return a specific room by ID', async () => {
      const response = await request(app).get('/api/rooms/1');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', 1);
      expect(response.body).toHaveProperty('room_number', '101');
      expect(response.body).toHaveProperty('capacity', 50);
    });

    it('should return 404 for non-existent room', async () => {
      const response = await request(app).get('/api/rooms/999');
      
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Room not found');
    });
  });

  describe('GET /api/rooms/available', () => {
    it('should return available rooms for a time range', async () => {
      const start = '2025-12-15T10:00:00.000Z';
      const end = '2025-12-15T11:00:00.000Z';
      
      const response = await request(app)
        .get(`/api/rooms/available?start=${start}&end=${end}`);
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should exclude rooms that are booked during the time range', async () => {
      // Room 1 is booked for 2025-12-01 10:00-11:00
      const start = '2025-12-01T10:00:00.000Z';
      const end = '2025-12-01T11:00:00.000Z';
      
      const response = await request(app)
        .get(`/api/rooms/available?start=${start}&end=${end}`);
      
      expect(response.status).toBe(200);
      const roomIds = response.body.map(r => r.id);
      expect(roomIds).not.toContain(1); // Room 1 should be excluded
    });

    it('should require start and end parameters', async () => {
      const response = await request(app).get('/api/rooms/available');
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should return error for invalid time range', async () => {
      const start = '2025-12-15T12:00:00.000Z';
      const end = '2025-12-15T10:00:00.000Z'; // End before start
      
      const response = await request(app)
        .get(`/api/rooms/available?start=${start}&end=${end}`);
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Invalid time range');
    });

    it('should filter by minimum capacity', async () => {
      const start = '2025-12-15T10:00:00.000Z';
      const end = '2025-12-15T11:00:00.000Z';
      
      const response = await request(app)
        .get(`/api/rooms/available?start=${start}&end=${end}&min_capacity=35`);
      
      expect(response.status).toBe(200);
      response.body.forEach(room => {
        expect(room.capacity).toBeGreaterThanOrEqual(35);
      });
    });
  });

  describe('GET /api/rooms/:roomId/availability', () => {
    it('should return availability for a specific room', async () => {
      const start = '2025-12-15T10:00:00.000Z';
      const end = '2025-12-15T11:00:00.000Z';
      
      const response = await request(app)
        .get(`/api/rooms/2/availability?start=${start}&end=${end}`);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('room_id', 2);
      expect(response.body).toHaveProperty('available', true);
      expect(response.body).toHaveProperty('conflicts');
      expect(response.body.conflicts).toEqual([]);
    });

    it('should return conflicts when room is booked', async () => {
      const start = '2025-12-01T10:00:00.000Z';
      const end = '2025-12-01T11:00:00.000Z';
      
      const response = await request(app)
        .get(`/api/rooms/1/availability?start=${start}&end=${end}`);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('available', false);
      expect(response.body.conflicts.length).toBeGreaterThan(0);
    });

    it('should require start and end parameters', async () => {
      const response = await request(app).get('/api/rooms/1/availability');
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });
});

