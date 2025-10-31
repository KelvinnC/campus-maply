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
            <label>Title</label>     
            <input type="text" name="Title" placeholder="Title" {...register("title")}/>

            <label>Date</label>
            <input type="date" name="date" {...register("date")}/>

            <label>Time</label>
            <input type="time" name="time" {...register("time")}/>

            <label>Location</label>
            {/**I will change this select to a react select that pulls API data for what locations this account can access :) when we get that api working this is just a mock up for now*/}
            <select {...register("location")}>
                <option value={"EME 1011"}/>
                <option value={"EME 1012"}/>
                <option value={"EME 1013"}/>
            </select>

            <label>Max Event Size</label>
            <input type="text" placeholder='Max event size' {...register("maxSize")}/>

                    
            <button type="submit" >Create Event</button>
                
        </form>
    )
}
