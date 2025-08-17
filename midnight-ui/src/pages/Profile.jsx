// Profile.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/utils/firebase";
import BioBox from "../components/BioBox";
import { useUser } from "../contexts/UserContext";

export default function Profile() {
  const { uid } = useParams();
  const { currentUser } = useUser();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bio, setBio] = useState("");
  const [themeColor, setThemeColor] = useState("#222222");
  const [bannerUrl, setBannerUrl] = useState("");
  const [editing, setEditing] = useState(false);

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
          setBannerUrl(data.bannerUrl || "");
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

  const handleSaveBio = async (newBio) => {
    try {
      const userRef = doc(db, "users", uid);
      await updateDoc(userRef, { bio: newBio });
      setBio(newBio);
    } catch (err) {
      console.error("Error saving bio:", err);
    }
  };

  const handleSaveTheme = async (newColor) => {
    try {
      const userRef = doc(db, "users", uid);
      await updateDoc(userRef, { themeColor: newColor });
      setThemeColor(newColor);
    } catch (err) {
      console.error("Error updating theme color:", err);
    }
  };

  const handleSaveBanner = async (newBanner) => {
    try {
      const userRef = doc(db, "users", uid);
      await updateDoc(userRef, { bannerUrl: newBanner });
      setBannerUrl(newBanner);
    } catch (err) {
      console.error("Error updating banner:", err);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!user) return <p>User not found.</p>;

  const isOwner = currentUser?.id === uid;

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
          backgroundColor: bannerUrl ? undefined : themeColor,
          backgroundImage: bannerUrl ? `url(${bannerUrl})` : undefined,
          backgroundPosition: "center",
          backgroundSize: "cover",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {editing && (
          <input
            type="text"
            placeholder="Enter banner image URL"
            value={bannerUrl}
            onChange={(e) => setBannerUrl(e.target.value)}
            style={{
              padding: "0.5rem",
              borderRadius: "6px",
              border: "1px solid #ccc",
              width: "70%",
              color: "black",
            }}
            onBlur={() => handleSaveBanner(bannerUrl)}
          />
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

          {/* Bio */}
          <BioBox
            initialBio={bio}
            editable={isOwner}
            themeColor={themeColor}
            onThemeChange={handleSaveTheme}
            onSave={handleSaveBio}
          />

          {isOwner && (
            <div style={{ marginTop: "1rem" }}>
              <label>
                Theme Color:{" "}
                <input
                  type="color"
                  value={themeColor}
                  onChange={(e) => setThemeColor(e.target.value)}
                />
              </label>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
