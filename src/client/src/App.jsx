import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainMap from './Page/MainMap';
import Login from './Page/Login';
import EventManagerPage from './Page/EventManagerPage';
import RoomDetails from './Page/RoomDetails';
import SuoEvents from './Page/SuoEvents';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainMap />} />
        <Route path="/login" element={<Login />} />
        <Route path="/event-planner" element={<EventManagerPage/>}/>
        <Route path="/events" element={<SuoEvents />} />
        <Route path="/room/:roomId" element={<RoomDetails />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

