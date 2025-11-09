 -- Users
INSERT OR IGNORE INTO users (email, password, status, name) VALUES
('admin@ubco.ca', '$2a$10$a5gTcKsVZqkhomj35qbcCOFPYrmRLHWgguLN.5uuM1Y2EyakoXn46', 'ADMIN', 'Admin'), -- password: admin
('event_coordinator@ubco.ca', '$2a$10$3lfROg136PvVCU3/4ruvBezWavd8C5G1znwNDNr.FP.xQME3.4kqW', 'EVENT_COORDINATOR', 'Event Coordinator'), -- password: event_coordinator
('faculty@ubco.ca', '$2a$10$sjDGCAnUqe3ebtQ9XsNBXeQeICem530uTdhuSx4fU7eHiqpXPG/pq', 'FACULTY', 'Faculty'), -- password: faculty
('visitor@ubco.ca', '$2a$10$Wt7x17/GiNsLAlR/0mY6fO2uRt1drCok0O4rXhks/.KuD738Ky1fi', 'VISITOR', 'Visitor'); -- password: visitor
 

 -- Buildings

 -- Notes:
 -- Nechako Residence (NCH) is included though it is not an academic building, it includes businesses and study spaces
INSERT OR IGNORE INTO buildings (code, name, description, latitude, longitude) VALUES
('EME', 'Engineering Building', 'Engineering labs and classrooms', 49.93897757219247, -119.39452319234998), -- ID 1
('SCI', 'Science Building', 'Science labs and classrooms', 49.939937688493835, -119.39653667004586), -- ID 2
('ART', 'Arts Building', 'Arts Building', 49.9393520199701, -119.39705448468789), -- ID 3
('ADM', 'Administration Building', NULL, 49.93933659211864, -119.39579576725608), -- ID 4
('ASC', 'Arts and Sciences Centre', NULL, 49.94002725634241, -119.397954863283), -- ID 5
('CCS', 'Creative and Critical Studies Building', NULL, 49.93932456175566, -119.39853239394478), -- ID 6
('COM', 'The Commons', NULL, 49.94037641376071, -119.39533701970424), -- ID 7
('FIP', 'Fipke Centre for Innovative Research', NULL, 49.940629567014575, -119.39638276704424), -- ID 8
('GYM', 'Gymnasium', NULL, 49.93805143537089, -119.39757205971588), -- ID 9
('LIB', 'Library', NULL, 49.940043166688596, -119.39554523378702), -- ID 10
('RHS', 'Reichwald Health Sciences Centre', NULL, 49.93804214410787, -119.39956631561031), -- ID 11
('UNC', 'University Centre', NULL, 49.94123393487755, -119.39625425533593), -- ID 12
('UCH', 'Upper Campus Health Building', NULL, 49.94128946542811, -119.40018873218449), -- ID 13
('NCH', 'Nechako Residence', NULL, 49.94158431179825, -119.39602512080366), -- ID 14
('IP1', 'Innovation Precinct 1', 'Research space and offices', 49.94766314822474, -119.38975208638773), -- ID 15
('IPA', 'Innovation Precinct Annex 1', 'Research space and offices', 49.94759713088704, -119.38883329510875); -- ID 16


-- Rooms (formal and informal learning spaces)
INSERT OR IGNORE INTO rooms (building_id, room_number, capacity, furniture, layout, room_type, notes) VALUES
-- Admin Building (id = 4)
(4, '026', 200, 'Fixed Tablets', 'Tiered Classroom', 'Formal Learning', 'University Theater'),
(4, '100', 15, 'Mixed', NULL, 'Informal Learning', NULL),
(4, '121', 320, 'Fixed Tables', NULL, 'Informal Learning', NULL),

