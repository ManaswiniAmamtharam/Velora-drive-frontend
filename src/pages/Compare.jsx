
import { useEffect, useState } from "react";
import { apiFetch } from "../services/api";

function Compare() {
  const [compare, setCompare] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadCompareVehicles() {
      try {
        setLoading(true);
        setError("");

        let ids = [];

        try {
          ids = JSON.parse(
            localStorage.getItem("compareVehicles") || "[]"
          );
        } catch {
          ids = [];
        }

        if (!Array.isArray(ids) || ids.length === 0) {
          if (active) setCompare([]);
          return;
        }

        ids = [...new Set(ids.map(Number).filter(Number.isFinite))]
          .slice(0, 2);

        const vehicles = await apiFetch("/vehicles");

        if (!Array.isArray(vehicles)) {
          throw new Error("Invalid vehicle data received.");
        }

        const selected = ids
          .map((id) =>
            vehicles.find((vehicle) => Number(vehicle.id) === id)
          )
          .filter(Boolean);

        if (active) {
          setCompare(selected);

          localStorage.setItem(
            "compareVehicles",
            JSON.stringify(selected.map((vehicle) => Number(vehicle.id)))
          );
        }
      } catch (err) {
        if (active) {
          setError(err.message || "Unable to load vehicles.");
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadCompareVehicles();

    return () => {
      active = false;
    };
  }, []);

  const removeVehicle = (vehicleId) => {
    const updated = compare.filter(
      (vehicle) => Number(vehicle.id) !== Number(vehicleId)
    );

    setCompare(updated);

    localStorage.setItem(
      "compareVehicles",
      JSON.stringify(updated.map((vehicle) => Number(vehicle.id)))
    );
  };

  const formatPrice = (price) =>
    Number(price ?? 0).toLocaleString("en-IN");

  const formatNumber = (value) =>
    value == null
      ? "Not specified"
      : Number(value).toLocaleString("en-IN");

  if (loading) {
    return (
      <div className="container">
        <h2>Loading comparison...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <h2>Unable to Load Comparison</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>
          Try Again
        </button>
      </div>
    );
  }

  if (compare.length === 0) {
    return (
      <div className="container">
        <h2>No vehicles selected for comparison.</h2>
        <p>Open a vehicle's details and click Compare to add it here.</p>
      </div>
    );
  }

  if (compare.length === 1) {
    return (
      <div className="container">
        <h2>Select one more vehicle to compare.</h2>

        <div className="compare-preview">
          <h3>
            {compare[0].brand} {compare[0].model}
          </h3>

          <img
            src={compare[0].image || "/images/defaultcar.jpg"}
            alt={`${compare[0].brand} ${compare[0].model}`}
            width="180"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = "/images/defaultcar.jpg";
            }}
          />

          <p>₹ {formatPrice(compare[0].price)}</p>

          <button onClick={() => removeVehicle(compare[0].id)}>
            Remove
          </button>
        </div>
      </div>
    );
  }

  const [v1, v2] = compare;

  const rows = [
    ["Brand", v1.brand, v2.brand],
    ["Model", v1.model, v2.model],
    ["Type", v1.type, v2.type],
    ["Year", v1.year ?? "Not specified", v2.year ?? "Not specified"],
    ["Price", `₹ ${formatPrice(v1.price)}`, `₹ ${formatPrice(v2.price)}`],
    ["Fuel", v1.fuel || "Not specified", v2.fuel || "Not specified"],
    [
      "Transmission",
      v1.transmission || "Not specified",
      v2.transmission || "Not specified",
    ],
    [
      "KM Driven",
      formatNumber(v1.kilometers),
      formatNumber(v2.kilometers),
    ],
    [
      "Owners",
      v1.owners ?? "Not specified",
      v2.owners ?? "Not specified",
    ],
    [
      "Location",
      v1.location || "Not specified",
      v2.location || "Not specified",
    ],
    [
      "Color",
      v1.color || "Not specified",
      v2.color || "Not specified",
    ],
  ];

  return (
    <div className="container">
      <h1>Compare Vehicles</h1>

      <table className="compare-table">
        <tbody>
          <tr>
            <th>Image</th>

            {[v1, v2].map((vehicle) => (
              <td key={vehicle.id}>
                <img
                  src={vehicle.image || "/images/defaultcar.jpg"}
                  alt={`${vehicle.brand} ${vehicle.model}`}
                  width="180"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = "/images/defaultcar.jpg";
                  }}
                />
              </td>
            ))}
          </tr>

          {rows.map(([label, value1, value2]) => (
            <tr key={label}>
              <th>{label}</th>
              <td>{value1}</td>
              <td>{value2}</td>
            </tr>
          ))}

          <tr>
            <th>Action</th>
            <td>
              <button onClick={() => removeVehicle(v1.id)}>
                Remove
              </button>
            </td>
            <td>
              <button onClick={() => removeVehicle(v2.id)}>
                Remove
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default Compare;
