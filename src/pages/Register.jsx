
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiFetch } from "../services/api";
import "../styles/register.css";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (loading) return;

    if (form.name.trim().length === 0) {
      alert("Please enter your name.");
      return;
    }

    if (form.password.length < 8) {
      alert("Password must contain at least 8 characters.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const user = await apiFetch("/auth/register", {
        method: "POST",
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          password: form.password,
        }),
      });

      alert(
        `Registration successful! Welcome ${user.name || form.name.trim()}. Please log in.`
      );

      navigate("/login");
    } catch (error) {
      alert(
        error.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <form className="register-card" onSubmit={handleRegister}>
        <h1>Create Account</h1>
        <p>Join Velora Drive today</p>

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={form.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password (minimum 8 characters)"
          value={form.password}
          onChange={handleChange}
          minLength={8}
          required
        />

        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={form.confirmPassword}
          onChange={handleChange}
          minLength={8}
          required
        />

        <button
          type="submit"
          className="register-btn"
          disabled={loading}
        >
          {loading ? "Creating Account..." : "Register"}
        </button>

        <p className="login-text">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}

export default Register;
