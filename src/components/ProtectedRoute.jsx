import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const isLoggedIn = localStorage.getItem("loggedIn") === "true";

  if (!isLoggedIn) {
    alert("Please login first!");
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;