-- Arts Building (id = 3)
(3, '102', 40, 'Moveable Tables', 'Classroom', 'Formal Learning', NULL),
(3, '103', 121, 'Fixed Tablets', 'Tiered Classroom', 'Formal Learning', NULL),
(3, '104', 46, 'Moveable Tables', 'Classroom', 'Formal Learning', NULL),
(3, '106', 40, 'Moveable Tables', 'Classroom', 'Formal Learning', NULL),
(3, '108', 40, 'Moveable Tables', 'Classroom', 'Formal Learning', NULL),
(3, '110', 46, 'Moveable Tables', 'Classroom', 'Formal Learning', NULL),
(3, '112', 48, 'Moveable Tables', 'Classroom', 'Formal Learning', NULL),
(3, '114', 100, 'Fixed Tables', 'Tiered Classroom', 'Formal Learning', NULL),
(3, '123Z', 8, 'Mixed', NULL, 'Informal Learning', NULL),
(3, '139', 8, 'Mixed', NULL, 'Informal Learning', NULL),
(3, '169', 12, 'Fixed Tables', NULL, 'Informal Learning', NULL),
(3, '188', 45, 'Fixed Tables', NULL, 'Informal Learning', NULL),
(3, '190', 12, 'Fixed Tables', NULL, 'Informal Learning', NULL),
(3, '191', 36, 'Moveable Tables', NULL, 'Informal Learning', NULL),
(3, '200A', 27, 'Fixed Tables', NULL, 'Informal Learning', NULL),
(3, '200Z', 12, 'Fixed Tables', NULL, 'Informal Learning', NULL),
(3, '202', 48, 'Moveable Tables', 'Classroom', 'Formal Learning', NULL),
(3, '237', 12, 'Moveable Tables', NULL, 'Informal Learning', NULL),
(3, '251', 12, 'Moveable Tables', NULL, 'Informal Learning', NULL),
(3, '302Y', 10, 'Fixed Tables', NULL, 'Informal Learning', NULL),
(3, '364', 30, 'Fixed Tables', NULL, 'Informal Learning', NULL),

-- ASC (Arts & Sciences II) (id = 5)
(5, '111 112', 30, 'Moveable Tables', NULL, 'Informal Learning', NULL),
(5, '112', 58, 'Mixed', NULL, 'Informal Learning', NULL),
(5, '165A', 33, 'Fixed Tables', 'Classroom', 'Formal Learning', NULL),
(5, '230', 9, 'Fixed Tables', NULL, 'Informal Learning', NULL),
(5, '270Z', 10, 'Fixed Tables', NULL, 'Informal Learning', NULL),
(5, '377', 8, 'Fixed Tables', NULL, 'Informal Learning', NULL),
(5, '130', 114, 'Fixed Tables', 'Tiered Classroom', 'Formal Learning', NULL),
(5, '140', 302, 'Fixed Tables', 'Tiered Classroom', 'Formal Learning', NULL),

-- CCS (Creative & Critical Studies) (id = 6)
(6, '100T', 4, 'Fixed Tables', NULL, 'Informal Learning', NULL),
(6, '200T', 11, 'Fixed Tables', NULL, 'Informal Learning', NULL),

-- Commons (COM) (id = 7)
(7, '003', 185, 'Mixed', NULL, 'Informal Learning', NULL),
(7, '004', 16, 'Fixed Tables', NULL, 'Informal Learning', NULL),
(7, '102', 42, 'Mixed', NULL, 'Informal Learning', NULL),
(7, '104', 8, NULL, NULL, 'Informal Learning', NULL),
(7, '104T', 8, 'Fixed Tables', NULL, 'Informal Learning', NULL),
(7, '105', 62, 'Mixed', NULL, 'Informal Learning', NULL),
(7, '201', 400, 'Fixed Tables', 'Tiered Classroom', 'Formal Learning', NULL),
(7, '211', 15, 'Mixed', NULL, 'Informal Learning', NULL),
(7, '211Z', 70, 'Mixed', NULL, 'Informal Learning', NULL),
(7, '313', 50, 'Fixed Tables', NULL, 'Informal Learning', NULL),
(7, '315Z', 6, 'Mixed', NULL, 'Informal Learning', NULL),
(7, 'M203Z', 32, 'Mixed', NULL, 'Informal Learning', NULL),

