function FilterSidebar({
  type, setType,
  fuel, setFuel,
  transmission, setTransmission,
  year, setYear,
  city, setCity,
  minPrice, setMinPrice,
  maxPrice, setMaxPrice,
  sort, setSort
}) {

  return (
    <div className="filter-box">

      <h2>Filters</h2>

      <select value={type} onChange={(e)=>setType(e.target.value)}>
        <option value="">Vehicle Type</option>
        <option>SUV</option>
        <option>Sedan</option>
        <option>Hatchback</option>
        <option>Bike</option>
      </select>

      <select value={fuel} onChange={(e)=>setFuel(e.target.value)}>
        <option value="">Fuel</option>
        <option>Petrol</option>
        <option>Diesel</option>
        <option>Electric</option>
        <option>CNG</option>
      </select>

      <select
        value={transmission}
        onChange={(e)=>setTransmission(e.target.value)}
      >
        <option value="">Transmission</option>
        <option>Manual</option>
        <option>Automatic</option>
        <option>CVT</option>
      </select>

      <select value={year} onChange={(e)=>setYear(e.target.value)}>
        <option value="">Year</option>
        <option>2024</option>
        <option>2023</option>
        <option>2022</option>
        <option>2021</option>
        <option>2020</option>
      </select>

      <select value={city} onChange={(e)=>setCity(e.target.value)}>
        <option value="">City</option>
        <option>Hyderabad</option>
        <option>Bangalore</option>
        <option>Chennai</option>
        <option>Mumbai</option>
        <option>Delhi</option>
      </select>

      <input
        type="number"
        placeholder="Minimum Price"
        value={minPrice}
        onChange={(e)=>setMinPrice(e.target.value)}
      />

      <input
        type="number"
        placeholder="Maximum Price"
        value={maxPrice}
        onChange={(e)=>setMaxPrice(e.target.value)}
      />

      <select value={sort} onChange={(e)=>setSort(e.target.value)}>
        <option value="">Sort By</option>
        <option value="low">Price Low → High</option>
        <option value="high">Price High → Low</option>
        <option value="new">Newest</option>
        <option value="old">Oldest</option>
        <option value="kmLow">Lowest KM</option>
        <option value="kmHigh">Highest KM</option>
      </select>

    </div>
  );
}

export default FilterSidebar;