import express from 'express';
import cors from 'cors';
import testDb from './testDb.js';

// Create a mock database module that uses testDb
const mockDatabase = {
  getDB: () => testDb.getDB(),
  init: () => testDb.init(),
  close: () => testDb.close(),
};

// We need to create route handlers that use the test database
// Import route files and inject the test database

function createTestApp() {
  const app = express();
  
  app.use(cors());
  app.use(express.json());

  // We'll create test-specific route handlers
  return app;
}

export { createTestApp, mockDatabase };
export default createTestApp;

