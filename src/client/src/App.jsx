import React from 'react';
import Map from './components/Map';

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>UBCO Interactive Campus Map</h1>
      </header>
      <main className="app-main">
        <Map />
      </main>
    </div>
  );
}

export default App;

