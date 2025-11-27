# Technical Specifications

---

## Front-End

React will be used to build the interactive client-facing application. React's component architecture allows for a modular and responsive single-page application that operates across desktop and mobile browsers. The map interface will be rendered using the Leaflet JavaScript library (via a React integration such as `react-leaflet`) to display building, service, and event markers with pan and zoom functionality. HTML5 and CSS3 (possibly with a UI framework) will be used for layout and styling. The front-end will fetch building, room, event and booking data from the backend via RESTful API endpoints.

---

## Back-End

The back-end will be built with Node.js using JavaScript, leveraging the Express framework to handle HTTP requests. It will expose RESTful APIs for authentication, retrieving and managing data about buildings, rooms, events and bookings, and for performing booking operations. Role-based access control will enforce permissions for students and visitors, faculty and staff, administrators and event coordinators. The server will implement business rules such as conflict checking for room bookings and return data in JSON format to the client.

---

## Database

The application will use SQLite, a lightweight relational database. The schema will include tables for:

- **Buildings:** Identifiers, names, and geographic coordinates
- **Rooms:** References to buildings, names, capacities, and availability
- **Events:** Names, descriptions, dates, times, and locations
- **Bookings:** Links users to rooms with start and end times
- **Users/Roles:** User accounts and permission levels

SQLite is file-based and easy to deploy, which makes it appropriate for a prototype; it integrates seamlessly with Node.js via libraries such as `sqlite3`.

---

## API & Integration

The system will expose RESTful API endpoints via the Node.js/Express backend. These APIs will deliver and update data in JSON format, providing endpoints for buildings, rooms, events, bookings and user management. The React client will consume these APIs to populate the interactive map and perform operations such as searching, booking rooms and posting events. The Leaflet integration relies on the API to supply geographic coordinates for map markers. Authentication tokens (for example JWT) will secure requests, and appropriate CORS policies will allow cross-origin access from the front-end. Future enhancements may integrate external campus services or event feeds.

