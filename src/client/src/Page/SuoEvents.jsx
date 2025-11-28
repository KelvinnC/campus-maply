import React, { useEffect, useState } from 'react';
import NavBar from '../components/NavBar';
import actionButton from '../assets/actionButton.png';
import '../css/suoEvents.css';

export default function SuoEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/suo-events');
        if (!response.ok) {
          throw new Error('Failed to load events');
        }
        const data = await response.json();
        setEvents(data);
      } catch (e) {
        setError(e.message || 'Error loading events');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const formatEventForDisplay = (event) => {
    let date = event.start_date || '';
    let time = '';

    if (event.start_date) {
      const parsed = new Date(event.start_date);
      if (!Number.isNaN(parsed.getTime())) {
        date = parsed.toLocaleDateString();
        time = parsed.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      }
    }

    let location = 'SUO Event';
    if (event.venue && event.venue.name) {
      const city = event.venue.city ? `, ${event.venue.city}` : '';
      location = `${event.venue.name}${city}`;
    }

    return {
      title: event.title,
      date,
      time,
      location,
    };
  };

  const handleEventClick = (url) => {
    if (!url) return;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleKeyDown = (event, url) => {
    if (!url) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleEventClick(url);
    }
  };

  return (
    <div className="suo-events-page">
      <NavBar />
      <main className="suo-events-main">
        <h1>SUO Events</h1>
        {loading && <p className="suo-events-status">Loading events...</p>}
        {error && !loading && (
          <p className="suo-events-error">Error: {error}</p>
        )}
        {!loading && !error && events.length === 0 && (
          <p className="suo-events-status">No upcoming events found.</p>
        )}
        {!loading && !error && events.length > 0 && (
          <div className="suo-events-list">
            {events.map((event) => {
              const formatted = formatEventForDisplay(event);
              const hasUrl = Boolean(event.url);

              return (
                <div key={event.id} className="suo-event-wrapper">
                  <div
                    className={`eventBoxGrid suo-event-box${hasUrl ? ' suo-event-box-clickable' : ''}`}
                    onClick={() => handleEventClick(event.url)}
                    role={hasUrl ? 'button' : undefined}
                    tabIndex={hasUrl ? 0 : undefined}
                    onKeyDown={(e) => handleKeyDown(e, event.url)}
                  >
                    <div className="eventBox">
                      <div>{formatted.title}</div>
                      <div>
                        {formatted.time} {formatted.date}
                      </div>
                      <div>{formatted.location}</div>
                      {event.description && (
                        <div
                          className="suo-event-description"
                          dangerouslySetInnerHTML={{ __html: event.description }}
                        />
                      )}
                    </div>
                    <div>
                      <img src={actionButton} alt="Open SUO event" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