-- EME Building (id = 1)
(1, '0050', 192, 'Fixed Tables', 'Tiered Classroom', 'Formal Learning', NULL),
(1, '0020', 70, 'Mixed', NULL, 'Informal Learning', NULL),
(1, '0200', 8, 'Moveable Tables', NULL, 'Informal Learning', NULL),
(1, '0252', 43, 'Mixed', NULL, 'Informal Learning', NULL),
(1, '1010', 12, 'Fixed Tables', NULL, 'Informal Learning', NULL),
(1, '1030', 46, 'Mixed', NULL, 'Informal Learning', NULL),
(1, '1040', 24, 'Mixed', NULL, 'Informal Learning', NULL),
(1, '1040A', 12, 'Fixed Tables', NULL, 'Informal Learning', NULL),
(1, '1101', 80, 'Fixed Tables', 'Tiered Classroom', 'Formal Learning', NULL),
(1, '1111', 30, 'Fixed Tables', NULL, 'Formal Learning', NULL),
(1, '1121', 72, 'Fixed Tables', 'Tiered Classroom', 'Formal Learning', NULL),
(1, '1151', 49, 'Fixed Tables', 'Tiered Classroom', 'Formal Learning', NULL),
(1, '1153', 48, 'Fixed Tables', 'Tiered Classroom', 'Formal Learning', NULL),
(1, '1202', 60, 'Moveable Tables', 'Classroom', 'Formal Learning', NULL),
(1, '2111', 60, 'Moveable Tables', 'Classroom', 'Formal Learning', NULL),
(1, '2141', 69, 'Moveable Tables', 'Classroom', 'Formal Learning', NULL),
(1, '2181', 50, 'Moveable Tables', 'Classroom', 'Formal Learning', NULL),
(1, '2202', 30, 'Moveable Tables', 'Classroom', 'Formal Learning', NULL),
(1, '2020', 56, 'Fixed Tables', NULL, 'Informal Learning', NULL),
(1, '2040', 7, 'Moveable Tables', NULL, 'Informal Learning', NULL),
(1, '2130', 33, 'Mixed', NULL, 'Informal Learning', NULL),
(1, '2190', 23, 'Fixed Tables', NULL, 'Informal Learning', NULL),
(1, '2240', 41, 'Mixed', NULL, 'Informal Learning', NULL),
(1, '2250', 2, NULL, NULL, 'Informal Learning', NULL),
(1, '3135', 15, 'Mixed', NULL, 'Informal Learning', NULL),
(1, '4120', 17, 'Mixed', NULL, 'Informal Learning', NULL),
(1, 'Main West Entrance', 28, 'Fixed Tables', NULL, 'Informal Learning', NULL),

-- Fipke Centre (FIP) (id = 8)
(8, '101', 76, 'Fixed Tables', NULL, 'Informal Learning', NULL),
(8, '114T', 16, 'Moveable Tables', NULL, 'Informal Learning', NULL),
(8, '121', 70, 'Moveable Tables', 'Classroom', 'Formal Learning', NULL),
(8, '124', 32, 'Moveable Tables', 'Classroom', 'Formal Learning', NULL),
(8, '138', 32, 'Moveable Tables', 'Classroom', 'Formal Learning', NULL),
(8, '139', 32, 'Moveable Tables', 'Classroom', 'Formal Learning', NULL),
(8, '140', 30, 'Moveable Tables', 'Classroom', 'Formal Learning', NULL),
(8, '204', 302, 'Fixed Tables', 'Tiered Classroom', 'Formal Learning', NULL),
(8, '228T', 43, 'Mixed', NULL, 'Informal Learning', NULL),
(8, '239', 30, 'Moveable Tables', 'Classroom', 'Formal Learning', NULL),
(8, '242Z', 4, 'Fixed Tables', NULL, 'Informal Learning', NULL),
(8, '250', 30, 'Moveable Tables', 'Classroom', 'Formal Learning', NULL),
(8, '338', 15, 'Mixed', NULL, 'Informal Learning', NULL),
(8, '220Z', 36, 'Mixed', NULL, 'Informal Learning', NULL),

-- Library (LIB) (id = 10)
(10, '102 Field Reading Room', 36, 'Fixed Tables', NULL, 'Informal Learning', NULL),
(10, '106', 154, 'Mixed', NULL, 'Informal Learning', NULL),
(10, '115 Gordon Reading Room', 38, 'Mixed', 'Meeting Room', 'Informal Learning', NULL),
(10, '121', 4, 'Fixed Tables', 'Meeting Room', 'Informal Learning', NULL),
(10, '122', 4, 'Fixed Tables', 'Meeting Room', 'Informal Learning', NULL),
(10, '125', 13, 'Fixed Tables', 'Meeting Room', 'Informal Learning', NULL),
(10, '206', 150, 'Mixed', NULL, 'Informal Learning', NULL),
(10, '237', 40, 'Fixed Tables', NULL, 'Informal Learning', NULL),
(10, '238', 4, 'Fixed Tables', 'Meeting Room', 'Informal Learning', NULL),
(10, '256', 20, 'Fixed Tables', 'Meeting Room', 'Informal Learning', NULL),
(10, '302', 10, 'Moveable Tables', NULL, 'Informal Learning', NULL),
(10, '303', 22, 'Moveable Tables', 'Classroom', 'Formal Learning', NULL),
(10, '305', 150, 'Moveable Tables', 'Classroom', 'Formal Learning', NULL),
(10, '306', 46, 'Moveable Tables', 'Classroom', 'Formal Learning', NULL),
(10, '312', 116, 'Fixed Tables', 'Tiered Classroom', 'Formal Learning', NULL),
(10, '317', 126, 'Fixed Tables', 'Tiered Classroom', 'Formal Learning', NULL),

