import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import SearchBox from './SearchBox.jsx';
import RoomList from './RoomList.jsx';

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

const parkingSvg = `
  <svg width="30" height="30" xmlns="http://www.w3.org/2000/svg">
    <rect width="30" height="30" rx="3" fill="#0066cc"/>
    <text x="15" y="22" font-family="Arial, sans-serif" font-size="20" font-weight="bold" fill="white" text-anchor="middle">P</text>
  </svg>
`;
const parkingSvgUrl = `data:image/svg+xml;base64,${btoa(parkingSvg)}`;

let ParkingIcon = L.icon({
  iconUrl: parkingSvgUrl,
  iconSize: [30, 30],
  iconAnchor: [15, 15],
  popupAnchor: [0, -15]
});
L.Marker.prototype.options.icon = DefaultIcon;

const Map = ({buildingFilter, parkingFilter}) => {
  const [buildings, setBuildings] = useState([]);
  const [parkingLots, setParkingLots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [washrooms, setWashrooms] = useState([]);
  const [businesses, setBusinesses] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
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

  const fetchBuildingData = async (buildingId) => {
    setLoadingData(true);
    try {
      // Fetch rooms, washrooms, and businesses in parallel
      const [roomsRes, washroomsRes, businessesRes] = await Promise.all([
        fetch(`/api/rooms?buildingId=${buildingId}`),
        fetch(`/api/washrooms?buildingId=${buildingId}`),
        fetch(`/api/businesses?buildingId=${buildingId}`)
      ]);

      if (roomsRes.ok) {
        const roomsData = await roomsRes.json();
        setRooms(roomsData);
      } else {
        setRooms([]);
      }

      if (washroomsRes.ok) {
        const washroomsData = await washroomsRes.json();
        setWashrooms(washroomsData);
      } else {
        setWashrooms([]);
      }

      if (businessesRes.ok) {
        const businessesData = await businessesRes.json();
        setBusinesses(businessesData);
      } else {
        setBusinesses([]);
      }
    } catch (err) {
      console.error('Error fetching building data:', err);
      setRooms([]);
      setWashrooms([]);
      setBusinesses([]);
    } finally {
      setLoadingData(false);
    }
  };

  const handleBuildingClick = (building) => {
    setSelectedBuilding(building);
    fetchBuildingData(building.id);
  };

  const handleCloseRoomList = () => {
    setSelectedBuilding(null);
    setRooms([]);
    setWashrooms([]);
    setBusinesses([]);
  };

  useEffect(() => {
    const fetchParkingLots = async () => {
      try {
        const response = await fetch('/api/parkinglots');
        if (!response.ok) {
          throw new Error('Failed to fetch parking lots');
        }
        const data = await response.json();
        setParkingLots(data);
      } catch (err) {
        console.error('Error fetching parking lots:', err);
        setError(err.message);
      }
    };
    fetchParkingLots();
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
        
        {buildingFilter && (buildings.map((building) => (
          <Marker 
            key={building.id} 
            position={[building.latitude, building.longitude]}
            ref={(ref) => { if (ref) markerRefs.current[building.id] = ref; }}
            eventHandlers={{
              click: () => handleBuildingClick(building)
            }}
          >
            <Popup>
              <div className="popup-content">
                <h3>{building.name}</h3>
                {building.description && <p>{building.description}</p>}
              </div>
            </Popup>
          </Marker>
        )))}

        {parkingFilter && (parkingLots.map((parking) => (
          <Marker 
            key={`parking-${parking.id}`}
            position={[parking.latitude, parking.longitude]}
            icon={ParkingIcon}
            ref={(ref) => { if (ref) markerRefs.current[`parking-${parking.id}`] = ref; }}
          >
            <Popup>
              <div className="popup-content">
                <h3>{parking.name}</h3>
                {parking.description && <p>{parking.description}</p>}
              </div>
            </Popup>
          </Marker>
        )))}
      </MapContainer>
      {selectedBuilding && rooms.length > 0 &&(
        <RoomList 
          building={selectedBuilding} 
          rooms={rooms}
          washrooms={washrooms}
          businesses={businesses}
          onClose={handleCloseRoomList} 
        />
      )}
    </div>
  );
};

export default Map;

