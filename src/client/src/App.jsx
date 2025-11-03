import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainMap from './Page/MainMap';
import Login from './Page/Login';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainMap />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

