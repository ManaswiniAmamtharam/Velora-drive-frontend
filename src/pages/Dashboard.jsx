import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    name: "",
    email: "",
    mobile: "",
    city: ""
  });

  const [listings, setListings] = useState([]);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const logged = localStorage.getItem("loggedIn");

    if (logged !== "true") {
      navigate("/login");
      return;
    }

    const currentUser =
      JSON.parse(localStorage.getItem("currentUser")) || {};

    setUser(currentUser);

    const sellerListings =
      JSON.parse(localStorage.getItem("sellerListings")) || [];

    setListings(sellerListings);
  }, [navigate]);

  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value
    });
  };

  const saveProfile = () => {
    let users =
      JSON.parse(localStorage.getItem("users")) || [];

    users = users.map((u) =>
      u.email === user.email ? user : u
    );

    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("currentUser", JSON.stringify(user));

    alert("Profile Updated Successfully!");
    setEditing(false);
  };

  const deleteListing = (id) => {
    const updated = listings.filter((item) => item.id !== id);

    setListings(updated);

    localStorage.setItem(
      "sellerListings",
      JSON.stringify(updated)
    );

    alert("Listing Deleted");
  };

  const logout = () => {
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("currentUser");
    navigate("/");
  };

  return (
    <div className="container">
      <h1>My Dashboard</h1>

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
          <>
            <input
              name="name"
              value={user.name}
              onChange={handleChange}
              placeholder="Name"
            />

            <input
              value={user.email}
              disabled
            />

            <input
              name="mobile"
              value={user.mobile}
              onChange={handleChange}
              placeholder="Mobile"
            />

            <input
              name="city"
              value={user.city}
              onChange={handleChange}
              placeholder="City"
            />

            <button onClick={saveProfile}>
              Save Changes
            </button>
          </>
        ) : (
          <>
            <p><b>Name:</b> {user.name}</p>
            <p><b>Email:</b> {user.email}</p>
            <p><b>Mobile:</b> {user.mobile}</p>
            <p><b>City:</b> {user.city}</p>

            <button onClick={() => setEditing(true)}>
              Edit Profile
            </button>
          </>
        )}
      </div>

      <div className="dashboard-card">
        <h2>My Listings</h2>

        {listings.length === 0 ? (
          <p>No vehicles listed yet.</p>
        ) : (
          listings.map((vehicle) => (
            <div className="listing" key={vehicle.id}>
              <img
                src={vehicle.image}
                alt={vehicle.model}
                width="120"
              />

              <div className="listing-info">
                <h3>
                  {vehicle.brand} {vehicle.model}
                </h3>

                <p>₹ {vehicle.price}</p>

                <button
                  onClick={() => deleteListing(vehicle.id)}
                >
                  Delete Listing
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <button className="logout-btn" onClick={logout}>
        Logout
      </button>
    </div>
  );
}

export default Dashboard;