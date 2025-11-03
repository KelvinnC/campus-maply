import { Link, useLocation } from "react-router-dom"
import "../css/navBar.css"

export default function NavBar(){
    const location = useLocation()
    const isLoginPage = location.pathname === '/login'
    
    return(
        <nav className="NavbarBox">
            <div className="navBarTitle">
                Campus Maply
            </div>
            {!isLoginPage && (
                <Link to="/login" className="navBarLoginBtn">
                    Login
                </Link>
            )}
        </nav>
    )
}