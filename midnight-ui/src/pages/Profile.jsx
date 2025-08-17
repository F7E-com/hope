import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/utils/firebase";
import { useUser } from "../contexts/UserContext";

export default function Profile() {
  const { uid } = useParams();
  const { currentUser } = useUser();

  const [user, setUser] = useState(currentUser || null);
  const [loading, setLoading] = useState(!currentUser);

  useEffect(() => {
    // If we already have the user in context, and it matches the route param, use it
    if (currentUser && (!uid || uid === currentUser.id)) {
      setUser(currentUser);
      setLoading(false);
      return;
    }

    // Otherwise, fetch from Firestore
    if (uid) {
      const fetchUser = async () => {
        try {
          const userRef = doc(db, "users", uid);
          const snapshot = await getDoc(userRef);

          if (snapshot.exists()) {
            setUser({ id: uid, ...snapshot.data() });
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
    } else {
      setLoading(false);
    }
  }, [uid, currentUser]);

  if (loading) return <p>Loading...</p>;
  if (!user) return <p>User not found or not logged in.</p>;

  return (
    <div style={{ maxWidth: "600px", margin: "auto", padding: "1rem" }}>
      <h1>{user.name}</h1>
      <p>
        <strong>Faction:</strong> {user.faction}
      </p>

      <div style={{ marginTop: "1rem" }}>
        <h2>Kudos</h2>
        <ul>
          {Object.entries(user.kudos || {}).map(([factionName, points]) => (
            <li key={factionName}>
              <strong>{factionName}:</strong> {points}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
