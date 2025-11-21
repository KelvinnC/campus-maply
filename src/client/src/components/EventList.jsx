

export default function EventList({building, events, onClose}){
    console.log(events)
      const hasData = events !== undefined && events.length > 0;
      return (
    <div>
      <div className="room-list-content">
        {!hasData ? (
          <p className="no-data">No data available for this building.</p>
        ) : (
          <>
            {/* Events Section */}
            {hasData && (
              <div className="section">
                <h3 className="section-header">Events</h3>
                <ul className="items-list">
                  {events.map((event) => (
                    <li key={`event-${event.id}`} className="item">
                        <span className="item-name">{event.title}</span>
                        <span className="item-tag">Room Number: {event.room_number}</span>
                        <span className="item-tag">Date: {new Date(event.start_time).toLocaleString("en-US", {weekday: "short", year: "numeric", month: "short", day: "numeric"})}</span>
                        <span className="item-tag">Start Time: {new Date(event.start_time).toLocaleString("en-US", {hour: "2-digit", minute: "2-digit", hour12: true})}</span>
                        <span className="item-tag">End Time: {new Date(event.end_time).toLocaleString("en-US", {hour: "2-digit", minute: "2-digit", hour12: true})}</span>
                        <span className="item-tag">Description: {event.description}</span>

                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}