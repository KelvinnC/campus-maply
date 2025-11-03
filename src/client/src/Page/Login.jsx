import LoginForm from "../components/loginForm"
import NavBar from "../components/NavBar"
import mapIcon from "../assets/mapIcon.png"
import "../css/login.css"

export default function Login(){
    return(
        <div className="login">
            <NavBar/>
            <div className="loginContainer">
                <div className="siteName">
                        <h1>Welcome Back</h1>
                        <img src={mapIcon} alt="mapIcon"/>
                </div>
                <div className="loginFormWrapper"> 
                    <LoginForm />
                </div>
            </div>
        </div>
    )
}
