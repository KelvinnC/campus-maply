import { Link, useLocation, useNavigate  } from "react-router-dom"
import "../css/navBar.css"

export default function NavBar(){
    const loggedIn = JSON.parse(localStorage.getItem("user"))
    const location = useLocation()
    const isLoginPage = location.pathname === '/login'
    const isEventMangerPage = location.pathname === '/event-planner'
    const isSuoEventsPage = location.pathname === '/events'
    const navigate = useNavigate();
    function signOut(){
        localStorage.clear()
        navigate("/");
    }
    
    return(
        <nav className="NavbarBox">
            <div className="navBarTitle">
                <Link to="/"className="navBarTitle">
                    Campus Maply
                </Link>
            </div>
            <div className="navBarFlexBox">
                {!isSuoEventsPage && (
                    <Link to="/events" className="navBarLink">
                        <button>SUO Events</button>
                    </Link>
                )}
                {loggedIn && (loggedIn.status === "ADMIN" || loggedIn.status === "FACULTY"|| loggedIn.status === "EVENT_COORDINATOR") && !isEventMangerPage&&(
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
