import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import SearchBox from './SearchBox.jsx';
import Filters from './Filters.jsx';
import RoomList from './RoomList.jsx';

const UBCO_CENTER = [49.940228741743574, -119.39708442485471];
const DEFAULT_ZOOM = 18;

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

const PanTo = ({ target, zoom = 18, onDone }) => {
  const map = useMap();
  useEffect(() => {
    if (!map || !target || !Number.isFinite(target.lat) || !Number.isFinite(target.lng)) return;
    const z = Math.max(map.getZoom() || 0, zoom);
    if (map.stop) map.stop();
    if (map.flyTo) map.flyTo(target, z, { animate: true, duration: 0.75, easeLinearity: 0.25 });
    else map.setView(target, z, { animate: true });
    const handler = () => {
      map.off('moveend', handler);
      onDone && onDone();
    };
    map.on('moveend', handler);
    const t = setTimeout(() => onDone && onDone(), 1500);
    return () => {
      map.off('moveend', handler);
      clearTimeout(t);
    };
  }, [map, target?.lat, target?.lng, zoom]);
  return null;
};

const Map = ({
  buildingEnabled,
  parkingEnabled,
  businessEnabled,
  onBuildingChange,
  onParkingChange,
  onBusinessChange
}) => {
  const [buildings, setBuildings] = useState([]);
  const [parkingLots, setParkingLots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [washrooms, setWashrooms] = useState([]);
  const [businesses, setBusinesses] = useState([]);
  const [allBusinesses, setAllBusinesses] = useState([]);
  const [bizCategories, setBizCategories] = useState([]);
  const [selectedBizCategories, setSelectedBizCategories] = useState(new Set());
  const [events, setEvents] = useState([])
  const [loadingData, setLoadingData] = useState(false);
  const mapRef = useRef(null);
  const markerRefs = useRef({});
  const [panTarget, setPanTarget] = useState(null);
  const panDoneRef = useRef(null);

  // UBCO coordinates

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
      const [roomsRes, washroomsRes, businessesRes, eventsRes] = await Promise.all([
        fetch(`/api/rooms?buildingId=${buildingId}`),
        fetch(`/api/washrooms?buildingId=${buildingId}`),
        fetch(`/api/businesses?buildingId=${buildingId}`),
        fetch(`/api/events/get/${buildingId}`)
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
      if (eventsRes.ok) {
        const eventsData = await eventsRes.json();
        setEvents(eventsData);
      } else {
        setEvents([]);
      }
    } catch (err) {
      console.error('Error fetching building data:', err);
      setRooms([]);
      setWashrooms([]);
      setBusinesses([]);
      setEvents([]);
    } finally {
      setLoadingData(false);
    }
  };

  const handleBuildingClick = (building) => {
    try {
      const target = L.latLng(Number(building.latitude), Number(building.longitude));
      panDoneRef.current = () => {
        const m = markerRefs.current[building.id];
        if (m && m.openPopup) m.openPopup();
      };
      setPanTarget(target);
    } catch {}
    setSelectedBuilding(building);
    fetchBuildingData(building.id);
  };

  const handleCloseRoomList = () => {
    setSelectedBuilding(null);
    setRooms([]);
    setWashrooms([]);
    setBusinesses([]);
    setEvents([]);
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

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const response = await fetch('/api/businesses');
        if (!response.ok) {
          throw new Error('Failed to fetch businesses');
        }
        const data = await response.json();
        setAllBusinesses(data);
      } catch (err) {
        console.error('Error fetching businesses:', err);
      }
    };
    fetchBusinesses();
  }, []);

  // fetch business categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const resp = await fetch('/api/businesses/categories');
        if (!resp.ok) throw new Error('Failed to fetch categories');
        const cats = await resp.json();
        setBizCategories(cats);
        setSelectedBizCategories(new Set(cats));
      } catch (e) {
        console.error('Error fetching business categories:', e);
      }
    };
    fetchCategories();
  }, []);


  const handleSelect = (item) => {
    let markerKey;
    if (item.type === 'building') markerKey = item.id;
    else if (item.type === 'room') markerKey = item.building_id;
    else if (item.type === 'business') markerKey = `business-${item.id}`;
    else if (item.type === 'parking') markerKey = `parking-${item.id}`;

    const marker = markerRefs.current[markerKey];

    let target = null;
    if (item) {
      const lat = Number(item.latitude);
      const lng = Number(item.longitude);
      if (Number.isFinite(lat) && Number.isFinite(lng)) {
        if (item.type === 'business') {
          const idNum = Number(item.id) || 1;
          const dx = (idNum % 2 ? 1 : -1) * 0.00006;
          const dy = (Math.floor(idNum / 2) % 2 ? 1 : -1) * 0.00004;
          target = L.latLng(lat + dy, lng + dx);
        } else {
          target = L.latLng(lat, lng);
        }
      }
    }

    if (target) {
      // Debug -- ignore
      try { console.log('[Map] handleSelect', { item, markerKey, target: target && target.toString() }); } catch {}

      panDoneRef.current = () => {
        try { console.log('[Map] opening popup for', markerKey); } catch {}
        if (marker && marker.openPopup) marker.openPopup();
      };
      setPanTarget(target);
    } else if (marker && marker.openPopup) {
      try { console.log('[Map] no target, opening popup only for', markerKey); } catch {}
    marker.openPopup();
    } else {
      try { console.log('[Map] handleSelect: no target computed and no marker found', { item }); } catch {}
    }
  };

  // business icons
  //   def icon - circle
  const bizDefaultSvg = `
    <svg width="28" height="28" xmlns="http://www.w3.org/2000/svg">
      <circle cx="14" cy="14" r="13" fill="#2e7d32" />
    </svg>
  `;
  // food icon
  const bizFoodSvg = `
    <svg width="28" height="28" xmlns="http://www.w3.org/2000/svg">
      <circle cx="14" cy="14" r="13" fill="#ef6c00" />
      <rect x="13" y="6" width="2" height="10" fill="#ffffff" />
      <rect x="11" y="6" width="6" height="2" fill="#ffffff" />
      <rect x="11" y="8" width="1.4" height="2.4" fill="#ffffff" />
      <rect x="13.3" y="8" width="1.4" height="2.4" fill="#ffffff" />
      <rect x="15.6" y="8" width="1.4" height="2.4" fill="#ffffff" />
    </svg>
  `;
  // store icon
  const bizStoreSvg = `
    <svg width="28" height="28" xmlns="http://www.w3.org/2000/svg">
      <circle cx="14" cy="14" r="13" fill="#D62400" />
      <!-- building body -->
      <rect x="7" y="9" width="14" height="11" rx="1.6" fill="#ffffff" />
      <!-- door -->
      <rect x="12.4" y="14.4" width="3.2" height="5.6" fill="#D62400" />
    </svg>
  `;
  const bizDefaultUrl = `data:image/svg+xml;base64,${btoa(bizDefaultSvg)}`;
  const bizFoodUrl = `data:image/svg+xml;base64,${btoa(bizFoodSvg)}`;
  const bizStoreUrl = `data:image/svg+xml;base64,${btoa(bizStoreSvg)}`;

  const DefaultBizIcon = L.icon({ iconUrl: bizDefaultUrl, iconSize: [28,28], iconAnchor: [14,14], popupAnchor: [0,-14] });
  const FoodBizIcon = L.icon({ iconUrl: bizFoodUrl, iconSize: [28,28], iconAnchor: [14,14], popupAnchor: [0,-14] });
  const StoreBizIcon = L.icon({ iconUrl: bizStoreUrl, iconSize: [28,28], iconAnchor: [14,14], popupAnchor: [0,-14] });

  const getBusinessIcon = (biz) => {
    const cat = (biz.category || '').toLowerCase();
    if (cat.includes('food') || cat.includes('rest') || cat.includes('dining') || cat.includes('cafe') || cat.includes('coffee')) return FoodBizIcon;
    if (cat.includes('retail') || cat.includes('store') || cat.includes('shop') || cat.includes('market')) return StoreBizIcon;
    return DefaultBizIcon;
  };

  const offsetBusiness = (biz) => {
    const id = Number(biz.id) || 1;
    const dx = (id % 2 ? 1 : -1) * 0.00006; // ~6m east/west
    const dy = (Math.floor(id / 2) % 2 ? 1 : -1) * 0.00004; // ~4m north/south
    const lat = Number(biz.latitude);
    const lng = Number(biz.longitude);
    return [lat + dy, lng + dx];
  };
  return (
    <div className="map-container">
      <div className="map-overlay">
        <div className="overlay-bar">
          <SearchBox onSelect={handleSelect} />
          <Filters
            buildingEnabled={buildingEnabled}
            parkingEnabled={parkingEnabled}
            businessEnabled={businessEnabled}
            categories={bizCategories}
            selectedCategories={[...selectedBizCategories]}
            onBuildingChange={onBuildingChange}
            onParkingChange={onParkingChange}
            onBusinessChange={onBusinessChange}
            onCategoryToggle={(cat, checked) => {
              setSelectedBizCategories(prev => {
                const next = new Set(prev);
                if (checked) next.add(cat); else next.delete(cat);
                return next;
              });
            }}
          />
        </div>
      </div>
      <MapContainer 
        center={UBCO_CENTER} 
        zoom={DEFAULT_ZOOM} 
        style={{ height: '100%', width: '100%' }}
        whenCreated={(map) => { mapRef.current = map; }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.esri.com/">Esri</a>'
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          maxZoom={19}
        />
        <PanTo target={panTarget} zoom={18} onDone={() => { if (panDoneRef.current) panDoneRef.current(); }} />
        
        {buildingEnabled && (buildings.map((building) => (
          <Marker 
            key={building.id} 
            position={[Number(building.latitude), Number(building.longitude)]}
            ref={(ref) => { if (ref) markerRefs.current[building.id] = ref; }}
            eventHandlers={{
              click: () => handleBuildingClick(building)
            }}
          >
            <Popup autoPan={false}>
              <div className="popup-content">
                <h3>{building.name}</h3>
                {building.description && <p>{building.description}</p>}
              </div>
            </Popup>
          </Marker>
        )))}

        {parkingEnabled && (parkingLots.map((parking) => (
          <Marker 
            key={`parking-${parking.id}`}
            position={[Number(parking.latitude), Number(parking.longitude)]}
            icon={ParkingIcon}
            ref={(ref) => { if (ref) markerRefs.current[`parking-${parking.id}`] = ref; }}
            eventHandlers={{
              click: () => {
                const lat = Number(parking.latitude);
                const lng = Number(parking.longitude);
                if (Number.isFinite(lat) && Number.isFinite(lng)) {
                  panDoneRef.current = () => {
                    const m = markerRefs.current[`parking-${parking.id}`];
                    if (m && m.openPopup) m.openPopup();
                  };
                  setPanTarget(L.latLng(lat, lng));
                }
              }
            }}
          >
            <Popup autoPan={false}>
              <div className="popup-content">
                <h3>{parking.name}</h3>
                {parking.description && <p>{parking.description}</p>}
              </div>
            </Popup>
          </Marker>
        )))}

        {businessEnabled && (allBusinesses
          .filter((biz) => selectedBizCategories.size === 0 || selectedBizCategories.has(biz.category))
          .map((biz) => (
          <Marker
            key={`business-${biz.id}`}
            position={offsetBusiness(biz)}
            icon={getBusinessIcon(biz)}
            ref={(ref) => { if (ref) markerRefs.current[`business-${biz.id}`] = ref; }}
            eventHandlers={{
              click: () => {
                const [lat, lng] = offsetBusiness(biz);
                if (Number.isFinite(lat) && Number.isFinite(lng)) {
                  panDoneRef.current = () => {
                    const m = markerRefs.current[`business-${biz.id}`];
                    if (m && m.openPopup) m.openPopup();
                  };
                  setPanTarget(L.latLng(lat, lng));
                }
              }
            }}
          >
            <Popup autoPan={false}>
              <div className="popup-content">
                <h3>{biz.name}</h3>
                {biz.category && <p className="secondary">{biz.category}</p>}
                {biz.description && <p>{biz.description}</p>}
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
          events={events}
          onClose={handleCloseRoomList} 
        />
      )}
    </div>
  );
};

export default Map;

