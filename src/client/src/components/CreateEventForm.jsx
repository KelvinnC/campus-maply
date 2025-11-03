import {useForm} from 'react-hook-form'
//import { useCookies } from 'react-cookie';

export default function createEventForm(){
    const { register, handleSubmit} = useForm();
    //const [cookie, setCookie] = useCookies(['userInfo',{doNotParse: true}]);
    const onSubmit = data=> {
        console.log(data)
        //This is where we call our API will have to make data async, and set our cookies
    };

    return(
        <form onSubmit = {handleSubmit(onSubmit)} className="createEventForm" >
            <h1>Create A New Event</h1>
            <label>Title</label>     
            <input type="text" name="Title" {...register("title")}/>

            <label>Date</label>
            <input type="date" name="date" {...register("date")}/>

            <label>Time</label>
            <input type="time" name="time" {...register("time")}/>

            <label>Location</label>
            {/**I will change this select to a react select that pulls API data for what locations this account can access :) when we get that api working this is just a mock up for now*/}
            <select {...register("location")}>
                <option value={"EME 1011"}> EME 1011 </option>
                <option value={"EME 1012"}>EME 1012 </option>
                <option value={"EME 1013"}>EME 1013 </option>
            </select>

            <label>Max Event Size</label>
            <input type="text" {...register("maxSize")}/>

                    
            <button type="submit" >Create Event</button>
                
        </form>
    )
}
