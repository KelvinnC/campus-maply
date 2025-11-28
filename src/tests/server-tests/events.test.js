import { describe, it, expect, vi } from 'vitest';
import express from 'express';
import request from 'supertest';
import testDb from './helpers/testDb.js';

// Mock the database module before importing the router
vi.mock('../../server/data/database.js', () => {
  return {
    default: {
      getDB: () => testDb.getDB(),
      init: () => Promise.resolve(),
      close: () => {},
    },
  };
});

// Import the router after mocking
const { default: eventsRouter } = await import('../../server/routes/events.js');

// Create test app
const app = express();
app.use(express.json());
app.use('/api/events', eventsRouter);

describe('Events API', () => {
  describe('GET /api/events', () => {
    it('should return all events', async () => {
      const response = await request(app).get('/api/events');
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(2);
    });

    it('should return events with correct properties', async () => {
      const response = await request(app).get('/api/events');
      
      expect(response.status).toBe(200);
      const event = response.body[0];
      expect(event).toHaveProperty('id');
      expect(event).toHaveProperty('title');
      expect(event).toHaveProperty('start_time');
      expect(event).toHaveProperty('end_time');
    });

    it('should include building information', async () => {
      const response = await request(app).get('/api/events');
      
      expect(response.status).toBe(200);
      const eventWithBuilding = response.body.find(e => e.building_id);
      expect(eventWithBuilding).toHaveProperty('building_code');
      expect(eventWithBuilding).toHaveProperty('building_name');
    });
  });

  describe('GET /api/events/:id', () => {
    it('should return a specific event by ID', async () => {
      const response = await request(app).get('/api/events/1');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', 1);
      expect(response.body).toHaveProperty('title', 'Test Event 1');
    });

    it('should return 404 for non-existent event', async () => {
      const response = await request(app).get('/api/events/999');
      
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Event not found');
    });

    it('should include booking information if available', async () => {
      const response = await request(app).get('/api/events/1');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('booking');
    });
  });

  describe('GET /api/events/get/:buildingId', () => {
    it('should return events for a specific building', async () => {
      const response = await request(app).get('/api/events/get/1');
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should return empty array for building with no events', async () => {
      const response = await request(app).get('/api/events/get/999');
      
      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });
  });

  describe('POST /api/events', () => {
    it('should create a new event without room booking', async () => {
      const newEvent = {
        title: 'New Test Event',
        description: 'A new test event',
        start_time: '2025-12-20T10:00:00.000Z',
        end_time: '2025-12-20T12:00:00.000Z',
        created_by: 1,
      };

      const response = await request(app)
        .post('/api/events')
        .send(newEvent);
      
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('title', 'New Test Event');
    });

    it('should create an event with room booking', async () => {
      const newEvent = {
        title: 'Event With Room',
        description: 'An event with a room booking',
        start_time: '2025-12-25T14:00:00.000Z',
        end_time: '2025-12-25T16:00:00.000Z',
        created_by: 1,
        room_id: 2, // Room 2 should be available
      };

      const response = await request(app)
        .post('/api/events')
        .send(newEvent);
      
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('booking');
      expect(response.body.booking).toHaveProperty('room_id', 2);
    });

    it('should fail when required fields are missing', async () => {
      const response = await request(app)
        .post('/api/events')
        .send({
          description: 'Missing title and times',
        });
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should fail when end time is before start time', async () => {
      const response = await request(app)
        .post('/api/events')
        .send({
          title: 'Invalid Times Event',
          start_time: '2025-12-20T12:00:00.000Z',
          end_time: '2025-12-20T10:00:00.000Z',
        });
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'end_time must be after start_time');
    });

    it('should fail when room is not available', async () => {
      // Room 1 is booked for 2025-12-01 10:00-11:00
      const response = await request(app)
        .post('/api/events')
        .send({
          title: 'Conflicting Event',
          start_time: '2025-12-01T10:00:00.000Z',
          end_time: '2025-12-01T11:00:00.000Z',
          room_id: 1,
        });
      
      expect(response.status).toBe(409);
      expect(response.body).toHaveProperty('error', 'Room is not available for the selected time range');
    });

    it('should allow booking same room at different time', async () => {
      const response = await request(app)
        .post('/api/events')
        .send({
          title: 'Different Time Event',
          start_time: '2025-12-01T14:00:00.000Z',
          end_time: '2025-12-01T15:00:00.000Z',
          room_id: 1,
        });
      
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('booking');
    });
  });
});

