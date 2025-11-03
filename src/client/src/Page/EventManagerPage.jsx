import NavBar from "../components/NavBar"
import YourPlanedEvent from "../components/YourPlanedEvent"
import CreateEventForm from "../components/CreateEventForm"
import "../css/EventManager.css"

export default function EventManagerPage(){
    return(
        <div className="eventManager">
            <NavBar/>
            <div className="gridForEventManager">
                <div>
                    <YourPlanedEvent/>
                </div>
                <div>
                    <CreateEventForm/>
                </div>
            </div>
        </div>
    )
}