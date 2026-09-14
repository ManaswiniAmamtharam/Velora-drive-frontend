import { useParams } from "react-router-dom";
import { useState } from "react";
import vehicles from "../data/vehicles";
import Toast from "../components/Toast";
import "../styles/vehicleDetails.css";

function VehicleDetails() {
  const { id } = useParams();

  const vehicle = vehicles.find((v) => v.id === Number(id));

  const [mainImage, setMainImage] = useState(vehicle?.image);

  const [toast, setToast] = useState("");

  const [contact, setContact] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(""), 2000);
  };

  if (!vehicle) {
    return (
      <div className="container">
        <h2>Vehicle Not Found</h2>
      </div>
    );
  }

  // Favorite
  const addFavorite = () => {
    let favorites =
      JSON.parse(localStorage.getItem("favoriteVehicles")) || [];

    if (!favorites.includes(vehicle.id)) {
      favorites.push(vehicle.id);

      localStorage.setItem(
        "favoriteVehicles",
        JSON.stringify(favorites)
      );

      showToast("Added to Favorites ❤️");
    } else {
      favorites = favorites.filter((id) => id !== vehicle.id);

      localStorage.setItem(
        "favoriteVehicles",
        JSON.stringify(favorites)
      );

      showToast("Removed from Favorites");
    }
  };

  // Compare
  const addCompare = () => {
    let compare =
      JSON.parse(localStorage.getItem("compareVehicles")) || [];

    if (!compare.includes(vehicle.id)) {
      if (compare.length >= 2) {
        showToast("Only 2 vehicles can be compared");
        return;
      }

      compare.push(vehicle.id);

      localStorage.setItem(
        "compareVehicles",
        JSON.stringify(compare)
      );

      showToast("Added for Comparison");
    } else {
      showToast("Already Selected");
    }
  };

  // Share
  const shareVehicle = () => {
    navigator.clipboard.writeText(window.location.href);
    showToast("Vehicle link copied!");
  };

  // Contact Seller
  const sendMessage = () => {
    if (
      !contact.name ||
      !contact.email ||
      !contact.phone ||
      !contact.message
    ) {
      showToast("Please fill all fields");
      return;
    }

    const enquiries =
      JSON.parse(localStorage.getItem("enquiries")) || [];

    enquiries.push({
      name: contact.name,
      email: contact.email,
      phone: contact.phone,
      message: contact.message,
      vehicle: `${vehicle.brand} ${vehicle.model}`,
      date: new Date().toLocaleDateString(),
    });

    localStorage.setItem(
      "enquiries",
      JSON.stringify(enquiries)
    );

    showToast("Message Sent Successfully!");

    setContact({
      name: "",
      email: "",
      phone: "",
      message: "",
    });
  };

  return (
    <div className="container details-page">
      <Toast message={toast} />

      {/* LEFT SIDE */}
      <div className="gallery">
        <img
          src={mainImage}
          alt={vehicle.model}
          className="main-img"
          onError={(e) => {
            e.target.src = "/images/defaultcar.jpg";
          }}
        />

        <div className="thumbs">
          {[1, 2, 3].map((item) => (
            <img
              key={item}
              src={vehicle.image}
              alt="thumbnail"
              onClick={() => setMainImage(vehicle.image)}
            />
          ))}
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="details">
        <h1>
          {vehicle.brand} {vehicle.model}
        </h1>

        <h2>₹ {vehicle.price.toLocaleString()}</h2>

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
              <td>Year</td>
              <td>{vehicle.year}</td>
            </tr>

            <tr>
              <td>Fuel</td>
              <td>{vehicle.fuel}</td>
            </tr>

            <tr>
              <td>Transmission</td>
              <td>{vehicle.transmission}</td>
            </tr>

            <tr>
              <td>Kilometers</td>
              <td>{vehicle.kilometers.toLocaleString()} km</td>
            </tr>

            <tr>
              <td>Owners</td>
              <td>{vehicle.owners}</td>
            </tr>

            <tr>
              <td>Color</td>
              <td>{vehicle.color}</td>
            </tr>
          </tbody>
        </table>

        <h3>Description</h3>

        <p>
          This vehicle is in excellent condition with complete
          service history, insurance, RC and pollution certificate.
          Perfect for city and highway driving.
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
          <h4>Rahul Sharma</h4>
          <p>📍 {vehicle.location}</p>
          <p>📞 +91 9876543210</p>
          <p>✉ rahul@email.com</p>
        </div>

        <div className="actions">
          <button onClick={addFavorite}>
            ❤️ Favorite
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
          />

          <input
            type="text"
            placeholder="Phone Number"
            value={contact.phone}
            onChange={(e) =>
              setContact({
                ...contact,
                phone: e.target.value,
              })
            }
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
          />

          <button onClick={sendMessage}>
            Send Message
          </button>
        </div>
      </div>
    </div>
  );
}

export default VehicleDetails;