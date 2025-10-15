-- Users
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'VISITOR',
    name TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    CHECK(status IN ('VISITOR', 'EVENT_COORDINATOR', 'ADMIN', 'FACULTY'))
);

-- Buildings
CREATE TABLE IF NOT EXISTS buildings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    latitude REAL NOT NULL,
    longitude REAL NOT NULL,
    description TEXT
);

-- EventsI
CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    building_id INTEGER,
    latitude REAL,
    longitude REAL,
    start_time DATETIME,
    end_time DATETIME,
    created_by INTEGER,
    FOREIGN KEY (building_id) REFERENCES buildings(id),
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Washrooms
CREATE TABLE IF NOT EXISTS washrooms (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    latitude REAL NOT NULL,
    longitude REAL NOT NULL,
    description TEXT,
    accessibility TEXTI
);

-- Restaurants
CREATE TABLE IF NOT EXISTS restaurants (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    latitude REAL NOT NULL,
    longitude REAL NOT NULL,
    description TEXT,
    hours TEXT
);

-- Parking lots
CREATE TABLE IF NOT EXISTS parking_lots (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    latitude REAL NOT NULL,
    longitude REAL NOT NULL,
    description TEXT
);

-- Bus stops
CREATE TABLE IF NOT EXISTS bus_stops (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    latitude REAL NOT NULL,
    longitude REAL NOT NULL,
    description TEXT
);




