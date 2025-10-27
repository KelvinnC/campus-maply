import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import SearchBox from './SearchBox.jsx';

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
  const mapRef = useRef(null);
  const markerRefs = useRef({});

  // UBCO coordinates
  const ubcoCenter = [49.940228741743574, -119.39708442485471];
  const zoomLevel = 18;

  // fetch the building locations
  useEffect(() => {
    const fetchBuildings = async () => {
      try {
        const response = await fetch('/api/buildings');
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

  const handleSelect = (item) => {
    // Pan to and open popup if available
    const latlng = [item.latitude, item.longitude];
    if (mapRef.current && latlng[0] && latlng[1]) {
      mapRef.current.setView(latlng, 18, { animate: true });
    }
    const buildingId = item.type === 'building' ? item.id : item.building_id;
    const marker = markerRefs.current[buildingId];
    if (marker && marker.openPopup) {
      marker.openPopup();
    }
  };

  return (
    <div className="map-container">
      <div className="map-overlay">
        <SearchBox onSelect={handleSelect} />
      </div>
      <MapContainer 
        center={ubcoCenter} 
        zoom={zoomLevel} 
        style={{ height: '100%', width: '100%' }}
        whenCreated={(map) => { mapRef.current = map; }}
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
            ref={(ref) => { if (ref) markerRefs.current[building.id] = ref; }}
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

