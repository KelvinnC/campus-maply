import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import database from './data/database.js';
import buildingsRouter from './routes/buildings.js';
import parkinglotsRouter from './routes/parkinglots.js';
import roomsRouter from './routes/rooms.js';
import washroomsRouter from './routes/washrooms.js';
import businessesRouter from './routes/businesses.js';
import searchRouter from './routes/search.js';
import authRouter from './routes/auth.js';
import eventsRouter from './routes/events.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.use('/api/buildings', buildingsRouter);
app.use('/api/parkinglots', parkinglotsRouter);
app.use('/api/rooms', roomsRouter);
app.use('/api/washrooms', washroomsRouter);
app.use('/api/businesses', businessesRouter);
app.use('/api/search', searchRouter);
app.use('/api/auth', authRouter);
app.use('/api/events', eventsRouter);

async function startServer() {
  try {
    await database.init();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to initialize database:', error);
    process.exit(1);
  }
}

process.on('SIGINT', () => {
  database.close();
  process.exit(0);
});

startServer();

