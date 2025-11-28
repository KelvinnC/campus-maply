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
const { default: searchRouter } = await import('../routes/search.js');

// Create test app
const app = express();
app.use(express.json());
app.use('/api/search', searchRouter);

describe('Search API', () => {
  describe('GET /api/search', () => {
    it('should return empty array for empty query', async () => {
      const response = await request(app).get('/api/search?q=');
      
      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });

    it('should return empty array when q param is missing', async () => {
      const response = await request(app).get('/api/search');
      
      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });

    it('should search buildings by name', async () => {
      const response = await request(app).get('/api/search?q=Engineering');
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      
      const buildings = response.body.filter(r => r.type === 'building');
      expect(buildings.length).toBeGreaterThan(0);
      expect(buildings[0].name).toContain('Engineering');
    });

    it('should search buildings by code', async () => {
      const response = await request(app).get('/api/search?q=EME');
      
      expect(response.status).toBe(200);
      const buildings = response.body.filter(r => r.type === 'building');
      expect(buildings.length).toBeGreaterThan(0);
      expect(buildings[0].code).toBe('EME');
    });

    it('should search rooms by room number', async () => {
      const response = await request(app).get('/api/search?q=101');
      
      expect(response.status).toBe(200);
      const rooms = response.body.filter(r => r.type === 'room');
      expect(rooms.length).toBeGreaterThan(0);
      expect(rooms[0].room_number).toBe('101');
    });

    it('should search businesses by name', async () => {
      const response = await request(app).get('/api/search?q=Cafe');
      
      expect(response.status).toBe(200);
      const businesses = response.body.filter(r => r.type === 'business');
      expect(businesses.length).toBeGreaterThan(0);
    });

    it('should search parking lots by name', async () => {
      const response = await request(app).get('/api/search?q=Parking');
      
      expect(response.status).toBe(200);
      const parkingLots = response.body.filter(r => r.type === 'parking');
      expect(parkingLots.length).toBeGreaterThan(0);
    });

    it('should return results with correct type property', async () => {
      const response = await request(app).get('/api/search?q=Building');
      
      expect(response.status).toBe(200);
      response.body.forEach(result => {
        expect(['building', 'room', 'business', 'parking']).toContain(result.type);
      });
    });

    it('should include coordinates in results', async () => {
      const response = await request(app).get('/api/search?q=EME');
      
      expect(response.status).toBe(200);
      const building = response.body.find(r => r.type === 'building' && r.code === 'EME');
      expect(building).toHaveProperty('latitude');
      expect(building).toHaveProperty('longitude');
      expect(typeof building.latitude).toBe('number');
      expect(typeof building.longitude).toBe('number');
    });

    it('should handle multiple search tokens', async () => {
      const response = await request(app).get('/api/search?q=Science Building');
      
      expect(response.status).toBe(200);
      const buildings = response.body.filter(r => r.type === 'building');
      expect(buildings.some(b => b.name.includes('Science'))).toBe(true);
    });

    it('should be case insensitive', async () => {
      const response1 = await request(app).get('/api/search?q=ENGINEERING');
      const response2 = await request(app).get('/api/search?q=engineering');
      
      expect(response1.status).toBe(200);
      expect(response2.status).toBe(200);
      expect(response1.body.length).toBe(response2.body.length);
    });

    it('should include building info for rooms', async () => {
      const response = await request(app).get('/api/search?q=101');
      
      expect(response.status).toBe(200);
      const room = response.body.find(r => r.type === 'room');
      if (room) {
        expect(room).toHaveProperty('building_id');
        expect(room).toHaveProperty('building_code');
        expect(room).toHaveProperty('building_name');
      }
    });

    it('should include category for businesses', async () => {
      const response = await request(app).get('/api/search?q=Cafe');
      
      expect(response.status).toBe(200);
      const business = response.body.find(r => r.type === 'business');
      if (business) {
        expect(business).toHaveProperty('category');
      }
    });

    it('should return no more than limited results', async () => {
      // The search limits results to 25-50 per type
      const response = await request(app).get('/api/search?q=a');
      
      expect(response.status).toBe(200);
      // Just verify we got a valid response with reasonable limits
      expect(response.body.length).toBeLessThanOrEqual(175); // 25+50+50+50
    });

    it('should handle special characters in query', async () => {
      const response = await request(app).get('/api/search?q=test%20cafe');
      
      expect(response.status).toBe(200);
      // Should not error, may or may not find results
      expect(Array.isArray(response.body)).toBe(true);
    });
  });
});

