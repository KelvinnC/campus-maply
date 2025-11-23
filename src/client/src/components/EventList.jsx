import { useState } from "react";


export default function EventList({building, events, onClose}){
    const [expandedView, setExpandedView] = useState();
    const hasData = events !== undefined && events.length > 0;
    function changeExpandedView (id){
      if(expandedView === id){
        setExpandedView(undefined)
        return
      }
      setExpandedView(id)
    }
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
                    <li key={`event-${event.id}`} className="item" onClick={e=>changeExpandedView(event.id)} style={{cursor: "pointer"}}>
                        <span className="item-name" onClick={e=>changeExpandedView(event.id)} style={{cursor: "pointer"}}>{event.title}</span>
                        <span className="item-tag" onClick={e=>changeExpandedView(event.id)} style={{cursor: "pointer"}}>Room Number: {event.room_number}</span>
                        {event.id!==expandedView&& <span className="item-tag" onClick={e=>changeExpandedView(event.id)} style={{cursor: "pointer"}}>Date: {new Date(event.start_time).toLocaleString("en-US", {month: "short", day: "numeric"})}</span>}
                        {event.id===expandedView&&<span className="item-tag" onClick={e=>changeExpandedView(event.id)} style={{cursor: "pointer"}}>Date: {new Date(event.start_time).toLocaleString("en-US", {weekday: "short", year: "numeric", month: "short", day: "numeric"})}</span>}
                        <span className="item-tag" onClick={e=>changeExpandedView(event.id)} style={{cursor: "pointer"}}>Start Time: {new Date(event.start_time).toLocaleString("en-US", {hour: "2-digit", minute: "2-digit", hour12: true})}</span>
                        {event.id===expandedView&&<span className="item-tag" onClick={e=>changeExpandedView(event.id)} style={{cursor: "pointer"}}>End Time: {new Date(event.end_time).toLocaleString("en-US", {hour: "2-digit", minute: "2-digit", hour12: true})}</span>}
                        {event.id===expandedView&&<span className="item-tag" onClick={e=>changeExpandedView(event.id)} style={{cursor: "pointer"}}>Description: {event.description}</span>}

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