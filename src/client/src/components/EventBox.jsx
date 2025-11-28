import actionButton from "../assets/actionButton.png"
import EditEvent from "./EditEvent"
export default function EventBox({event,formatedEvent, close, refreshTrigger, setEvent}){
    const title = formatedEvent.title
    const date = formatedEvent.date
    const time = formatedEvent.time
    const location = event.location
    const handleSetEvent =()=>{
        setEvent(event)
    }
    return(
        <div className="eventBoxGrid">
            <div className="eventBox">
                <div>{title}</div>
                <div>{time} {date}</div>
                <div>{location}</div>
            </div>
            <div>
                <img src={actionButton} alt="actionButton" onClick={handleSetEvent}/>
            </div>
            
        </div>
    )
}