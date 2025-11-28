import { describe, it, expect, vi, beforeAll } from 'vitest';
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
const { default: buildingsRouter } = await import('../routes/buildings.js');

// Create test app
const app = express();
app.use(express.json());
app.use('/api/buildings', buildingsRouter);

describe('Buildings API', () => {
  describe('GET /api/buildings', () => {
    it('should return all buildings', async () => {
      const response = await request(app).get('/api/buildings');
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(4);
    });

    it('should return buildings with correct properties', async () => {
      const response = await request(app).get('/api/buildings');
      
      expect(response.status).toBe(200);
      const building = response.body[0];
      expect(building).toHaveProperty('id');
      expect(building).toHaveProperty('code');
      expect(building).toHaveProperty('name');
      expect(building).toHaveProperty('latitude');
      expect(building).toHaveProperty('longitude');
    });

    it('should include expected building codes', async () => {
      const response = await request(app).get('/api/buildings');
      
      const codes = response.body.map(b => b.code);
      expect(codes).toContain('EME');
      expect(codes).toContain('SCI');
      expect(codes).toContain('ART');
      expect(codes).toContain('LIB');
    });
  });

  describe('GET /api/buildings/:id', () => {
    it('should return a specific building by ID', async () => {
      const response = await request(app).get('/api/buildings/1');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', 1);
      expect(response.body).toHaveProperty('code', 'EME');
      expect(response.body).toHaveProperty('name', 'Engineering Building');
    });

    it('should return 404 for non-existent building', async () => {
      const response = await request(app).get('/api/buildings/999');
      
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Building not found');
    });

    it('should return building with all required fields', async () => {
      const response = await request(app).get('/api/buildings/2');
      
      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        id: 2,
        code: 'SCI',
        name: 'Science Building',
        description: 'Science labs and classrooms',
      });
      expect(typeof response.body.latitude).toBe('number');
      expect(typeof response.body.longitude).toBe('number');
    });
  });
});

