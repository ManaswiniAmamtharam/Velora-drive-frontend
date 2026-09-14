import { Link } from "react-router-dom";

function VehicleCard({ vehicle }) {
  return (
    <div className="card">
      <img src={vehicle.image} alt={vehicle.model} />

      <div className="info">
        <h3>
          {vehicle.brand} {vehicle.model}
        </h3>

        <p>{vehicle.year}</p>

        <h2>₹ {vehicle.price.toLocaleString()}</h2>

        <p>{vehicle.kilometers.toLocaleString()} km</p>

        <p>
          {vehicle.fuel} • {vehicle.transmission}
        </p>

        <p>{vehicle.location}</p>

        <Link to={`/vehicles/${vehicle.id}`}>
          <button>View Details</button>
        </Link>
      </div>
    </div>
  );
}

export default VehicleCard;