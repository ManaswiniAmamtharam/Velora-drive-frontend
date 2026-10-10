
import { useEffect, useState } from "react";
import { apiFetch } from "../services/api";
import VehicleCard from "../components/VehicleCard";
import "../components/VehicleCard.css";

function Favorites() {
  const [favoriteVehicles, setFavoriteVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadFavorites = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await apiFetch("/favorites");

      setFavoriteVehicles(
        Array.isArray(data)
          ? data.map((vehicle) => ({
              ...vehicle,
              price: Number(vehicle.price || 0),
              kilometers: Number(vehicle.kilometers || 0),
            }))
          : []
      );
    } catch (err) {
      setError(err.message || "Unable to load favorites.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFavorites();
  }, []);

  return (
    <div className="container">
      <h1>❤️ My Favorite Vehicles</h1>

      {loading ? (
        <h3>Loading your favorites...</h3>
      ) : error ? (
        <div>
          <h3>{error}</h3>
          <button onClick={loadFavorites}>Try Again</button>
        </div>
      ) : favoriteVehicles.length === 0 ? (
        <h3>No favorite vehicles yet.</h3>
      ) : (
        <div className="grid">
          {favoriteVehicles.map((vehicle) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Favorites;
