
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import "../styles/navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [loggedIn, setLoggedIn] = useState(
    localStorage.getItem("loggedIn") === "true"
  );

  useEffect(() => {
    setLoggedIn(localStorage.getItem("loggedIn") === "true");
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      const { apiFetch } = await import("../services/api");
      await apiFetch("/auth/logout", { method: "POST" });
    } catch (error) {
      console.error("Logout request failed:", error);
    } finally {
      localStorage.removeItem("loggedIn");
      localStorage.removeItem("currentUser");
      localStorage.removeItem("rememberEmail");
      setLoggedIn(false);
      navigate("/login", { replace: true });
    }
  };

  return (
    <nav className="navbar">
      <Link to={loggedIn ? "/home" : "/login"} className="logo">
        Velora Drive
      </Link>

      <div className="nav-links">
        {loggedIn ? (
          <>
            <Link to="/home">Home</Link>
            <Link to="/vehicles">Buy</Link>
            <Link to="/sell">Sell</Link>
            <Link to="/favorites">Favorites</Link>
            <Link to="/compare">Compare</Link>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/enquiries">Enquiries</Link>

            <button
              type="button"
              className="logout-btn"
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        ) : (
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
