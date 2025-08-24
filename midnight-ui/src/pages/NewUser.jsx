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
  Intelligence: 0,
  Populace: 0,
};

// Expanded Faction info
const FACTION_INFO = {
  Government: {
    title: "Government",
    description:
      "The shining faces of the city’s elected best, ready to make the hard decision or show newcomers around with a sincere smile.",
    colors: "White / Black",
    theme: "Black & White marble, polished floors; courts",
    focus: "Community",
    duties: [
      "Creating Community Guidelines",
      "Proposing polls and policy alterations",
      "Event hosting & announcements",
      "Greeting & orienting new users",
    ],
  },
  Infrastructure: {
    title: "Infrastructure",
    description:
      "Retro City’s builders and construction crews - not to mention parks & rec. Responsible for maintaining easy traffic and redesigning workflows.",
    colors: "Blue / Yellow",
    theme: "Website",
    focus: "Structure & Maintenance",
    duties: [
      "Community event planning & structure",
      "Bug reporting / on-the-fly fixes",
      "Website/platform updates and upgrades",
      "Flagging/removing unsafe content",
    ],
  },
  Security: {
    title: "Security",
    description:
      "Hard at attention, the city’s security officers stand ready to keep the peace…or help neutralize threats with honor and aplomb.",
    colors: "Blue / Grey",
    theme: "Panels, wiring, a bit scuffed",
    focus: "Peacekeeping",
    duties: [
      "Public security",
      "Conflict resolution",
      "Community standards enforcement",
    ],
  },
  Commerce: {
    title: "Commerce",
    description:
      "All things that glitter may not be gold, but they can still turn a profit - that’s the saying behind the revolving glass doors of Retro City’s wealthy elite.",
    colors: "Gold",
    theme: "Splendor, Grandeur, Business",
    focus: "Revenue",
    duties: ["Product standards", "Focus groups", "Fundraising", "Marketing"],
  },
  Industry: {
    title: "Industry",
    description:
      "All metals have their foundry, and Retro City’s rivets are in good hands - greasy, but strong & capable - with the Industry. They always heed the call of a new project; if it ain't broke, it could always use a few additions… and when in doubt, hit it with a wrench.",
    colors: "Red / Russet / Orange",
    theme: "Foundry / Factory",
    focus: "Open Projects",
    duties: [
      "In-progress project hosting and organization",
      "Platform updates",
      "Open-source firmware & plugins (?)",
    ],
  },
  Research: {
    title: "Research",
    description:
      "One hesitates to speak in the glossy white hallways of the Scribes. Once all smoke and crystal balls, the Mages’ Guild has become an austere academy - a monolith - where silence is key, and the unknown become known.",
    colors: "Cyan / White",
    theme: "Reductionist future",
    focus: "Development",
    duties: [
      "It Could Be Better platform feature meetings",
      "Polls and statistics",
      "Record keeping and organization",
    ],
  },
  Intelligence: {
    title: "Intelligence",
    description:
      "The unsung heroes of the night. Faction Seven is always watching - if you see a problem, chances are they're already on it.",
    colors: "Black / Purple",
    theme: "Sleek cyberpunk / dark metal",
    focus: "Normalcy",
    duties: [
      "Gathering community intel",
      "Handling problems before they arise",
      "Remaining elusive",
    ],
  },
  Populace: {
    title: "Populace",
    description:
      "Not everyone wants to get their hands dirty or make a whole production out of it, and that's fine - just hang out, post your art, and enjoy!",
    colors: "Red / Green / Blue / Yellow",
    theme: "Any",
    focus: "Having Fun",
    duties: ["Hanging out", "Posting art", "Enjoying the community"],
  },
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
      <div
        style={{
          fontSize: "0.9rem",
          color: "#444",
          marginTop: "0.5rem",
          padding: "0.5rem",
          border: "1px solid #ccc",
          borderRadius: "6px",
        }}
      >
        <strong>{FACTION_INFO[faction].title}</strong>
        <p>{FACTION_INFO[faction].description}</p>
        <p>
          <strong>Theme:</strong> {FACTION_INFO[faction].theme}
        </p>
        <p>
          <strong>Focus:</strong> {FACTION_INFO[faction].focus}
        </p>
        <ul style={{ margin: "0.5rem 0 0 1.2rem" }}>
          {FACTION_INFO[faction].duties.map((duty, idx) => (
            <li key={idx}>{duty}</li>
          ))}
        </ul>
      </div>

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
