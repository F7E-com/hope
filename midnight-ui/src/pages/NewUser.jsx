import React, { useState } from "react";
import { collection, addDoc, doc, setDoc } from "firebase/firestore";
import { db } from "../firebase"; // your Firebase initialization

// Default Kudos object for new users
const initialKudos = {
  Government: 0,
    Infrastructure: 0,
      Security: 0,
        Commerce: 0,
          Industry: 0,
            Research: 0,
              Background: 0
              };

              function NewUser() {
                const [name, setName] = useState("");
                  const [faction, setFaction] = useState("Government"); // default
                    const [userId, setUserId] = useState(""); // optional custom ID
                      const [message, setMessage] = useState("");

                        // Auto-ID version
                          const handleAutoID = async () => {
                              if (!name) return setMessage("Please enter a name.");
                                  try {
                                        const docRef = await addDoc(collection(db, "users"), {
                                                name,
                                                        faction,
                                                                kudos: initialKudos
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
                                                                                                                                            kudos: initialKudos
                                                                                                                                                  });
                                                                                                                                                        setMessage(`User created with custom ID: ${userId}`);
                                                                                                                                                            } catch (error) {
                                                                                                                                                                  console.error(error);
                                                                                                                                                                        setMessage("Error creating user.");
                                                                                                                                                                            }
                                                                                                                                                                              };

                                                                                                                                                                                return (
                                                                                                                                                                                    <div style={{ maxWidth: "400px", margin: "auto", padding: "1rem" }}>
                                                                                                                                                                                          <h2>Create New User</h2>
                                                                                                                                                                                                
                                                                                                                                                                                                      <label>Name:</label>
                                                                                                                                                                                                            <input
                                                                                                                                                                                                                    type="text"
                                                                                                                                                                                                                            value={name}
                                                                                                                                                                                                                                    onChange={(e) => setName(e.target.value)}
                                                                                                                                                                                                                                            placeholder="Enter your name"
                                                                                                                                                                                                                                                  />

                                                                                                                                                                                                                                                        <label>Faction:</label>
                                                                                                                                                                                                                                                              <select value={faction} onChange={(e) => setFaction(e.target.value)}>
                                                                                                                                                                                                                                                                      <option value="Government">Government</option>
                                                                                                                                                                                                                                                                              <option value="Infrastructure">Infrastructure</option>
                                                                                                                                                                                                                                                                                      <option value="Security">Security</option>
                                                                                                                                                                                                                                                                                              <option value="Commerce">Commerce</option>
                                                                                                                                                                                                                                                                                                      <option value="Industry">Industry</option>
                                                                                                                                                                                                                                                                                                              <option value="Research">Research</option>
                                                                                                                                                                                                                                                                                                                      <option value="Background">Background</option>
                                                                                                                                                                                                                                                                                                                            </select>

                                                                                                                                                                                                                                                                                                                                  <label>Custom ID (optional):</label>
                                                                                                                                                                                                                                                                                                                                        <input
                                                                                                                                                                                                                                                                                                                                                type="text"
                                                                                                                                                                                                                                                                                                                                                        value={userId}
                                                                                                                                                                                                                                                                                                                                                                onChange={(e) => setUserId(e.target.value)}
                                                                                                                                                                                                                                                                                                                                                                        placeholder="Optional custom ID"
                                                                                                                                                                                                                                                                                                                                                                              />

                                                                                                                                                                                                                                                                                                                                                                                    <div style={{ marginTop: "1rem" }}>
                                                                                                                                                                                                                                                                                                                                                                                            <button onClick={handleAutoID}>Create User (Auto-ID)</button>
                                                                                                                                                                                                                                                                                                                                                                                                    <button onClick={handleCustomID} style={{ marginLeft: "1rem" }}>
                                                                                                                                                                                                                                                                                                                                                                                                              Create User (Custom ID)
                                                                                                                                                                                                                                                                                                                                                                                                                      </button>
                                                                                                                                                                                                                                                                                                                                                                                                                            </div>

                                                                                                                                                                                                                                                                                                                                                                                                                                  {message && <p style={{ marginTop: "1rem" }}>{message}</p>}
                                                                                                                                                                                                                                                                                                                                                                                                                                      </div>
                                                                                                                                                                                                                                                                                                                                                                                                                                        );
                                                                                                                                                                                                                                                                                                                                                                                                                                        }

                                                                                                                                                                                                                                                                                                                                                                                                                                        export default NewUser;