-- RHS (id = 11)
(11, '257', 75, 'Fixed Tables', 'Tiered Classroom', 'Formal Learning', NULL),
(11, '260', 125, 'Fixed Tables', 'Tiered Classroom', 'Formal Learning', NULL),

-- Science Building (SCI) (id = 2)
(2, '200Z', 4, 'Fixed Tables', NULL, 'Informal Learning', NULL),
(2, '236', 32, 'Moveable Tables', 'Classroom', 'Formal Learning', NULL),
(2, '247', 81, 'Fixed Tables', 'Tiered Classroom', 'Formal Learning', NULL),
(2, '333', 109, 'Fixed Tables', 'Tiered Classroom', 'Formal Learning', NULL),
(2, '337', 104, 'Fixed Tables', 'Tiered Classroom', 'Formal Learning', NULL),
(2, '342', 12, 'Mixed', NULL, 'Informal Learning', NULL),

-- University Centre (UNC) (id = 12)
(12, '100', 157, 'Fixed Tables', NULL, 'Informal Learning', NULL),
(12, '220', 6, 'Fixed Tables', NULL, 'Informal Learning', NULL),
(12, '313Z', 12, 'Fixed Tables', NULL, 'Informal Learning', NULL),
(12, '335', 38, 'Mixed', NULL, 'Informal Learning', NULL),
(12, '336', 38, 'Mixed', NULL, 'Informal Learning', NULL);

-- Washrooms
-- Only accessible washrooms are seeded here. Non-accessible will not be included.

-- Accessibility and gender labels used in the data:
-- accessibility:
--   'Wheelchair accessible' — single-stall, wheelchair accessible (no gender info)
-- gender:
--   'All-gender', 'Women', 'Men', or 'Unspecified'

INSERT INTO washrooms (building_id, room_number, latitude, longitude, description, accessibility, gender) VALUES
-- Admin (id = 4)
(4, '005', NULL, NULL, NULL, 'Wheelchair accessible', 'All-gender'),
(4, '017', NULL, NULL, NULL, 'Wheelchair accessible', 'All-gender'),
(4, '111', NULL, NULL, NULL, 'Wheelchair accessible', 'All-gender'),

-- Arts Building (id = 3)
(3, '111', NULL, NULL, NULL, 'Wheelchair accessible', 'All-gender'),
(3, '126', NULL, NULL, NULL, 'Wheelchair accessible', 'All-gender'),
(3, '128', NULL, NULL, NULL, 'Wheelchair accessible', 'Women'),
(3, '211', NULL, NULL, NULL, 'Wheelchair accessible', 'All-gender'),
(3, '224', NULL, NULL, NULL, 'Wheelchair accessible', 'Men'),
(3, '226', NULL, NULL, NULL, 'Wheelchair accessible', 'Women'),
(3, '273', NULL, NULL, NULL, 'Wheelchair accessible', 'All-gender'),
(3, '373', NULL, NULL, NULL, 'Wheelchair accessible', 'All-gender'),

-- Arts and Sciences Centre (ASC) (id = 5)
(5, '121', NULL, NULL, NULL, 'Wheelchair accessible', 'All-gender'),
(5, '222', NULL, NULL, NULL, 'Wheelchair accessible', 'All-gender'),
(5, '223', NULL, NULL, NULL, 'Wheelchair accessible', 'All-gender'),
(5, '422', NULL, NULL, NULL, 'Wheelchair accessible', 'All-gender'),
(5, '423', NULL, NULL, NULL, 'Wheelchair accessible', 'All-gender'),

-- Creative & Critical Studies (CCS) (id = 6)
(6, '202', NULL, NULL, NULL, 'Wheelchair accessible', 'All-gender'),

