import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/roomList.css';
import EventList from './EventList';

  const RoomList = ({ building, rooms= [], washrooms = [], businesses = [], events, onClose }) => {
  console.log(building, rooms, washrooms, businesses)
  const navigate = useNavigate();
  const [showRooms, setShowRooms] = useState(true)

  function changeToOrFromRoom (){
    setShowRooms(!showRooms)
  }

  const handleRoomClick = (roomId) => {
    navigate(`/room/${roomId}`);
  }

  const hasData = rooms.length > 0 || washrooms.length > 0 || businesses.length > 0;

  return (
    <div className="room-list-panel">
      <div className="room-list-header">
        <div className='room-list-colum'>
          <h2>{building.name}</h2>
          <button onClick={changeToOrFromRoom}>
          {showRooms&&(<>View Events</>)}
          {!showRooms&&(<>View Rooms</>)}
          </button>
        </div>
        <button className="close-button" onClick={onClose}>×</button>
      </div>
      {!showRooms&&(<EventList building={building} events={events} onClose={onClose}/>)}
      {showRooms&&(<div className="room-list-content">
        {!hasData ? (
          <p className="no-data">No data available for this building.</p>
        ) : (
          <>
            {/* Rooms Section */}
            {rooms.length > 0 && (
              <div className="section">
                <h3 className="section-header">Rooms</h3>
                <ul className="items-list">
                  {rooms.map((room) => (
                    <li 
                      key={`room-${room.id}`} 
                      className="item room-item-clickable"
                      onClick={() => handleRoomClick(room.id)}
                    >
                      <span className="item-name">{room.room_number}</span>
                      {room.room_type && <span className="item-tag">{room.room_type}</span>}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Washrooms Section */}
            {washrooms.length > 0 && (
              <div className="section">
                <h3 className="section-header">Washrooms</h3>
                <ul className="items-list">
                  {washrooms.map((washroom) => (
                    <li key={`washroom-${washroom.id}`} className="item">
                      <span className="item-name">
                        {washroom.room_number || `Washroom ${washroom.id}`}
                      </span>
                      <div className="item-details">
                        {washroom.gender && <span className="item-tag">{washroom.gender}</span>}
                        {washroom.accessibility && <span className="item-tag">{washroom.accessibility}</span>}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Businesses Section */}
            {businesses.length > 0 && (
              <div className="section">
                <h3 className="section-header">Businesses</h3>
                <ul className="items-list">
                  {businesses.map((business) => (
                    <li key={`business-${business.id}`} className="item">
                      <span className="item-name">{business.name}</span>
                      <div className="item-details">
                        {business.category && <span className="item-tag">{business.category}</span>}
                        {business.hours && <span className="item-info">{business.hours}</span>}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
      </div>)}
    </div>
  );
};

export default RoomList;
