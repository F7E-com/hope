import React, { useState } from "react";

export default function Search() {
  const [query, setQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    alert(`Searching for "${query}"... (not implemented yet)`);
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Search Page</h1>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Type something..."
          style={{ padding: "0.5rem", width: "250px", marginRight: "0.5rem" }}
        />
        <button type="submit" style={{ padding: "0.5rem 1rem" }}>Search</button>
      </form>
      <p>Search results will appear here.</p>
    </div>
  );
}
// This page is a placeholder for future search functionality.