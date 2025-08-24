import React, { useState } from "react";
import { collection, addDoc, doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "@/utils/firebase";
import { useUser } from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";

const initialKudos = {
  Government: 0, Infrastructure: 0, Security: 0,
  Commerce: 0, Industry: 0, Research: 0,
  Intelligence: 0, Populace: 0,
};

export default function NewUser() {
  const [name, setName] = useState("");
  const [faction, setFaction] = useState("Government");
  const [userId, setUserId] = useState("");
  const [message, setMessage] = useState("");

  const { setCurrentUser } = useUser();
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!userId) return setMessage("Enter your user ID to login.");
    try {
      setMessage("Logging in...");
      const docRef = doc(db, "users", userId);
      const snapshot = await getDoc(docRef);
      if (!snapshot.exists()) return setMessage("No such user found.");

      const data = snapshot.data();
      const userObj = { id: userId, ...data };
      setCurrentUser(userObj);

      // Slight delay ensures context updates
      setTimeout(() => navigate(`/profile/${userId}`), 50);
      setMessage(`Logged in as ${data.name} (Faction: ${data.faction})`);
    } catch (err) {
      console.error(err);
      setMessage("Login failed.");
    }
  };

  const handleAutoID = async () => {
    if (!name) return setMessage("Please enter a name.");
    try {
      const docRef = await addDoc(collection(db, "users"), {
        name, faction, kudos: initialKudos
      });
      setMessage(`User created with auto-ID: ${docRef.id}`);
    } catch (err) {
      console.error(err);
      setMessage("Error creating user.");
    }
  };

  const handleCustomID = async () => {
    if (!name || !userId) return setMessage("Enter both name and custom ID.");
    try {
      await setDoc(doc(db, "users", userId), {
        name, faction, kudos: initialKudos
      });
      setMessage(`User created with custom ID: ${userId}`);
    } catch (err) {
      console.error(err);
      setMessage("Error creating user.");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "auto", padding: "1rem" }}>
      <h2>User Login / Sign Up</h2>
      <label>User ID (optional)</label>
      <input
        style={{ color: "black", marginBottom: "1rem" }}
        type="text" value={userId}
        onChange={(e) => setUserId(e.target.value)}
        placeholder="Enter User ID to login or sign up"
      />
      <br />
      <label>Name:</label>
      <input
        style={{ color: "black" }} type="text" value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter your name"
      />
      <br />
      <label>Faction:</label>
      <select style={{ color: "black" }} value={faction} onChange={(e) => setFaction(e.target.value)}>
        <option value="Government">Government</option>
        <option value="Infrastructure">Infrastructure</option>
        <option value="Security">Security</option>
        <option value="Commerce">Commerce</option>
        <option value="Industry">Industry</option>
        <option value="Research">Research</option>
        <option value="Intelligence">Intelligence</option>
        <option value="Populace">Populace</option>
      </select>
      <br />
      <div style={{ marginTop: "1rem" }}>
        <button onClick={handleAutoID}>Create User (Auto-ID)</button>
        <button onClick={handleCustomID} style={{ marginLeft: "1rem" }}>Create User (Custom ID)</button>
      </div>
      <div style={{ marginTop: "1rem" }}>
        <button onClick={handleLogin}>Login</button>
      </div>
      {message && <p style={{ marginTop: "1rem" }}>{message}</p>}
    </div>
  );
}