-- Commons (COM) (id = 7)
(7, '009', NULL, NULL, NULL, 'Wheelchair accessible', 'All-gender'),
(7, '107', NULL, NULL, NULL, 'Wheelchair accessible', 'All-gender'),
(7, '108', NULL, NULL, NULL, 'Wheelchair accessible', 'All-gender'),
(7, '109', NULL, NULL, NULL, 'Wheelchair accessible', 'All-gender'),
(7, '207', NULL, NULL, NULL, 'Wheelchair accessible', 'All-gender'),
(7, '320', NULL, NULL, NULL, 'Wheelchair accessible', 'All-gender'),

-- EME Building (id = 1)
(1, '0223', NULL, NULL, NULL, 'Wheelchair accessible', 'Women'),
(1, '0225', NULL, NULL, NULL, 'Wheelchair accessible', 'Men'),
(1, '0253', NULL, NULL, NULL, 'Wheelchair accessible', 'All-gender'),
(1, '1154', NULL, NULL, NULL, 'Wheelchair accessible', 'All-gender'),
(1, '1215-2', NULL, NULL, NULL, 'Wheelchair accessible', 'Men'),
(1, '1219', NULL, NULL, NULL, 'Wheelchair accessible', 'Women'),
(1, '2225', NULL, NULL, NULL, 'Wheelchair accessible', 'Women'),
(1, '2227', NULL, NULL, NULL, 'Wheelchair accessible', 'Men'),
(1, '3128', NULL, NULL, NULL, 'Wheelchair accessible', 'All-gender'),
(1, '3146', NULL, NULL, NULL, 'Wheelchair accessible', 'All-gender'),
(1, '3236', NULL, NULL, NULL, 'Wheelchair accessible', 'Women'),
(1, '3236 B', NULL, NULL, NULL, 'Wheelchair accessible', 'Men'),
(1, '4216', NULL, NULL, NULL, 'Wheelchair accessible', 'Women'),
(1, '4218', NULL, NULL, NULL, 'Wheelchair accessible', 'Men'),
(1, '4234', NULL, NULL, NULL, 'Wheelchair accessible', 'Women'),
(1, '4236', NULL, NULL, NULL, 'Wheelchair accessible', 'Men'),
(1, '4144', NULL, NULL, NULL, 'Wheelchair accessible', 'All-gender'),

-- Fipke Centre (FIP) (id = 8)
(8, '117', NULL, NULL, NULL, 'Wheelchair accessible', 'All-gender'),
(8, '208', NULL, NULL, NULL, 'Wheelchair accessible', 'All-gender'),
(8, '234', NULL, NULL, NULL, 'Wheelchair accessible', 'All-gender'),
(8, '334', NULL, NULL, NULL, 'Wheelchair accessible', 'All-gender'),

-- Gym (GYM) (id = 9)
(9, '1st Floor', NULL, NULL, NULL, 'Wheelchair accessible', 'All-gender'),

-- Library (LIB) (id = 10)
(10, '232', NULL, NULL, NULL, 'Wheelchair accessible', 'All-gender'),
(10, '233', NULL, NULL, NULL, 'Wheelchair accessible', 'All-gender'),
(10, '314', NULL, NULL, NULL, 'Wheelchair accessible', 'All-gender'),
(10, '108', NULL, NULL, NULL, 'Wheelchair accessible', 'All-gender'),
(10, '209', NULL, NULL, NULL, 'Wheelchair accessible', 'All-gender'),

-- Science Building (SCI) (id = 2)
(2, '116', NULL, NULL, NULL, 'Wheelchair accessible', 'All-gender'),
(2, '225', NULL, NULL, NULL, 'Wheelchair accessible', 'All-gender'),
(2, '321', NULL, NULL, NULL, 'Wheelchair accessible', 'All-gender'),

-- University Centre (UNC) (id = 12)
(12, '135', NULL, NULL, NULL, 'Wheelchair accessible', 'All-gender'),
(12, '225', NULL, NULL, NULL, 'Wheelchair accessible', 'All-gender'),
(12, '312 N', NULL, NULL, NULL, 'Wheelchair accessible', 'All-gender'),

-- Upper Campus Health (UCH) (id = 13)
(13, '006', NULL, NULL, NULL, 'Wheelchair accessible', 'All-gender'),
(13, '007', NULL, NULL, NULL, 'Wheelchair accessible', 'All-gender');


