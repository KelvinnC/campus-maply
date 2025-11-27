import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import '../css/roomDetails.css';

const RoomDetails = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [building, setBuilding] = useState(null);
  const [availability, setAvailability] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  
  // State for availability check form
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    fetchRoomDetails();
  }, [roomId]);

  const fetchRoomDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/rooms/${roomId}`);
      
      if (!response.ok) {
        throw new Error('Room not found');
      }
      
      const roomData = await response.json();
      setRoom(roomData);
      
      // Fetch building information
      if (roomData.building_id) {
        const buildingResponse = await fetch(`/api/buildings/${roomData.building_id}`);
        if (buildingResponse.ok) {
          const buildingData = await buildingResponse.json();
          setBuilding(buildingData);
        }
      }
      
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const checkAvailability = async (e) => {
    e.preventDefault();
    
    if (!startDate || !endDate) {
      alert('Please select both start and end date/time');
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (end <= start) {
      alert('End time must be after start time');
      return;
    }

    try {
      setCheckingAvailability(true);
      const response = await fetch(
        `/api/rooms/${roomId}/availability?start=${start.toISOString()}&end=${end.toISOString()}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to check availability');
      }
      
      const data = await response.json();
      setAvailability(data);
    } catch (err) {
      alert('Error checking availability: ' + err.message);
    } finally {
      setCheckingAvailability(false);
    }
  };

  if (loading) {
    return (
      <div className="app">
        <NavBar />
        <div className="room-details-page">
          <div className="loading">Loading room details...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app">
        <NavBar />
        <div className="room-details-page">
          <div className="error">
            <h2>Error</h2>
            <p>{error}</p>
            <button onClick={() => navigate(-1)} className="back-button">
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <NavBar />
      <div className="room-details-page">
        <button onClick={() => navigate(-1)} className="back-button">
          ← Back
        </button>
        <h1>Room Details</h1>

        <div className="gridForRoomDetails">
          {/* Main Room Information */}
          <div className="room-info-section">
            <h2>{room.room_number}</h2>
            {building && (
              <p>
                Building: {building.name} ({building.code})
              </p>
            )}
            
            {room.capacity && <p>Capacity: {room.capacity} people</p>}
            {room.room_type && <p>Room Type: {room.room_type}</p>}
            {room.furniture && <p>Furniture: {room.furniture}</p>}
            {room.layout && <p>Layout: {room.layout}</p>}
            {room.notes && <p>Notes: {room.notes}</p>}
          </div>

          {/* Availability Checker */}
          <div className="availability-section">
            <h3>Check Availability</h3>
            <form onSubmit={checkAvailability} className="availability-form">
              <label htmlFor="start-date">Start Date & Time:</label>
              <input
                type="datetime-local"
                id="start-date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
              
              <label htmlFor="end-date">End Date & Time:</label>
              <input
                type="datetime-local"
                id="end-date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
              />
              
              <button type="submit" disabled={checkingAvailability}>
                {checkingAvailability ? 'Checking...' : 'Check Availability'}
              </button>
            </form>

            {/* Availability Results */}
            {availability && (
              <div className="availability-result">
                <strong>
                  {availability.available ? '✓ Room is Available' : '✗ Room is Not Available'}
                </strong>
                
                {!availability.available && availability.conflicts && availability.conflicts.length > 0 && (
                  <div>
                    <div style={{ marginTop: '10px' }}>Conflicts:</div>
                    {availability.conflicts.map((conflict, index) => (
                      <div key={index} style={{ marginTop: '10px' }}>
                        <div>{conflict.event_title || 'Booking'}</div>
                        <div>
                          {new Date(conflict.start_time).toLocaleString()} - {new Date(conflict.end_time).toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomDetails;

