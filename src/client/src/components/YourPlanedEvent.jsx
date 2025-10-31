import EventBox from "./EventBox";
const event ={title:"T-Bog General Meeting", date:"2025-08-15", time:"12:00:00", location:"EME 1101"}

export default function YourPlanedEvent(){

    return(
        <div className="planedEventsBox">
            <h1>Your PlanedEvent</h1>
            <EventBox
            event = {event}
            />

        </div>
    )
}