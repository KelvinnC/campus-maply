import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainMap from './Page/MainMap';
import Login from './Page/Login';
import EventManagerPage from './Page/EventManagerPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainMap />} />
        <Route path="/login" element={<Login />} />
        <Route path="/event-planner" element={<EventManagerPage/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

