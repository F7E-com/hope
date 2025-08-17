// Profile.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/utils/firebase";
import BioBox from "../components/BioBox";
import { useUser } from "../contexts/UserContext";

export default function Profile() {
  const { currentUser } = useUser();
  const { uid } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bio, setBio] = useState("");
  const [themeColor, setThemeColor] = useState("#222222");
  const [editing, setEditing] = useState(false);
  const [bannerInput, setBannerInput] = useState("");

  useEffect(() => {
    if (!uid) return;

    const fetchUser = async () => {
      try {
        const userRef = doc(db, "users", uid);
        const snapshot = await getDoc(userRef);

        if (snapshot.exists()) {
          const data = snapshot.data();
          setUser(data);
          setBio(data.bio || "");
          setThemeColor(data.themeColor || "#222222");
          setBannerInput(data.bannerUrl || "");
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

  const handleThemeChange = async (newColor) => {
    try {
      const userRef = doc(db, "users", uid);
      await updateDoc(userRef, { themeColor: newColor });
      setThemeColor(newColor);
    } catch (err) {
      console.error("Error updating theme color:", err);
    }
  };

  const handleBioSave = async (newBio) => {
    try {
      const userRef = doc(db, "users", uid);
      await updateDoc(userRef, { bio: newBio });
      setBio(newBio);
    } catch (err) {
      console.error("Error saving bio:", err);
    }
  };

  const handleBannerSave = async () => {
    try {
      const userRef = doc(db, "users", uid);
      await updateDoc(userRef, { bannerUrl: bannerInput });
      setUser((prev) => ({ ...prev, bannerUrl: bannerInput }));
    } catch (err) {
      console.error("Error saving banner:", err);
    }
  };

  const isOwner = currentUser && currentUser.id === uid;

  return (
    <div
      style={{
        maxWidth: "900px",
        margin: "2rem auto",
        padding: "1rem",
        background: "#111",
        color: "#fff",
        borderRadius: "12px",
      }}
    >
      {/* Banner */}
      <div
        style={{
          width: "100%",
          height: "200px",
          borderRadius: "12px",
          marginBottom: "1rem",
          background: user.bannerUrl
            ? `url(${user.bannerUrl}) center/cover`
            : themeColor,
          position: "relative",
        }}
      >
        {editing && isOwner && (
          <div
            style={{
              position: "absolute",
              bottom: "0",
              left: "0",
              right: "0",
              padding: "0.5rem",
              background: "rgba(0,0,0,0.6)",
              display: "flex",
              gap: "0.5rem",
              alignItems: "center",
            }}
          >
            <input
              color={{ black }}
              type="text"
              placeholder="Banner image URL"
              value={bannerInput}
              onChange={(e) => setBannerInput(e.target.value)}
              style={{ flex: 1, padding: "0.25rem" }}
            />
            <button onClick={handleBannerSave} style={{ padding: "0.25rem 0.5rem" }}>
              Save
            </button>
          </div>
        )}
      </div>

      {/* Two-column layout */}
      <div style={{ display: "flex", gap: "2rem" }}>
        {/* Kudos box */}
        <div
          style={{
            flex: "1",
            background: "#222",
            padding: "1rem",
            borderRadius: "8px",
          }}
        >
          <h2>Kudos</h2>
          <ul>
            {user.kudos &&
              Object.entries(user.kudos).map(([factionName, points]) => (
                <li key={factionName}>
                  <strong>{factionName}:</strong> {points}
                </li>
              ))}
          </ul>
        </div>

        {/* Profile info */}
        <div style={{ flex: "2" }}>
          <h1 style={{ marginBottom: "0.5rem" }}>{user.name}</h1>
          <p>
            <strong>Faction:</strong> {user.faction}
          </p>

          <BioBox
            initialBio={bio}
            editable={editing && isOwner}
            themeColor={themeColor}
            onSave={handleBioSave}
          />

          {editing && isOwner && (
            <div style={{ marginTop: "0.5rem" }}>
              <label>
                Theme Color:{" "}
                <input
                  type="color"
                  value={themeColor}
                  onChange={(e) => handleThemeChange(e.target.value)}
                />
              </label>
              <br />
              <button
                style={{ marginTop: "0.5rem", padding: "0.5rem 1rem" }}
                onClick={() => setEditing(false)}
              >
                Done Editing
              </button>
            </div>
          )}

          {!editing && isOwner && (
            <button
              style={{ marginTop: "0.5rem", padding: "0.5rem 1rem" }}
              onClick={() => setEditing(true)}
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
