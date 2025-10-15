# Setting up the project

Simply run from the `src` directory:

```bash
cd src
npm install    # Install client and server dependencies
npm run dev    # Start the front and backend
```

The frontend will run on http://localhost:4001
The backend will run on http://localhost:4000

# Development

- Frontend hot reloading is enabled via Vite
- Backend auto-restart is enabled via Node.js --watch flag
- API requests from frontend are proxied to backend at `/api`
- Both servers run concurrently with a single command

## Tech Stack

- **Frontend**: React 18 with Vite dev server
- **Backend**: Node.js with Express
- **Database**: SQLite
- **Map Library**: Leaflet with react-leaflet
- **Authentication**: Status-based (VISITOR, EVENT_COORDINATOR, ADMIN, FACULTY)

## Backend API Documentation

API endpoints will be located in `src/server/routes`.

### Buildings API

**Base URL**: `http://localhost:4000/api/buildings`

#### GET /api/buildings
Fetch all buildings from the database.

**Response:**
```json
[
  {
    "id": 1,
    "name": "Engineering Building",
    "latitude": 49.93897757219247,
    "longitude": -119.39452319234998,
    "description": "Engineering labs and classrooms"
  }
]
```

#### GET /api/buildings/:id
Fetch a specific building by ID.

**Response:**
```json
{
  "id": 1,
  "name": "Engineering Building",
  "latitude": 49.93897757219247,
  "longitude": -119.39452319234998,
  "description": "Engineering labs and classrooms"
}
```

### Frontend Usage Example

```javascript
// fetch all buildings
const fetchBuildings = async () => {
  try {
    const response = await fetch('http://localhost:4000/api/buildings');
    const buildings = await response.json();
    console.log(buildings);
  } catch (error) {
    console.error('Error fetching buildings:', error);
  }
};

// fetch specific building
const fetchBuilding = async (id) => {
  try {
    const response = await fetch(`http://localhost:4000/api/buildings/${id}`);
    const building = await response.json();
    console.log(building);
  } catch (error) {
    console.error('Error fetching building:', error);
  }
};
```
