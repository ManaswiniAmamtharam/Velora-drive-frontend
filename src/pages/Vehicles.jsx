import { useState, useMemo, useEffect } from "react";
import vehicles from "../data/vehicles";
import VehicleCard from "../components/VehicleCard";
import SearchBar from "../components/SearchBar";
import FilterSidebar from "../components/FilterSidebar";
import Loading from "../components/Loading";
import "../components/VehicleCard.css";

function Vehicles() {
  // Search
  const [search, setSearch] = useState("");

  // Filters
  const [type, setType] = useState("");
  const [fuel, setFuel] = useState("");
  const [transmission, setTransmission] = useState("");
  const [year, setYear] = useState("");
  const [city, setCity] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  // Sort
  const [sort, setSort] = useState("");

  // Loading
  const [loading, setLoading] = useState(true);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const vehiclesPerPage = 8;

  // Loading Effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  // Filter + Sort
  const filteredVehicles = useMemo(() => {
    let filtered = [...vehicles];

    // Search
    filtered = filtered.filter((v) =>
      `${v.brand} ${v.model} ${v.location}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );

    // Type
    if (type) filtered = filtered.filter((v) => v.type === type);

    // Fuel
    if (fuel) filtered = filtered.filter((v) => v.fuel === fuel);

    // Transmission
    if (transmission)
      filtered = filtered.filter(
        (v) => v.transmission === transmission
      );

    // Year
    if (year)
      filtered = filtered.filter((v) => String(v.year) === year);

    // City
    if (city)
      filtered = filtered.filter((v) => v.location === city);

    // Price
    if (minPrice !== "")
      filtered = filtered.filter(
        (v) => v.price >= Number(minPrice)
      );

    if (maxPrice !== "")
      filtered = filtered.filter(
        (v) => v.price <= Number(maxPrice)
      );

    // Sorting
    switch (sort) {
      case "low":
        filtered.sort((a, b) => a.price - b.price);
        break;

      case "high":
        filtered.sort((a, b) => b.price - a.price);
        break;

      case "new":
        filtered.sort((a, b) => b.year - a.year);
        break;

      case "old":
        filtered.sort((a, b) => a.year - b.year);
        break;

      case "kmLow":
        filtered.sort(
          (a, b) => a.kilometers - b.kilometers
        );
        break;

      case "kmHigh":
        filtered.sort(
          (a, b) => b.kilometers - a.kilometers
        );
        break;

      default:
        break;
    }

    return filtered;
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

  // Pagination
  const totalPages = Math.ceil(
    filteredVehicles.length / vehiclesPerPage
  );

  const indexOfLast = currentPage * vehiclesPerPage;
  const indexOfFirst = indexOfLast - vehiclesPerPage;

  const currentVehicles = filteredVehicles.slice(
    indexOfFirst,
    indexOfLast
  );

  // IMPORTANT: Loading return comes AFTER all hooks
  if (loading) {
    return <Loading />;
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
          <p>
            {filteredVehicles.length} vehicles found
          </p>

          {filteredVehicles.length === 0 ? (
            <h3>
              No vehicles found. Try changing your
              filters.
            </h3>
          ) : (
            <>
              <div className="grid">
                {currentVehicles.map((vehicle) => (
                  <VehicleCard
                    key={vehicle.id}
                    vehicle={vehicle}
                  />
                ))}
              </div>

              <div className="pagination">
                <button
                  disabled={currentPage === 1}
                  onClick={() =>
                    setCurrentPage(currentPage - 1)
                  }
                >
                  Previous
                </button>

                <span>
                  Page {currentPage} of {totalPages}
                </span>

                <button
                  disabled={
                    currentPage === totalPages
                  }
                  onClick={() =>
                    setCurrentPage(currentPage + 1)
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