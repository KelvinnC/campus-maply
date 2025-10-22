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
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    latitude REAL NOT NULL,
    longitude REAL NOT NULL
);

-- Events
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
    building_id INTEGER NOT NULL,
    room_number TEXT,
    latitude REAL,        -- leave blank for now
    longitude REAL,       -- leave blank for now
    description TEXT,
    accessibility TEXT,   -- e.g. W, WAG, WW, WM
    gender TEXT,          -- e.g. All Gender, Women, Men, etc.
    FOREIGN KEY (building_id) REFERENCES buildings(id)
);


-- Rooms
CREATE TABLE IF NOT EXISTS rooms (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    building_id INTEGER,
    room_number TEXT NOT NULL,
    capacity INTEGER NOT NULL,
    furniture TEXT,
    layout TEXT,
    room_type TEXT,
    notes TEXT,
    FOREIGN KEY (building_id) REFERENCES buildings(id)
);

-- Businesses
CREATE TABLE IF NOT EXISTS businesses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    building_id INTEGER NOT NULL, 
    category TEXT NOT NULL, -- e.g. Restaurant, Retail
    name TEXT NOT NULL,
    latitude REAL NOT NULL,
    longitude REAL NOT NULL,
    description TEXT,
    hours TEXT,
    FOREIGN KEY (building_id) REFERENCES buildings(id)
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




