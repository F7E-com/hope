import React, { useState } from "react";
import { collection, addDoc, doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "@/utils/firebase"; // your Firebase initialization
import { useUser } from "../contexts/UserContext"; // adjust path if needed
import { useNavigate } from "react-router-dom";

// Default Kudos object for new users
const initialKudos = {
  Government: 0,
  Infrastructure: 0,
  Security: 0,
  Commerce: 0,
  Industry: 0,
  Research: 0,
  Background: 0,
};

// Faction blurbs with duties
const FACTION_INFO = {
  Government:
    "Oversees the nation's policies and security. Duties: Legislating, Enforcing laws, Coordinating agencies.",
  Infrastructure:
    "Builds and maintains public works. Duties: Roads, Bridges, Utilities.",
  Security:
    "Protects citizens and assets. Duties: Policing, Cybersecurity, Emergency response.",
  Commerce:
    "Drives trade and business growth. Duties: Market regulation, Taxation, Trade agreements.",
  Industry:
    "Manages manufacturing and production. Duties: Factories, Supply chains, Resource management.",
  Research:
    "Advances knowledge and technology. Duties: Experiments, Analysis, Innovation.",
  Background:
    "Supports behind-the-scenes functions. Duties: Logistics, Documentation, Operations.",
};

export default function NewUser() {
  const [name, setName] = useState("");
  const [faction, setFaction] = useState("Government"); // default
  const [userId, setUserId] = useState(""); // optional custom ID
  const [message, setMessage] = useState("");

  const { setCurrentUser } = useUser();
  const navigate = useNavigate();

  // Auto-ID version
  const handleAutoID = async () => {
    if (!name) return setMessage("Please enter a name.");
    try {
      const docRef = await addDoc(collection(db, "users"), {
        name,
        faction,
        kudos: initialKudos,
      });
      setMessage(`User created with auto-ID: ${docRef.id}`);
    } catch (error) {
      console.error(error);
      setMessage("Error creating user.");
    }
  };

  // Custom-ID version
  const handleCustomID = async () => {
    if (!name || !userId) return setMessage("Enter both name and custom ID.");
    try {
      await setDoc(doc(db, "users", userId), {
        name,
        faction,
        kudos: initialKudos,
      });
      setMessage(`User created with custom ID: ${userId}`);
    } catch (error) {
      console.error(error);
      setMessage("Error creating user.");
    }
  };

  // Login
  const handleLogin = async () => {
    if (!userId) return setMessage("Enter your user ID to login.");
    try {
      const docRef = doc(db, "users", userId);
      const snapshot = await getDoc(docRef);

      if (snapshot.exists()) {
        const data = snapshot.data();
        setCurrentUser({ id: userId, ...data });
        setMessage(`Logged in as ${data.name} (Faction: ${data.faction})`);
        navigate(`/profile/${userId}`);
      } else {
        setMessage("No such user found.");
      }
    } catch (error) {
      console.error(error);
      setMessage("Login failed.");
    }
  };

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
          <option key={f} value={f}>
            {f}
          </option>
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
