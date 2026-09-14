function SearchBar({ search, setSearch }) {
  return (
    <input
      type="text"
      placeholder="Search by brand, model or location..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="search-input"
    />
  );
}

export default SearchBar;