-- Events
INSERT OR IGNORE INTO events (title, description, building_id, latitude, longitude, start_time, end_time, created_by) VALUES
('Engineering Orientation Day', 'Guided tour of EME Building', 1, 49.939116912933684, -119.39479874074324, '2025-09-22 10:00:00', '2025-09-22 11:00:00', 1);

-- Businesses
INSERT OR IGNORE INTO businesses (building_id, category, name, latitude, longitude, description, hours) VALUES
-- In Engineering Building (id = 1)
(1, 'Restaurant', 'Rocket Bistro', 49.93874936594265, -119.39423985264531, 'Coffee, sandwiches, and light meals', '9:00 AM - 3:00 PM, Weekdays'),

-- In Administration Building (id = 4)
(4, 'Restaurant', 'Sunshine Eatery', 49.93900630460963, -119.39591816879896, 'Coffee, sandwiches, and light meals', 'Temporarily Closed'),
(4, 'Retail', 'UBCO Bookstore', 49.93927638645953, -119.39573935569453, 'UBC branded clothing and supplies, tech items, gifts, snacks, decor, books and more.', '9:00 AM to 4:30 PM, Monday to Friday'),

-- In Library Building (id = 10)
(10, 'Restaurant', 'Tim Hortons', 49.93989419710717, -119.39578930315645, 'Coffee, sandwiches, and light meals', '7:30 AM - 5:00 PM, Weekdays'),

-- In Commons Building (id = 7)
(7, 'Restaurant', 'Comma Cafe', 49.94036900534359, -119.39546068495089, 'Coffee, sandwiches, and light meals', '8:00 AM - 7:00 PM, Weekdays'),

-- In Fipke Centre (id = 8)
(8, 'Restaurant', 'Starbucks', 49.940697944955296, -119.39686766568593, 'Coffee, sandwiches, and light meals', '7:30 AM - 6:00 PM, Weekdays'),

-- In Arts Building (id = 3)
(3, 'Restaurant', 'Spoon', 49.93916994252814, -119.39715027789832, 'Soups', '9:00 AM - 2:00 PM, Weekdays'),

-- University Centre (id = 12)
(12, 'Restaurant', 'Fusion Express', 49.94102897920256, -119.39588126942678, 'Asian Fusion Cuisine', '11:00 AM - 6:00 PM, Weekdays'),
(12, 'Restaurant', 'J''s Cafe Express', 49.94118723491363,-119.39611062153317, 'Cod, sandwiches, and light meals', '9:00 AM - 10:00 PM, Everyday except Sundays'),
(12, 'Restaurant', 'Koi Sushi', 49.94111787375924,-119.3961187830913, 'Sushi and Japanese Cuisine', '11:00 AM - 2:00 PM, Weekdays'),

-- Nechako Residence (id = 14)
(14, 'Restaurant', 'Pritchard Dining Hall', 49.941504898628004, -119.39568798734781, 'Breakfast,Lunch,Dinner All You Can Eat Buffet','7:00 AM - 10:00 PM, Everyday'),
(14, 'Retail', 'Orchard Convenience Store', 49.94186499909573, -119.39629218660767, 'A selection of ice-cream and treats, grab & go snacks, basic groceries and essentials like stationery, hygiene and health, and household supplies, and of course coffee.', '12:00 PM - 10:00 PM, Monday to Sunday');


-- Parking Lots
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
('Parking Lot W', 49.94158951992008, -119.3998785493951, 'Paid Parking'),
('Parking Lot IP1', 49.947665999743336, -119.3893671026305, 'Paid Parking');

-- Bus Stops
INSERT OR IGNORE INTO bus_stops (name, latitude, longitude, description) VALUES
('UBCO Exchange Bay A', 49.93930378872279, -119.3949643467419, 'Bus Stop for Bus #6 and #84'),
('UBCO Exchange Bay B', 49.93943477615109, -119.39407808093898, 'Bus Stop for Bus #8'),
('UBCO Exchange Bay D', 49.939361668768576, -119.39375300233179, 'Bus Stop for Bus #97 and #98'),    
('UBCO Exchange Bay C', 49.93929693381331, -119.39347941701496, 'Bus Stop for Bus #23'),
('UBCO Exchange Bay E', 49.94006785602514, -119.39426809409922, 'Bus Stop for Bus #13 and #90'),
('Bus Stop Just Outside campus', 49.93894595328127, -119.40201873573912, 'Bus Stop for Bus #6'),
('Bus Stop Just Outside campus', 49.937977915432256, -119.40121441156072, 'Bus Stop for Bus #6');


