import {useForm} from 'react-hook-form'
//import { useCookies } from 'react-cookie';

export default function LoginForm(){
    const { register, handleSubmit} = useForm();
    //const [cookie, setCookie] = useCookies(['userInfo',{doNotParse: true}]);
    const onSubmit = data=> {
        console.log(data)
        //This is where we call our API will have to make data async, and set our cookies
    };

    return(
        <form onSubmit = {handleSubmit(onSubmit)} className="loginForm" >
            <label>Log in</label>
                    
            <input type="text" name="username" placeholder="Username" {...register("username")}/>
            <input type="password" name="password" placeholder="Password" {...register("password")}/>

                    
            <button type="submit" >Login</button>
                
        </form>
    )
}
