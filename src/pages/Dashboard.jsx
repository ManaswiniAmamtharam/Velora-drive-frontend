
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiFetch } from "../services/api";
import "../styles/dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    name: "",
    email: "",
    mobile: "",
    city: ""
  });

  const [form, setForm] = useState({
    name: "",
    mobile: "",
    city: ""
  });

  const [listings, setListings] = useState([]);
  const [sentEnquiries, setSentEnquiries] = useState([]);
  const [receivedEnquiries, setReceivedEnquiries] = useState([]);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    let active = true;

    async function loadDashboard() {
      try {
        const currentUser = await apiFetch("/auth/me");

        if (!active) return;

        if (!currentUser?.email) {
          localStorage.removeItem("loggedIn");
          localStorage.removeItem("currentUser");
          navigate("/login");
          return;
        }

        const profile = {
          name: currentUser.name || "",
          email: currentUser.email || "",
          mobile: currentUser.mobile || "",
          city: currentUser.city || ""
        };

        setUser(profile);
        setForm({
          name: profile.name,
          mobile: profile.mobile,
          city: profile.city
        });

        localStorage.setItem("loggedIn", "true");
        localStorage.setItem(
          "currentUser",
          JSON.stringify(currentUser)
        );

        const results = await Promise.allSettled([
          apiFetch("/vehicles/mine"),
          apiFetch("/enquiries/sent"),
          apiFetch("/enquiries/received")
        ]);

        if (!active) return;

        if (results[0].status === "fulfilled") {
          setListings(results[0].value || []);
        }

        if (results[1].status === "fulfilled") {
          setSentEnquiries(results[1].value || []);
        }

        if (results[2].status === "fulfilled") {
          setReceivedEnquiries(results[2].value || []);
        }

        if (results.some((result) => result.status === "rejected")) {
          setError(
            "Some dashboard information could not be loaded. Please refresh the page."
          );
        }
      } catch (err) {
        if (!active) return;

        localStorage.removeItem("loggedIn");
        localStorage.removeItem("currentUser");

        if (
          err.message.includes("401") ||
          err.message.includes("403")
        ) {
          navigate("/login");
        } else {
          setError(
            "Unable to connect to the backend. Make sure Spring Boot is running."
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadDashboard();

    return () => {
      active = false;
    };
  }, [navigate]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
    setError("");
    setSuccess("");
  };

  const saveProfile = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!form.name.trim()) {
      setError("Please enter your name.");
      return;
    }

    if (form.mobile.trim() && !/^[0-9+\-\s()]{7,20}$/.test(form.mobile.trim())) {
      setError("Please enter a valid mobile number.");
      return;
    }

    setSaving(true);

    try {
      const updatedUser = await apiFetch("/auth/profile", {
        method: "PUT",
        body: JSON.stringify({
          name: form.name.trim(),
          mobile: form.mobile.trim(),
          city: form.city.trim()
        })
      });

      const profile = {
        name: updatedUser.name || "",
        email: updatedUser.email || user.email,
        mobile: updatedUser.mobile || "",
        city: updatedUser.city || ""
      };

      setUser(profile);
      setForm({
        name: profile.name,
        mobile: profile.mobile,
        city: profile.city
      });

      localStorage.setItem("currentUser", JSON.stringify(profile));

      setEditing(false);
      setSuccess("Profile updated successfully!");
    } catch (err) {
      setError(err.message || "Unable to update your profile.");
    } finally {
      setSaving(false);
    }
  };

  const cancelEditing = () => {
    setForm({
      name: user.name,
      mobile: user.mobile,
      city: user.city
    });
    setEditing(false);
    setError("");
    setSuccess("");
  };

  const deleteListing = async (id) => {
    if (!window.confirm("Are you sure you want to delete this vehicle listing?")) {
      return;
    }

    try {
      await apiFetch(`/vehicles/${id}`, {
        method: "DELETE"
      });

      setListings((previous) =>
        previous.filter((vehicle) => String(vehicle.id) !== String(id))
      );

      setSuccess("Vehicle listing deleted successfully.");
      setError("");
    } catch (err) {
      setError(err.message || "Unable to delete this listing.");
    }
  };

  const logout = async () => {
    try {
      await apiFetch("/auth/logout", {
        method: "POST"
      });
    } catch (err) {
      console.error("Logout request failed:", err);
    } finally {
      localStorage.removeItem("loggedIn");
      localStorage.removeItem("currentUser");
      navigate("/login");
    }
  };

  if (loading) {
    return (
      <div className="container">
        <h1>My Dashboard</h1>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>My Dashboard</h1>

      {error && (
        <p role="alert" className="dashboard-error">
          {error}
        </p>
      )}

      {success && (
        <p role="status" className="dashboard-success">
          {success}
        </p>
      )}

      <div className="dashboard-menu">
        <Link to="/sell">
          <button>Sell Vehicle</button>
        </Link>

        <Link to="/favorites">
          <button>Favorites</button>
        </Link>

        <Link to="/compare">
          <button>Compare</button>
        </Link>

        <Link to="/enquiries">
          <button>Enquiries</button>
        </Link>
      </div>

      <div className="dashboard-card">
        <h2>Profile Information</h2>

        {editing ? (
          <form onSubmit={saveProfile}>
            <label htmlFor="profile-name">Name</label>
            <input
              id="profile-name"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter your name"
              maxLength={255}
              required
            />

            <label htmlFor="profile-email">Email</label>
            <input
              id="profile-email"
              value={user.email}
              disabled
            />

            <label htmlFor="profile-mobile">Mobile</label>
            <input
              id="profile-mobile"
              name="mobile"
              type="tel"
              value={form.mobile}
              onChange={handleChange}
              placeholder="Enter your mobile number"
              maxLength={20}
            />

            <label htmlFor="profile-city">City</label>
            <input
              id="profile-city"
              name="city"
              value={form.city}
              onChange={handleChange}
              placeholder="Enter your city"
              maxLength={100}
            />

            <button type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </button>

            <button
              type="button"
              onClick={cancelEditing}
              disabled={saving}
            >
              Cancel
            </button>
          </form>
        ) : (
          <>
            <p><b>Name:</b> {user.name || "Not available"}</p>
            <p><b>Email:</b> {user.email || "Not available"}</p>
            <p><b>Mobile:</b> {user.mobile || "Not added"}</p>
            <p><b>City:</b> {user.city || "Not added"}</p>

            <button
              onClick={() => {
                setForm({
                  name: user.name,
                  mobile: user.mobile,
                  city: user.city
                });
                setEditing(true);
                setError("");
                setSuccess("");
              }}
            >
              Edit Profile
            </button>
          </>
        )}
      </div>

      <div className="dashboard-card">
        <h2>My Listings ({listings.length})</h2>

        {listings.length === 0 ? (
          <p>You have not listed any vehicles yet.</p>
        ) : (
          listings.map((vehicle) => (
            <div className="listing" key={vehicle.id}>
              {vehicle.image ? (
                <img
                  src={vehicle.image}
                  alt={`${vehicle.brand} ${vehicle.model}`}
                  width="120"
                />
              ) : (
                <div className="listing-image-placeholder">
                  No image available
                </div>
              )}

              <div className="listing-info">
                <h3>{vehicle.brand} {vehicle.model}</h3>
                <p>Type: {vehicle.type || "Not specified"}</p>
                <p>Year: {vehicle.year || "Not specified"}</p>
                <p>
                  Price: ₹ {Number(vehicle.price || 0).toLocaleString("en-IN")}
                </p>
                <p>Location: {vehicle.location || "Not specified"}</p>

                <button onClick={() => deleteListing(vehicle.id)}>
                  Delete Listing
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="dashboard-card">
        <h2>Enquiry Summary</h2>

        <p><b>Enquiries Sent:</b> {sentEnquiries.length}</p>
        <p><b>Enquiries Received:</b> {receivedEnquiries.length}</p>

        <Link to="/enquiries">
          <button>View All Enquiries</button>
        </Link>
      </div>

      <button className="logout-btn" onClick={logout}>
        Logout
      </button>
    </div>
  );
}

export default Dashboard;
