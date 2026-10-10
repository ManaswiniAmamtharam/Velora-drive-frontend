
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { apiFetch } from "../services/api";
import Toast from "../components/Toast";
import "../styles/vehicleDetails.css";

function VehicleDetails() {
  const { id } = useParams();

  const [vehicle, setVehicle] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [enquiryLoading, setEnquiryLoading] = useState(false);

  const [contact, setContact] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  useEffect(() => {
    let active = true;

    async function loadVehicle() {
      try {
        setLoading(true);
        setError("");

        const data = await apiFetch(`/vehicles/${id}`);

        if (active) {
          setVehicle(data);
          setMainImage(data.image || "/images/defaultcar.jpg");
        }
      } catch (err) {
        if (active) {
          setError(err.message || "Unable to load vehicle details.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadVehicle();

    return () => {
      active = false;
    };
  }, [id]);

  useEffect(() => {
    let active = true;

    async function loadFavoriteStatus() {
      try {
        const favorites = await apiFetch("/favorites");

        if (active && Array.isArray(favorites)) {
          setIsFavorite(
            favorites.some(
              (item) => Number(item.id) === Number(id)
            )
          );
        }
      } catch {
        if (active) {
          setIsFavorite(false);
        }
      }
    }

    loadFavoriteStatus();

    return () => {
      active = false;
    };
  }, [id]);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(""), 2500);
  };

  const addFavorite = async () => {
    if (favoriteLoading) return;

    setFavoriteLoading(true);

    try {
      if (isFavorite) {
        await apiFetch(`/favorites/${id}`, {
          method: "DELETE",
        });

        setIsFavorite(false);
        showToast("Removed from Favorites");
      } else {
        await apiFetch(`/favorites/${id}`, {
          method: "POST",
        });

        setIsFavorite(true);
        showToast("Added to Favorites ❤️");
      }
    } catch (err) {
      showToast(err.message || "Unable to update favorites.");
    } finally {
      setFavoriteLoading(false);
    }
  };

  const addCompare = () => {
    let compare = [];

    try {
      compare = JSON.parse(
        localStorage.getItem("compareVehicles") || "[]"
      );
    } catch {
      compare = [];
    }

    const vehicleId = Number(vehicle.id);

    if (compare.some((item) => Number(item) === vehicleId)) {
      showToast("Already Selected");
      return;
    }

    if (compare.length >= 2) {
      showToast("Only 2 vehicles can be compared");
      return;
    }

    compare.push(vehicleId);

    localStorage.setItem(
      "compareVehicles",
      JSON.stringify(compare)
    );

    showToast("Added for Comparison");
  };

  const shareVehicle = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      showToast("Vehicle link copied!");
    } catch {
      showToast("Unable to copy link. Copy the page URL manually.");
    }
  };

  const sendMessage = async () => {
    if (enquiryLoading) return;

    if (
      !contact.name.trim() ||
      !contact.email.trim() ||
      !contact.phone.trim() ||
      !contact.message.trim()
    ) {
      showToast("Please fill all fields");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email.trim())) {
      showToast("Please enter a valid email address.");
      return;
    }

    if (contact.phone.trim().length > 30) {
      showToast("Phone number is too long.");
      return;
    }

    if (contact.message.trim().length > 1800) {
      showToast("Please shorten your message.");
      return;
    }

    setEnquiryLoading(true);

    try {
      await apiFetch("/enquiries", {
        method: "POST",
        body: JSON.stringify({
          vehicleId: Number(vehicle.id),
          message:
            `Name: ${contact.name.trim()}\n` +
            `Email: ${contact.email.trim()}\n` +
            `Message: ${contact.message.trim()}`,
          phone: contact.phone.trim(),
        }),
      });

      showToast("Enquiry sent successfully!");

      setContact({
        name: "",
        email: "",
        phone: "",
        message: "",
      });
    } catch (err) {
      showToast(err.message || "Unable to send enquiry.");
    } finally {
      setEnquiryLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container">
        <h2>Loading vehicle details...</h2>
      </div>
    );
  }

  if (error || !vehicle) {
    return (
      <div className="container">
        <h2>Vehicle Not Found</h2>
        <p>{error || "This vehicle may have been removed."}</p>
      </div>
    );
  }

  const price = Number(vehicle.price ?? 0);
  const kilometers = Number(vehicle.kilometers ?? 0);

  return (
    <div className="container details-page">
      <Toast message={toast} />

      <div className="gallery">
        <img
          src={mainImage}
          alt={`${vehicle.brand} ${vehicle.model}`}
          className="main-img"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = "/images/defaultcar.jpg";
          }}
        />

        <div className="thumbs">
          {[1, 2, 3].map((item) => (
            <img
              key={item}
              src={vehicle.image || "/images/defaultcar.jpg"}
              alt={`Vehicle view ${item}`}
              onClick={() =>
                setMainImage(
                  vehicle.image || "/images/defaultcar.jpg"
                )
              }
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = "/images/defaultcar.jpg";
              }}
            />
          ))}
        </div>
      </div>

      <div className="details">
        <h1>
          {vehicle.brand} {vehicle.model}
        </h1>

        <h2>₹ {price.toLocaleString("en-IN")}</h2>

        <p>{vehicle.location}</p>

        <table>
          <tbody>
            <tr>
              <td>Brand</td>
              <td>{vehicle.brand}</td>
            </tr>
            <tr>
              <td>Model</td>
              <td>{vehicle.model}</td>
            </tr>
            <tr>
              <td>Type</td>
              <td>{vehicle.type}</td>
            </tr>
            <tr>
              <td>Year</td>
              <td>{vehicle.year ?? "Not specified"}</td>
            </tr>
            <tr>
              <td>Fuel</td>
              <td>{vehicle.fuel || "Not specified"}</td>
            </tr>
            <tr>
              <td>Transmission</td>
              <td>{vehicle.transmission || "Not specified"}</td>
            </tr>
            <tr>
              <td>Kilometers</td>
              <td>{kilometers.toLocaleString("en-IN")} km</td>
            </tr>
            <tr>
              <td>Owners</td>
              <td>{vehicle.owners ?? "Not specified"}</td>
            </tr>
            <tr>
              <td>Color</td>
              <td>{vehicle.color || "Not specified"}</td>
            </tr>
          </tbody>
        </table>

        <h3>Description</h3>
        <p>
          {vehicle.description ||
            "Contact the seller for more information about this vehicle's condition and service history."}
        </p>

        <h3>Features</h3>
        <ul className="features">
          <li>Air Conditioning</li>
          <li>Power Windows</li>
          <li>ABS</li>
          <li>Airbags</li>
          <li>Bluetooth</li>
          <li>Rear Camera</li>
          <li>Parking Sensors</li>
          <li>Touchscreen</li>
        </ul>

        <h3>Seller Information</h3>
        <div className="seller">
          <h4>Vehicle Seller</h4>
          <p>📍 {vehicle.location}</p>
          <p>Contact details are available through the enquiry form.</p>
        </div>

        <div className="actions">
          <button
            onClick={addFavorite}
            disabled={favoriteLoading}
          >
            {favoriteLoading
              ? "Updating..."
              : isFavorite
                ? "❤️ Remove Favorite"
                : "♡ Favorite"}
          </button>

          <button onClick={addCompare}>
            ⇄ Compare
          </button>

          <button onClick={shareVehicle}>
            🔗 Share
          </button>
        </div>

        <h3>Contact Seller</h3>

        <div className="contact-form">
          <input
            type="text"
            placeholder="Your Name"
            value={contact.name}
            onChange={(e) =>
              setContact({
                ...contact,
                name: e.target.value,
              })
            }
            disabled={enquiryLoading}
          />

          <input
            type="email"
            placeholder="Email"
            value={contact.email}
            onChange={(e) =>
              setContact({
                ...contact,
                email: e.target.value,
              })
            }
            disabled={enquiryLoading}
          />

          <input
            type="tel"
            placeholder="Phone Number"
            value={contact.phone}
            onChange={(e) =>
              setContact({
                ...contact,
                phone: e.target.value,
              })
            }
            disabled={enquiryLoading}
          />

          <textarea
            rows="4"
            placeholder="Write your message..."
            value={contact.message}
            onChange={(e) =>
              setContact({
                ...contact,
                message: e.target.value,
              })
            }
            disabled={enquiryLoading}
          />

          <button
            onClick={sendMessage}
            disabled={enquiryLoading}
          >
            {enquiryLoading ? "Sending..." : "Send Message"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default VehicleDetails;
