// SearchBar.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("users"); // default dropdown
  const navigate = useNavigate();

  function handleSearch() {
    if (!query.trim()) return;

    let path = "/";
    switch (category) {
      case "users":
        path = `/profile/${query.trim()}`;
        break;
      case "posts":
        path = `/post/${query.trim()}`;
        break;
      case "creators":
        path = `/creator/${query.trim()}`;
        break;
      default:
        path = "/";
    }

    navigate(path);
  }

  return (
    <div style={{ display: "flex", gap: "0.5rem" }}>
      <input
        type="text"
        placeholder="Search..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{ flexGrow: 1, padding: "0.5rem" }}
      />
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        style={{ padding: "0.5rem" }}
      >
        <option value="users">Users</option>
        <option value="posts">Posts</option>
        <option value="creators">Creators</option>
      </select>
      <button
        onClick={handleSearch}
        style={{ padding: "0.5rem 1rem" }}
      >
        Search
      </button>
    </div>
  );
}
