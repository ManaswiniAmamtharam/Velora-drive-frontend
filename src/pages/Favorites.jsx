import { useEffect, useState } from "react";
import vehicles from "../data/vehicles";
import VehicleCard from "../components/VehicleCard";
import "../components/VehicleCard.css";

function Favorites() {
  const [favoriteVehicles, setFavoriteVehicles] = useState([]);

  useEffect(() => {
    const ids = JSON.parse(localStorage.getItem("favoriteVehicles")) || [];

    const data = vehicles.filter((v) => ids.includes(v.id));

    setFavoriteVehicles(data);
  }, []);

  return (
    <div className="container">
      <h1>❤️ My Favorite Vehicles</h1>

      {favoriteVehicles.length === 0 ? (
        <h3>No favorite vehicles yet.</h3>
      ) : (
        <div className="grid">
          {favoriteVehicles.map((v) => (
            <VehicleCard key={v.id} vehicle={v} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Favorites;