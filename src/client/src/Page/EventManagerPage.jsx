import { useState } from 'react';
import NavBar from "../components/NavBar";
import YourPlanedEvent from "../components/YourPlanedEvent";
import CreateEventForm from "../components/CreateEventForm";
import "../css/EventManager.css";
import EditEvent from '../components/EditEvent';

export default function EventManagerPage() {
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [selectedEvent, setSelectedEvent] = useState(undefined);
    
    const handleCloseEvent = () => {
    setSelectedEvent(undefined);
  };
    const handleEventCreated = (newEvent) => {
        setRefreshTrigger(prev => prev + 1);
    };

    return (
        <div className="eventManager">
            <NavBar />
            <div className="gridForEventManager">
                <div>
                    <YourPlanedEvent refreshTrigger={refreshTrigger} setSelectedEvent = {setSelectedEvent}/>
                </div>
                <div>
                    <CreateEventForm onEventCreated={handleEventCreated} />
                </div>
                {selectedEvent!==  undefined&&<EditEvent
                    event={selectedEvent}
                    close = {handleCloseEvent}
                    />
                }
                </div>
        </div>
    );
}