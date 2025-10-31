export default function EventBox({event}){
    const title = event.title
    const date = event.date
    const time = event.time
    const location = event.location
    console.log(event)
    return(
        <div className="eventBox">
            <div>{title}</div>
            <div>{time} {date}</div>
            <div>{location}</div>

        </div>
    )
}