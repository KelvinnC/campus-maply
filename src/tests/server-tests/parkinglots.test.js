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
const { default: parkinglotsRouter } = await import('../../server/routes/parkinglots.js');

// Create test app
const app = express();
app.use(express.json());
app.use('/api/parkinglots', parkinglotsRouter);

describe('Parking Lots API', () => {
  describe('GET /api/parkinglots', () => {
    it('should return all parking lots', async () => {
      const response = await request(app).get('/api/parkinglots');
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(3);
    });

    it('should return parking lots with correct properties', async () => {
      const response = await request(app).get('/api/parkinglots');
      
      expect(response.status).toBe(200);
      const parkingLot = response.body[0];
      expect(parkingLot).toHaveProperty('id');
      expect(parkingLot).toHaveProperty('name');
      expect(parkingLot).toHaveProperty('latitude');
      expect(parkingLot).toHaveProperty('longitude');
      expect(parkingLot).toHaveProperty('description');
    });

    it('should include expected parking lot names', async () => {
      const response = await request(app).get('/api/parkinglots');
      
      const names = response.body.map(p => p.name);
      expect(names).toContain('Parking Lot A');
      expect(names).toContain('Parking Lot B');
      expect(names).toContain('Parking Lot C');
    });
  });

  describe('GET /api/parkinglots/:id', () => {
    it('should return a specific parking lot by ID', async () => {
      const response = await request(app).get('/api/parkinglots/1');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', 1);
      expect(response.body).toHaveProperty('name', 'Parking Lot A');
    });

    it('should return 404 for non-existent parking lot', async () => {
      const response = await request(app).get('/api/parkinglots/999');
      
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Parking lot not found');
    });

    it('should return parking lot with all required fields', async () => {
      const response = await request(app).get('/api/parkinglots/2');
      
      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        id: 2,
        name: 'Parking Lot B',
        description: 'Staff parking',
      });
      expect(typeof response.body.latitude).toBe('number');
      expect(typeof response.body.longitude).toBe('number');
    });

    it('should return valid coordinates for each parking lot', async () => {
      const response = await request(app).get('/api/parkinglots');
      
      expect(response.status).toBe(200);
      response.body.forEach(parkingLot => {
        expect(parkingLot.latitude).toBeGreaterThan(49);
        expect(parkingLot.latitude).toBeLessThan(50);
        expect(parkingLot.longitude).toBeLessThan(-119);
        expect(parkingLot.longitude).toBeGreaterThan(-120);
      });
    });
  });
});

