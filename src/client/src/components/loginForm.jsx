import {useForm} from 'react-hook-form'
import { useCookies } from 'react-cookie';

export default function loginForm(){
    const { register, handleSubmit, formState: {errors}} = useForm();
    const [cookie, setCookie] = useCookies(['userInfo',{doNotParse: true}]);
    const onSubmit = async(data)=> {
        console.log(data)
        //This is where we call our API
    };

    return(
        <form onSubmit = {handleSubmit(onSubmit)} id="loginForm" >
            <label>Log in</label>
                    
            <input type="text" name="username" placeholder="Username" {...register("username", { 
                required:{
                    value: true,
                    message: 'Please enter a Username Name'
                }
            })}/>
            <input type="password" name="password" placeholder="Password" {...register("password", { 
                required:{
                    value: true,
                    message: 'Please set a Password'
                }
            })}/>

                    
            <button type="submit" >Login</button>
                
        </form>
    )
}
