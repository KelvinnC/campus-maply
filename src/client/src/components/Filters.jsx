export default function Filters({buildingFilter, parkingFilter}){
    const sendBuildingFilterToParent = (event) => {
        buildingFilter(event.target.checked);
    
  };
  const sendParkingFilterToParent = (event) => {
        parkingFilter(event.target.checked);
    
  };

    return(
        <div className="filters">
            <h1>Filters</h1>
            <div className="filter">
                <input type="checkbox" name="" id="" defaultChecked onChange={sendBuildingFilterToParent}/>
                <label>Parking</label>
            </div>
            <div className="filter">
                <input type="checkbox" name="" id="" defaultChecked onChange={sendParkingFilterToParent}/>
                <label htmlFor="">Buildings</label>
            </div>
        </div>
    )
}