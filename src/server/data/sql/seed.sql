INSERT OR IGNORE INTO buildings (name, latitude, longitude, description) VALUES
('EME Building', 49.93897757219247, -119.39452319234998, 'Engineering labs and classrooms'),
('Science Building', 49.939937688493835, -119.39653667004586, 'Science labs and classrooms'),
('Arts Building', 49.9393520199701, -119.39705448468789, 'Arts Building');

INSERT OR IGNORE INTO events (title, description, building_id, latitude, longitude, start_time, end_time, created_by) VALUES
('Engineering Orientation Day', 'Guided tour of EME Building', 1, 49.939116912933684, -119.39479874074324, '2025-09-22 10:00:00', '2025-09-22 11:00:00', 1);

INSERT OR IGNORE INTO washrooms (name, latitude, longitude, description) VALUES
('EME Building Washrooms', 49.93884267140812, -119.3942891557199, 'Washroom Locations \n Floor 0: Left side.....');

INSERT OR IGNORE INTO restaurants (name, latitude, longitude, description, hours) VALUES
('Rocket Bistro', 49.93874936594265, -119.39423985264531, 'Coffee, sandwiches, and light meals', '9:00 AM - 3:00 PM, Weekdays'),
('Sunshine Eatery', 49.93900630460963, -119.39591816879896, 'Coffee, sandwiches, and light meals', 'Temporarily Closed'),
('Tim Hortons', 49.93989419710717, -119.39578930315645, 'Coffee, sandwiches, and light meals', '7:30 AM - 5:00 PM, Weekdays'),
('Comma Cafe', 49.94036900534359, -119.39546068495089, 'Coffee, sandwiches, and light meals', '8:00 AM - 7:00 PM, Weekdays'),
('Starbucks', 49.940697944955296, -119.39686766568593, 'Coffee, sandwiches, and light meals', '7:30 AM - 6:00 PM, Weekdays'),
('Spoon', 49.93916994252814, -119.39715027789832, 'Soups', '9:00 AM - 2:00 PM, Weekdays'),
('Fusion Express', 49.94102897920256, -119.39588126942678, 'Asian Fusiuon Cousine', '11:00 AM - 6:00 PM, Weekdays'),
('Jays Cafe Express', 49.941087234913624, -119.39611062153317, 'Cod, sandwiches, and light meals', '9:00 AM - 10:00 PM, Everyday except Sundays'),
('Pritchard Dining Hall', 49.941504898628004, -119.39568798734781, 'Breakfast,Lunch,Dinner All You Can Eat Buffet','7:00 AM - 10:00 PM, Everyday');

INSERT OR IGNORE INTO parking_lots (name, latitude, longitude, description) VALUES
('Parking Lot B', 49.93652095340686, -119.39584710644999, 'Paid Parking'),
('Parking Lot E', 49.94010772980202, -119.39363365690801, 'Paid Parking'),
('Parking Lot F', 49.941071254298535, -119.3946299929212, 'Paid Parking'),
('Parking Lot G', 49.939836021626974, -119.39964135541209, 'Paid Parking'),
('Parking Lot H', 49.941994676262375, -119.3913813007157, 'Paid Parking'),
('Parking Lot I', 49.942273265920534, -119.39052209634546, 'Paid Parking'),
('Parking Lot J', 49.93744090746948, -119.39495501264005, 'Paid Parking'),
('Parking Lot K', 49.938096347801746, -119.40015269930888, 'Paid Parking'),
('Parking Lot M', 49.938441750890476, -119.39853339209296, 'Paid Parking'),
('Parking Lot R', 49.942946703085624, -119.39905533001382, 'Paid Parking'),
('Parking Lot S', 49.938603904670046, -119.39989533936459, 'Paid Parking'),
('UNC Short Term', 49.94080489515363, -119.3946793894299, 'Paid Parking'),
('Parking Lot W', 49.94158951992008, -119.3998785493951, 'Paid Parking');

INSERT OR IGNORE INTO bus_stops (name, latitude, longitude, description) VALUES
('UBCO Exchange Bay A', 49.93930378872279, -119.3949643467419, 'Bus Stop for Bus #6 and #84'),
('UBCO Exchange Bay B', 49.93943477615109, -119.39407808093898, 'Bus Stop for Bus #8'),
('UBCO Exchange Bay D', 49.939361668768576, -119.39375300233179, 'Bus Stop for Bus #97 and #98'),    
('UBCO Exchange Bay C', 49.93929693381331, -119.39347941701496, 'Bus Stop for Bus #23'),
('UBCO Exchange Bay E', 49.94006785602514, -119.39426809409922, 'Bus Stop for Bus #13 and #90'),
('Bus Stop Just Outside campus', 49.93894595328127, -119.40201873573912, 'Bus Stop for Bus #6'),
('Bus Stop Just Outside campus', 49.937977915432256, -119.40121441156072, 'Bus Stop for Bus #6');

INSERT OR IGNORE INTO users (email, password, status, name) VALUES
('admin@ubco.ca', '$2a$10$a5gTcKsVZqkhomj35qbcCOFPYrmRLHWgguLN.5uuM1Y2EyakoXn46', 'ADMIN', 'Admin'), -- password: admin
('event_coordinator@ubco.ca', '$2a$10$3lfROg136PvVCU3/4ruvBezWavd8C5G1znwNDNr.FP.xQME3.4kqW', 'EVENT_COORDINATOR', 'Event Coordinator'), -- password: event_coordinator
('faculty@ubco.ca', '$2a$10$sjDGCAnUqe3ebtQ9XsNBXeQeICem530uTdhuSx4fU7eHiqpXPG/pq', 'FACULTY', 'Faculty'), -- password: faculty
('visitor@ubco.ca', '$2a$10$Wt7x17/GiNsLAlR/0mY6fO2uRt1drCok0O4rXhks/.KuD738Ky1fi', 'VISITOR', 'Visitor'); -- password: visitor
