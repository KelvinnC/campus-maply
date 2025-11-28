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
const { default: washroomsRouter } = await import('../../server/routes/washrooms.js');

// Create test app
const app = express();
app.use(express.json());
app.use('/api/washrooms', washroomsRouter);

describe('Washrooms API', () => {
  describe('GET /api/washrooms', () => {
    it('should return all washrooms', async () => {
      const response = await request(app).get('/api/washrooms');
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(3);
    });

    it('should return washrooms with correct properties', async () => {
      const response = await request(app).get('/api/washrooms');
      
      expect(response.status).toBe(200);
      const washroom = response.body[0];
      expect(washroom).toHaveProperty('id');
      expect(washroom).toHaveProperty('building_id');
      expect(washroom).toHaveProperty('room_number');
      expect(washroom).toHaveProperty('accessibility');
      expect(washroom).toHaveProperty('gender');
    });

    it('should filter washrooms by building ID', async () => {
      const response = await request(app).get('/api/washrooms?buildingId=1');
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(2);
      response.body.forEach(washroom => {
        expect(washroom.building_id).toBe(1);
      });
    });

    it('should return empty array for building with no washrooms', async () => {
      const response = await request(app).get('/api/washrooms?buildingId=999');
      
      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });

    it('should include accessibility information', async () => {
      const response = await request(app).get('/api/washrooms');
      
      expect(response.status).toBe(200);
      response.body.forEach(washroom => {
        expect(washroom.accessibility).toBe('Wheelchair accessible');
      });
    });
  });

  describe('GET /api/washrooms/:id', () => {
    it('should return a specific washroom by ID', async () => {
      const response = await request(app).get('/api/washrooms/1');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', 1);
      expect(response.body).toHaveProperty('room_number', '100A');
    });

    it('should return 404 for non-existent washroom', async () => {
      const response = await request(app).get('/api/washrooms/999');
      
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Washroom not found');
    });

    it('should return washroom with gender information', async () => {
      // Test all-gender washroom
      const response1 = await request(app).get('/api/washrooms/1');
      expect(response1.status).toBe(200);
      expect(response1.body.gender).toBe('All-gender');

      // Test women's washroom
      const response2 = await request(app).get('/api/washrooms/2');
      expect(response2.status).toBe(200);
      expect(response2.body.gender).toBe('Women');

      // Test men's washroom
      const response3 = await request(app).get('/api/washrooms/3');
      expect(response3.status).toBe(200);
      expect(response3.body.gender).toBe('Men');
    });
  });
});

