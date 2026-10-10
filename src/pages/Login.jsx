
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiFetch } from "../services/api";
import "../styles/login.css";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberEmail");

    if (savedEmail) {
      setEmail(savedEmail);
      setRemember(true);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (loading) return;

    try {
      setLoading(true);

      const user = await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email: email.trim(),
          password: password,
        }),
      });

      if (remember) {
        localStorage.setItem("rememberEmail", email.trim());
      } else {
        localStorage.removeItem("rememberEmail");
      }

      // Store user information for display purposes.
      // The backend session should verify authentication.
      localStorage.setItem("currentUser", JSON.stringify(user));
      localStorage.setItem("loggedIn", "true");

      alert(`Welcome ${user.name || "back"}!`);

      // Navigate after successful login.
      navigate("/home", { replace: true });
    } catch (error) {
      alert(
        error.message ||
          "Login failed. Please check your email and password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <form className="login-card" onSubmit={handleLogin}>
        <h1>Welcome Back</h1>

        <p>Login to your Velora Drive account</p>

        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          required
        />

        <div className="login-options">
          <label>
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
            />
            Remember Me
          </label>

          <span
            className="forgot-link"
            onClick={() =>
              alert(
                "Password reset feature is not implemented yet."
              )
            }
          >
            Forgot Password?
          </span>
        </div>

        <button
          type="submit"
          className="login-btn"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="register-text">
          Don't have an account?{" "}
          <Link to="/register">Register</Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
