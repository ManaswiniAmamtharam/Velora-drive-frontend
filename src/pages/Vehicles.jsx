import { useState, useMemo, useEffect } from "react";
import VehicleCard from "../components/VehicleCard";
import SearchBar from "../components/SearchBar";
import FilterSidebar from "../components/FilterSidebar";
import Loading from "../components/Loading";
import { apiFetch } from "../services/api";
import "../components/VehicleCard.css";

function Vehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [search, setSearch] = useState("");

  const [type, setType] = useState("");
  const [fuel, setFuel] = useState("");
  const [transmission, setTransmission] = useState("");
  const [year, setYear] = useState("");
  const [city, setCity] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const [sort, setSort] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const vehiclesPerPage = 8;

  // Fetch vehicles from Spring Boot
  useEffect(() => {
    let active = true;

    async function loadVehicles() {
      try {
        setLoading(true);
        setError("");

        const data = await apiFetch("/vehicles");

        if (active) {
          setVehicles(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        if (active) {
          setError(
            err.message ||
              "Unable to load vehicles. Please try again."
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadVehicles();

    return () => {
      active = false;
    };
  }, []);

  const filteredVehicles = useMemo(() => {
    let filtered = [...vehicles];

    filtered = filtered.filter((v) =>
      `${v.brand ?? ""} ${v.model ?? ""} ${v.location ?? ""}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );

    if (type) {
      filtered = filtered.filter(
        (v) => v.type === type
      );
    }

    if (fuel) {
      filtered = filtered.filter(
        (v) => v.fuel === fuel
      );
    }

    if (transmission) {
      filtered = filtered.filter(
        (v) => v.transmission === transmission
      );
    }

    if (year) {
      filtered = filtered.filter(
        (v) => String(v.year) === year
      );
    }

    if (city) {
      filtered = filtered.filter(
        (v) => v.location === city
      );
    }

    if (minPrice !== "") {
      filtered = filtered.filter(
        (v) => Number(v.price) >= Number(minPrice)
      );
    }

    if (maxPrice !== "") {
      filtered = filtered.filter(
        (v) => Number(v.price) <= Number(maxPrice)
      );
    }

    switch (sort) {
      case "low":
        filtered.sort(
          (a, b) => Number(a.price) - Number(b.price)
        );
        break;

      case "high":
        filtered.sort(
          (a, b) => Number(b.price) - Number(a.price)
        );
        break;

      case "new":
        filtered.sort(
          (a, b) => Number(b.year) - Number(a.year)
        );
        break;

      case "old":
        filtered.sort(
          (a, b) => Number(a.year) - Number(b.year)
        );
        break;

      case "kmLow":
        filtered.sort(
          (a, b) =>
            Number(a.kilometers ?? 0) -
            Number(b.kilometers ?? 0)
        );
        break;

      case "kmHigh":
        filtered.sort(
          (a, b) =>
            Number(b.kilometers ?? 0) -
            Number(a.kilometers ?? 0)
        );
        break;

      default:
        break;
    }

    return filtered;
  }, [
    vehicles,
    search,
    type,
    fuel,
    transmission,
    year,
    city,
    minPrice,
    maxPrice,
    sort,
  ]);

  // Keep pagination valid when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [
    search,
    type,
    fuel,
    transmission,
    year,
    city,
    minPrice,
    maxPrice,
    sort,
  ]);

  const totalPages = Math.ceil(
    filteredVehicles.length / vehiclesPerPage
  );

  const indexOfLast = currentPage * vehiclesPerPage;
  const indexOfFirst = indexOfLast - vehiclesPerPage;

  const currentVehicles = filteredVehicles.slice(
    indexOfFirst,
    indexOfLast
  );

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="container">
        <h1>Buy Vehicles</h1>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>Buy Vehicles</h1>

      <SearchBar
        search={search}
        setSearch={setSearch}
      />

      <div className="layout">
        <FilterSidebar
          type={type}
          setType={setType}
          fuel={fuel}
          setFuel={setFuel}
          transmission={transmission}
          setTransmission={setTransmission}
          year={year}
          setYear={setYear}
          city={city}
          setCity={setCity}
          minPrice={minPrice}
          setMinPrice={setMinPrice}
          maxPrice={maxPrice}
          setMaxPrice={setMaxPrice}
          sort={sort}
          setSort={setSort}
        />

        <div className="vehicle-section">
          <p>{filteredVehicles.length} vehicles found</p>

          {filteredVehicles.length === 0 ? (
            <h3>
              No vehicles found. Try changing your filters.
            </h3>
          ) : (
            <>
              <div className="grid">
                {currentVehicles.map((vehicle) => (
                  <VehicleCard
                    key={vehicle.id}
                    vehicle={{
                      ...vehicle,
                      price: Number(vehicle.price ?? 0),
                      kilometers: Number(
                        vehicle.kilometers ?? 0
                      ),
                    }}
                  />
                ))}
              </div>

              <div className="pagination">
                <button
                  disabled={currentPage === 1}
                  onClick={() =>
                    setCurrentPage((page) => page - 1)
                  }
                >
                  Previous
                </button>

                <span>
                  Page {currentPage} of {totalPages}
                </span>

                <button
                  disabled={currentPage === totalPages}
                  onClick={() =>
                    setCurrentPage((page) => page + 1)
                  }
                >
                  Next
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Vehicles;