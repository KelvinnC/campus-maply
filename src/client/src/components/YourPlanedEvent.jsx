import { useState, useEffect } from 'react';
import EventBox from "./EventBox";

export default function YourPlanedEvent({ refreshTrigger, setSelectedEvent, close }) {
    const loggedIn = JSON.parse(localStorage.getItem("user"));
    const isFaculty = loggedIn.status === "FACULTY";
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    const fetchEvents = async () => {
        try {
            setLoading(true);
            setError(null);
            
            if(isFaculty){
                const response = await fetch(`/api/events/faculty?id=${loggedIn.id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch events');
                }
                
                const data = await response.json();

                setEvents(data);
            }else{
                const response = await fetch('/api/events');
                if (!response.ok) {
                    throw new Error('Failed to fetch events');
                }
                
                const data = await response.json();

                setEvents(data);
            }

        } catch (err) {
            console.error('Error fetching events:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, [refreshTrigger]);

    const formatEventForDisplay = (event) => {
        const startDate = new Date(event.start_time);
        
        let location = 'TBA';
        if (event.booking && event.booking.room_number) {
            const buildingCode = event.booking.building_code || 'UNK';
            location = `${buildingCode}${event.booking.room_number}`;
        } else if (event.building_name) {
            location = event.building_name;
        } else if (event.building_code) {
            location = event.building_code;
        }
        
        return {
            title: event.title,
            date: startDate.toLocaleDateString(),
            time: startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            location: location
        };
    };

    return (
        <div className="planedEventsBox">
            <h1>Your Planed Events</h1>
            
            {loading && <p>Loading events...</p>}
            
            {error && (
                <p style={{ color: 'red' }}>Error loading events: {error}</p>
            )}
            
            {!loading && !error && events.length === 0 && (
                <p>No events yet. Create your first event!</p>
            )}
            
            {!loading && !error && events.length > 0 && (
                <div>
                    {events.map((event) => (
                        <EventBox
                            key={event.id}
                            formatedEvent={formatEventForDisplay(event)}
                            event = {event}
                            close = {close}
                            refreshTrigger = {refreshTrigger}
                            setEvent = {setSelectedEvent}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}