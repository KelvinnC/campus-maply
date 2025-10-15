import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// marker icons to be changed
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const Map = () => {
  const [buildings, setBuildings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // UBCO coordinates
  const ubcoCenter = [49.940228741743574, -119.39708442485471];
  const zoomLevel = 18;

  // fetch the building locations
  useEffect(() => {
    const fetchBuildings = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/buildings');
        if (!response.ok) {
          throw new Error('Failed to fetch buildings');
        }
        const data = await response.json();
        setBuildings(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching buildings:', err);
        setError(err.message);
        setLoading(false);
      }
    };
    fetchBuildings();
  }, []);

  return (
    <div className="map-container">
      <MapContainer 
        center={ubcoCenter} 
        zoom={zoomLevel} 
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.esri.com/">Esri</a>'
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          maxZoom={19}
        />
        
        {buildings.map((building) => (
          <Marker 
            key={building.id} 
            position={[building.latitude, building.longitude]}
          >
            <Popup>
              <div className="popup-content">
                <h3>{building.name}</h3>
                {building.description && <p>{building.description}</p>}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default Map;

