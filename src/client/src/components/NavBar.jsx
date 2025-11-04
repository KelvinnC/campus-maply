import { Link, useLocation } from "react-router-dom"
import "../css/navBar.css"

export default function NavBar(){
    const loggedIn = JSON.parse(localStorage.getItem("user"))
    const location = useLocation()
    const isLoginPage = location.pathname === '/login'
    const isEventMangerPage = location.pathname === '/event-planner'
    function signOut(){
        localStorage.clear()
        window.location.reload();
    }
    
    return(
        <nav className="NavbarBox">
            <div className="navBarTitle">
                <Link to="/"className="navBarTitle">
                    Campus Maply
                </Link>
            </div>
            <div className="navBarFlexBox">
                {/**This is where we would have our auth for this button ie
                 *  loggedIn === "Prof" if Prof is the role we want 
                 */}
                {loggedIn && loggedIn.status === "Prof" && !isEventMangerPage&&(
                <Link to="/event-planner" className="navBarLink">
                    <button>Event Planer</button>
                </Link>)
                }
                {!isLoginPage && !loggedIn&& (
                <Link to="/login" className="navBarLink">
                    <button>Login</button>
                </Link>
            )}{loggedIn&& (
                 <div className="navBarLink">
                    <button onClick={signOut}>Sign Out</button>
                 </div>

            )}

            </div>
        </nav>
    )
}