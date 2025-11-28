import sqlite3 from 'sqlite3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const sqlite = sqlite3.verbose();

class TestDatabase {
  constructor() {
    this.db = null;
  }

  async init() {
    return new Promise((resolve, reject) => {
      // Use in-memory database for tests
      this.db = new sqlite.Database(':memory:', (err) => {
        if (err) {
          console.error('Error opening test database:', err);
          reject(err);
        } else {
          this.createTables()
            .then(() => this.seedData())
            .then(resolve)
            .catch(reject);
        }
      });
    });
  }

  async createTables() {
    return new Promise((resolve, reject) => {
      try {
        const schemaPath = path.join(__dirname, '../../../server/data/sql/schema.sql');
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');
        this.db.exec(schemaSql, (err) => {
          if (err) {
            console.error('Error creating test tables:', err);
            reject(err);
          } else {
            resolve();
          }
        });
      } catch (e) {
        console.error('Error reading schema file:', e);
        reject(e);
      }
    });
  }

  async seedData() {
    return new Promise((resolve, reject) => {
      const seedSql = `
        -- Test Users
        INSERT INTO users (email, password, status, name) VALUES
        ('admin@test.com', '$2a$10$a5gTcKsVZqkhomj35qbcCOFPYrmRLHWgguLN.5uuM1Y2EyakoXn46', 'ADMIN', 'Test Admin'),
        ('coordinator@test.com', '$2a$10$3lfROg136PvVCU3/4ruvBezWavd8C5G1znwNDNr.FP.xQME3.4kqW', 'EVENT_COORDINATOR', 'Test Coordinator'),
        ('faculty@test.com', '$2a$10$sjDGCAnUqe3ebtQ9XsNBXeQeICem530uTdhuSx4fU7eHiqpXPG/pq', 'FACULTY', 'Test Faculty'),
        ('visitor@test.com', '$2a$10$Wt7x17/GiNsLAlR/0mY6fO2uRt1drCok0O4rXhks/.KuD738Ky1fi', 'VISITOR', 'Test Visitor');

        -- Test Buildings
        INSERT INTO buildings (code, name, description, latitude, longitude) VALUES
        ('EME', 'Engineering Building', 'Engineering labs and classrooms', 49.93897757219247, -119.39452319234998),
        ('SCI', 'Science Building', 'Science labs and classrooms', 49.939937688493835, -119.39653667004586),
        ('ART', 'Arts Building', 'Arts Building', 49.9393520199701, -119.39705448468789),
        ('LIB', 'Library', 'Main campus library', 49.940043166688596, -119.39554523378702);

        -- Test Rooms
        INSERT INTO rooms (building_id, room_number, capacity, furniture, layout, room_type, notes) VALUES
        (1, '101', 50, 'Fixed Tables', 'Tiered Classroom', 'Formal Learning', 'Test room 1'),
        (1, '102', 30, 'Moveable Tables', 'Classroom', 'Formal Learning', 'Test room 2'),
        (2, '201', 40, 'Fixed Tables', 'Classroom', 'Formal Learning', 'Science classroom'),
        (3, '301', 25, 'Moveable Tables', 'Classroom', 'Informal Learning', 'Art studio');

        -- Test Washrooms
        INSERT INTO washrooms (building_id, room_number, description, accessibility, gender) VALUES
        (1, '100A', 'First floor washroom', 'Wheelchair accessible', 'All-gender'),
        (1, '100B', 'First floor washroom', 'Wheelchair accessible', 'Women'),
        (2, '200A', 'Second floor washroom', 'Wheelchair accessible', 'Men');

        -- Test Businesses
        INSERT INTO businesses (building_id, category, name, latitude, longitude, description, hours) VALUES
        (1, 'Restaurant', 'Test Cafe', 49.93874936594265, -119.39423985264531, 'Coffee and snacks', '9:00 AM - 5:00 PM'),
        (2, 'Retail', 'Campus Store', 49.939937688493835, -119.39653667004586, 'Supplies and books', '10:00 AM - 6:00 PM'),
        (4, 'Restaurant', 'Library Coffee', 49.940043166688596, -119.39554523378702, 'Quiet cafe', '8:00 AM - 8:00 PM');

        -- Test Parking Lots
        INSERT INTO parking_lots (name, latitude, longitude, description) VALUES
        ('Parking Lot A', 49.93652095340686, -119.39584710644999, 'Main parking'),
        ('Parking Lot B', 49.94010772980202, -119.39363365690801, 'Staff parking'),
        ('Parking Lot C', 49.941071254298535, -119.3946299929212, 'Visitor parking');

        -- Test Bus Stops
        INSERT INTO bus_stops (name, latitude, longitude, description) VALUES
        ('Main Stop', 49.93930378872279, -119.3949643467419, 'Bus #6 and #8');

        -- Test Events
        INSERT INTO events (title, description, building_id, latitude, longitude, start_time, end_time, created_by) VALUES
        ('Test Event 1', 'First test event', 1, 49.93897757219247, -119.39452319234998, '2025-12-01T10:00:00.000Z', '2025-12-01T11:00:00.000Z', 1),
        ('Test Event 2', 'Second test event', 2, 49.939937688493835, -119.39653667004586, '2025-12-02T14:00:00.000Z', '2025-12-02T16:00:00.000Z', 2);

        -- Test Room Bookings
        INSERT INTO room_bookings (room_id, event_id, start_time, end_time) VALUES
        (1, 1, '2025-12-01T10:00:00.000Z', '2025-12-01T11:00:00.000Z');
      `;

      this.db.exec(seedSql, (err) => {
        if (err) {
          console.error('Error seeding test data:', err);
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  async reset() {
    return new Promise((resolve, reject) => {
      const tables = [
        'room_bookings',
        'events',
        'washrooms',
        'rooms',
        'businesses',
        'parking_lots',
        'bus_stops',
        'buildings',
        'users'
      ];

      // Delete data and reset auto-increment counters
      const deleteSql = tables.map(t => `DELETE FROM ${t};`).join('\n');
      const resetSequenceSql = tables.map(t => `DELETE FROM sqlite_sequence WHERE name='${t}';`).join('\n');
      
      this.db.exec(deleteSql + '\n' + resetSequenceSql, async (err) => {
        if (err) {
          console.error('Error resetting test data:', err);
          reject(err);
        } else {
          try {
            await this.seedData();
            resolve();
          } catch (e) {
            reject(e);
          }
        }
      });
    });
  }

  getDB() {
    return this.db;
  }

  close() {
    if (this.db) {
      this.db.close();
    }
  }

  // Helper method for running queries
  all(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  get(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.get(sql, params, (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  run(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function(err) {
        if (err) reject(err);
        else resolve({ lastID: this.lastID, changes: this.changes });
      });
    });
  }
}

export default new TestDatabase();

