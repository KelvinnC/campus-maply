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
const { default: businessesRouter } = await import('../../server/routes/businesses.js');

// Create test app
const app = express();
app.use(express.json());
app.use('/api/businesses', businessesRouter);
app.use('/api/buildings/:buildingId/businesses', businessesRouter);

describe('Businesses API', () => {
  describe('GET /api/businesses', () => {
    it('should return all businesses', async () => {
      const response = await request(app).get('/api/businesses');
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(3);
    });

    it('should return businesses with correct properties', async () => {
      const response = await request(app).get('/api/businesses');
      
      expect(response.status).toBe(200);
      const business = response.body[0];
      expect(business).toHaveProperty('id');
      expect(business).toHaveProperty('building_id');
      expect(business).toHaveProperty('category');
      expect(business).toHaveProperty('name');
      expect(business).toHaveProperty('latitude');
      expect(business).toHaveProperty('longitude');
    });

    it('should filter businesses by building ID', async () => {
      const response = await request(app).get('/api/businesses?buildingId=1');
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(1);
      expect(response.body[0].building_id).toBe(1);
    });

    it('should filter businesses by category', async () => {
      const response = await request(app).get('/api/businesses?category=Restaurant');
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      response.body.forEach(business => {
        expect(business.category).toBe('Restaurant');
      });
    });

    it('should search businesses by query', async () => {
      const response = await request(app).get('/api/businesses?q=cafe');
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      // Should find "Test Cafe"
      expect(response.body.length).toBeGreaterThan(0);
    });

    it('should return empty array for non-matching query', async () => {
      const response = await request(app).get('/api/businesses?q=nonexistent');
      
      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });

    it('should return businesses sorted by name', async () => {
      const response = await request(app).get('/api/businesses');
      
      expect(response.status).toBe(200);
      const names = response.body.map(b => b.name);
      const sortedNames = [...names].sort();
      expect(names).toEqual(sortedNames);
    });
  });

  describe('GET /api/businesses/categories', () => {
    it('should return all unique categories', async () => {
      const response = await request(app).get('/api/businesses/categories');
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toContain('Restaurant');
      expect(response.body).toContain('Retail');
    });

    it('should filter categories by building ID', async () => {
      const response = await request(app).get('/api/businesses/categories?buildingId=1');
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      // Building 1 only has Restaurant category
      expect(response.body).toContain('Restaurant');
      expect(response.body).not.toContain('Retail');
    });

    it('should return categories sorted alphabetically', async () => {
      const response = await request(app).get('/api/businesses/categories');
      
      expect(response.status).toBe(200);
      const categories = response.body;
      const sortedCategories = [...categories].sort();
      expect(categories).toEqual(sortedCategories);
    });
  });

  describe('GET /api/businesses/:id', () => {
    it('should return a specific business by ID', async () => {
      const response = await request(app).get('/api/businesses/1');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', 1);
      expect(response.body).toHaveProperty('name', 'Test Cafe');
    });

    it('should return 404 for non-existent business', async () => {
      const response = await request(app).get('/api/businesses/999');
      
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Business not found');
    });

    it('should return business with all required fields', async () => {
      const response = await request(app).get('/api/businesses/1');
      
      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        id: 1,
        building_id: 1,
        category: 'Restaurant',
        name: 'Test Cafe',
        description: 'Coffee and snacks',
        hours: '9:00 AM - 5:00 PM',
      });
    });
  });

  describe('GET /api/buildings/:buildingId/businesses', () => {
    it('should return businesses for a specific building', async () => {
      const response = await request(app).get('/api/buildings/1/businesses');
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      response.body.forEach(business => {
        expect(business.building_id).toBe(1);
      });
    });

    it('should return empty array for building with no businesses', async () => {
      const response = await request(app).get('/api/buildings/3/businesses');
      
      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });
  });
});

