INSERT INTO buildings (name, latitude, longitude, description) VALUES
('EME Building', 49.93897757219247, -119.39452319234998, 'Engineering labs and classrooms'),
('Science Building', 49.939937688493835, -119.39653667004586, 'Science labs and classrooms'),
('Arts Building', 49.9393520199701, -119.39705448468789, 'Arts Building');

INSERT INTO events (title, description, building_id, latitude, longitude, start_time, end_time, created_by) VALUES
('Engineering Orientation Day', 'Guided tour of Engineering Building', 1, 49.939116912933684, -119.39479874074324, '2025-09-22 10:00:00', '2025-09-22 11:00:00', 1);

INSERT INTO washrooms (name, latitude, longitude, description) VALUES
('Engineering Building Washrooms', 49.93884267140812, -119.3942891557199, 'Washroom Locations \n Floor 0: Left side.....');

INSERT INTO restaurants (name, latitude, longitude, description, hours) VALUES
('Rocket Cafe', 49.93874936594265, -119.39423985264531, 'Coffee, sandwiches, and light meals', '7:00 AM - 6:00 PM');

INSERT INTO parking_lots (name, latitude, longitude, description) VALUES
('Parking Lot E', 49.939828804241905, -119.39369367741897, 'Paid Parking');

INSERT INTO bus_stops (name, latitude, longitude, description) VALUES
('UBCO Exchange Bay B', 49.939531886817626, -119.39418170865663, 'Bus Stop for Bus #8');