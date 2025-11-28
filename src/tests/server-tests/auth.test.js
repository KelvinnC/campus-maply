import { describe, it, expect, vi, beforeEach } from 'vitest';
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
const { default: authRouter } = await import('../../server/routes/auth.js');

// Create test app
const app = express();
app.use(express.json());
app.use('/api/auth', authRouter);

describe('Auth API', () => {
  describe('POST /api/auth/login', () => {
    it('should login successfully with valid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'admin@test.com',
          password: 'admin',
        });
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toHaveProperty('email', 'admin@test.com');
      expect(response.body.user).toHaveProperty('status', 'ADMIN');
    });

    it('should fail login with invalid password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'admin@test.com',
          password: 'wrongpassword',
        });
      
      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message', 'Invalid email or password');
    });

    it('should fail login with non-existent email', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@test.com',
          password: 'password',
        });
      
      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('success', false);
    });

    it('should fail login with missing email', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          password: 'password',
        });
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message', 'Email and password are required');
    });

    it('should fail login with missing password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'admin@test.com',
        });
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
    });

    it('should return user with correct role for different user types', async () => {
      // Test coordinator login
      const coordResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'coordinator@test.com',
          password: 'event_coordinator',
        });
      
      expect(coordResponse.status).toBe(200);
      expect(coordResponse.body.user.status).toBe('EVENT_COORDINATOR');

      // Test faculty login
      const facultyResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'faculty@test.com',
          password: 'faculty',
        });
      
      expect(facultyResponse.status).toBe(200);
      expect(facultyResponse.body.user.status).toBe('FACULTY');
    });
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'newuser@test.com',
          password: 'password123',
          name: 'New User',
        });
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toHaveProperty('email', 'newuser@test.com');
      expect(response.body.user).toHaveProperty('status', 'VISITOR');
    });

    it('should fail registration with existing email', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'admin@test.com',
          password: 'password123',
          name: 'Duplicate User',
        });
      
      expect(response.status).toBe(409);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message', 'Email already registered');
    });

    it('should fail registration with missing required fields', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'incomplete@test.com',
        });
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
    });

    it('should fail registration with invalid email format', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'invalidemail',
          password: 'password123',
          name: 'Invalid Email User',
        });
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message', 'Invalid email format');
    });

    it('should fail registration with short password', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'shortpass@test.com',
          password: '12345',
          name: 'Short Password User',
        });
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message', 'Password must be at least 6 characters long');
    });

    it('should allow login after registration', async () => {
      // Register a new user
      await request(app)
        .post('/api/auth/register')
        .send({
          email: 'logintest@test.com',
          password: 'testpassword',
          name: 'Login Test User',
        });
      
      // Try to login with the new user
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'logintest@test.com',
          password: 'testpassword',
        });
      
      expect(loginResponse.status).toBe(200);
      expect(loginResponse.body).toHaveProperty('success', true);
    });
  });
});

