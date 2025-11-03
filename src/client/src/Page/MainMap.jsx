import { useState } from "react"
import Filters from "../components/Filters"
import Map from "../components/Map"
import NavBar from "../components/NavBar"
import "../css/mainMap.css"
export default function MainMap(){
    const [buildingFilter, setBuildingFilter] = useState(true)
    const [parkingFilter, setParkingFilter] = useState(true)

    const handelBuildingFilterChange = (change) =>{
        setBuildingFilter(change);
    }
    const handelParkingFilterChange = (change) =>{
        setParkingFilter(change);
    }

    return(
        <div className="app">
            <NavBar/>
            <main className="app-main">
                <div>
                    <Filters
                    buildingFilter = {handelBuildingFilterChange}
                    parkingFilter = {handelParkingFilterChange}
                    />
                 </div>
                <Map 
                buildingFilter ={buildingFilter}
                parkingFilter = {parkingFilter}
                />
            </main>
        </div>
    )
}