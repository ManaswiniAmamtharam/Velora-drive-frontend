
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { apiFetch } from "../services/api";

function ProtectedRoute({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    let active = true;

    apiFetch("/auth/me")
      .then((user) => {
        if (active) {
          localStorage.setItem("currentUser", JSON.stringify(user));
          localStorage.setItem("loggedIn", "true");
          setIsAuthenticated(true);
        }
      })
      .catch(() => {
        if (active) {
          localStorage.removeItem("loggedIn");
          localStorage.removeItem("currentUser");
          setIsAuthenticated(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  if (isAuthenticated === null) {
    return <div className="auth-loading">Checking login...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
