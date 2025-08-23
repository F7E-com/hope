// ...imports stay the same

// Faction blurbs with duties
const FACTION_INFO = {
  Government: "Oversees the nation's policies and security. Duties: Legislating, Enforcing laws, Coordinating agencies.",
  Infrastructure: "Builds and maintains public works. Duties: Roads, Bridges, Utilities.",
  Security: "Protects citizens and assets. Duties: Policing, Cybersecurity, Emergency response.",
  Commerce: "Drives trade and business growth. Duties: Market regulation, Taxation, Trade agreements.",
  Industry: "Manages manufacturing and production. Duties: Factories, Supply chains, Resource management.",
  Research: "Advances knowledge and technology. Duties: Experiments, Analysis, Innovation.",
  Background: "Supports behind-the-scenes functions. Duties: Logistics, Documentation, Operations.",
};

export default function NewUser() {
  // ...existing state hooks

  return (
    <div style={{ maxWidth: "400px", margin: "auto", padding: "1rem" }}>
      <h2>User Login / Sign Up</h2>

      {/* Optional User ID box at top */}
      <label>User ID (optional)</label>
      <input
        style={{ color: "black", marginBottom: "1rem" }}
        type="text"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
        placeholder="Enter User ID to login or sign up"
      />
      <br />

      <label>Name:</label>
      <input
        style={{ color: "black" }}
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter your name"
      />
      <br />

      <label>Faction:</label>
      <select
        style={{ color: "black" }}
        value={faction}
        onChange={(e) => setFaction(e.target.value)}
      >
        {Object.keys(FACTION_INFO).map((f) => (
          <option key={f} value={f}>{f}</option>
        ))}
      </select>
      <br />

      {/* Faction description */}
      <p style={{ fontSize: "0.9rem", color: "#444", marginTop: "0.5rem" }}>
        {FACTION_INFO[faction]}
      </p>

      <div style={{ marginTop: "1rem" }}>
        <button onClick={handleAutoID}>Create User (Auto-ID)</button>
        <button onClick={handleCustomID} style={{ marginLeft: "1rem" }}>
          Create User (Custom ID)
        </button>
      </div>

      <div style={{ marginTop: "1rem" }}>
        <button onClick={handleLogin}>Login</button>
      </div>

      {message && <p style={{ marginTop: "1rem" }}>{message}</p>}
    </div>
  );
}
