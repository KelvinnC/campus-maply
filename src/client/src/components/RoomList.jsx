import React from 'react';
import '../css/roomList.css';

const RoomList = ({ building, rooms, onClose }) => {
  if (!building) return null;

  return (
    <div className="room-list-panel">
      <div className="room-list-header">
        <h2>{building.name}</h2>
        <button className="close-button" onClick={onClose}>×</button>
      </div>
      <div className="room-list-content">
        {rooms.length === 0 ? (
          <p className="no-rooms">No rooms found for this building.</p>
        ) : (
          <ul className="rooms">
            {rooms.map((room) => (
              <li key={room.id} className="room-item">
                <span className="room-number">{room.room_number}</span>
                {room.room_type && <span className="room-type">{room.room_type}</span>}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default RoomList;
