import { useState } from 'react';
import NavBar from "../components/NavBar";
import YourPlanedEvent from "../components/YourPlanedEvent";
import CreateEventForm from "../components/CreateEventForm";
import "../css/EventManager.css";

export default function EventManagerPage() {
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const handleEventCreated = (newEvent) => {
        setRefreshTrigger(prev => prev + 1);
    };

    return (
        <div className="eventManager">
            <NavBar />
            <div className="gridForEventManager">
                <div>
                    <YourPlanedEvent refreshTrigger={refreshTrigger} />
                </div>
                <div>
                    <CreateEventForm onEventCreated={handleEventCreated} />
                </div>
            </div>
        </div>
    );
}