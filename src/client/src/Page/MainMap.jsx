import { useState } from "react"
import Map from "../components/Map"
import NavBar from "../components/NavBar"
import "../css/mainMap.css"
export default function MainMap(){
    const [buildingFilter, setBuildingFilter] = useState(true)
    const [parkingFilter, setParkingFilter] = useState(true)
    const [businessFilter, setBusinessFilter] = useState(true)

    const handelBuildingFilterChange = (change) =>{
        setBuildingFilter(change);
    }
    const handelParkingFilterChange = (change) =>{
        setParkingFilter(change);
    }
    const handelBusinessFilterChange = (change) =>{
        setBusinessFilter(change);
    }

    return(
        <div className="app">
            <NavBar/>
            <main className="app-main">
                <Map
                  buildingEnabled={buildingFilter}
                  parkingEnabled={parkingFilter}
                  businessEnabled={businessFilter}
                  onBuildingChange={handelBuildingFilterChange}
                  onParkingChange={handelParkingFilterChange}
                  onBusinessChange={handelBusinessFilterChange}
                />
            </main>
        </div>
    )
}
