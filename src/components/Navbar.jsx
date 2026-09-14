import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import "../styles/navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [loggedIn, setLoggedIn] = useState(false);

  // Update navbar whenever route changes
  useEffect(() => {
    const status = localStorage.getItem("loggedIn") === "true";
    setLoggedIn(status);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("currentUser");
    localStorage.removeItem("rememberEmail");

    setLoggedIn(false);
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        Velora Drive
      </Link>

      <div className="nav-links">
        <Link to="/">Home</Link>

        {loggedIn && (
          <>
            <Link to="/vehicles">Buy</Link>
            <Link to="/sell">Sell</Link>
            <Link to="/favorites">Favorites</Link>
            <Link to="/compare">Compare</Link>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/enquiries">Enquiries</Link>

            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </>
        )}

        {!loggedIn && (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;