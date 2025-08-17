import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/utils/firebase";

export default function Profile() {
  const { uid } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!uid) return;

    const fetchUser = async () => {
      try {
        const userRef = doc(db, "users", uid);
        const snapshot = await getDoc(userRef);

        if (snapshot.exists()) {
          setUser(snapshot.data());
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [uid]);

  if (loading) return <p>Loading...</p>;
  if (!user) return <p>User not found.</p>;

  return (
    <div style={{ maxWidth: "600px", margin: "auto", padding: "1rem" }}>
      <h1>{user.name}</h1>
      <p><strong>Faction:</strong> {user.faction}</p>

      <div style={{ marginTop: "1rem" }}>
        <h2>Kudos</h2>
        <ul>
          {Object.entries(user.kudos).map(([factionName, points]) => (
            <li key={factionName}>
              <strong>{factionName}:</strong> {points}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
