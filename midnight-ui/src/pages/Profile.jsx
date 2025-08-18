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

  const [bannerUrlInput, setBannerUrlInput] = useState(""); // live edit
  const [bannerPreview, setBannerPreview] = useState(themeColor); // show preview while editing

  const [editing, setEditing] = useState(false);

  const isOwner = currentUser?.id === uid;

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
          setBannerUrlInput(data.bannerUrl || "");
          setBannerPreview(data.bannerUrl || data.themeColor || "#222222");
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

  const handleSaveProfile = async () => {
    if (!uid) return;
    try {
      const userRef = doc(db, "users", uid);
      await updateDoc(userRef, {
        themeColor,
        bannerUrl: bannerUrlInput,
      });
      setUser((prev) => ({
        ...prev,
        themeColor,
        bannerUrl: bannerUrlInput,
      }));
      setBannerPreview(bannerUrlInput);
      setEditing(false);
    } catch (err) {
      console.error("Error saving profile:", err);
    }
  };

  const handleSaveBio = async (newBio) => {
    if (!uid) return;
    try {
      const userRef = doc(db, "users", uid);
      await updateDoc(userRef, { bio: newBio });
      setBio(newBio);
      setUser((prev) => ({ ...prev, bio: newBio }));
    } catch (err) {
      console.error("Error saving bio:", err);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!user) return <p>User not found.</p>;

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
          backgroundColor: !bannerPreview ? themeColor : undefined,
          backgroundImage: bannerPreview ? `url(${bannerPreview})` : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "relative",
        }}
      >
        {editing && isOwner && (
          <input
            type="text"
            placeholder="Banner Image URL"
            value={bannerUrlInput}
            onChange={(e) => {
              setBannerUrlInput(e.target.value);
              setBannerPreview(e.target.value); // live preview
            }}
            style={{
              position: "absolute",
              bottom: "10px",
              left: "10px",
              width: "70%",
              padding: "0.3rem",
              borderRadius: "6px",
              border: "1px solid #555",
              background: "#222",
              color: "#fff",
            }}
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

          {/* BioBox */}
          <BioBox
            initialBio={bio}
            editable={isOwner}
            onSave={handleSaveBio}
            themeColor={themeColor}
          />

          {/* Owner-only buttons */}
          {isOwner && !editing && (
            <button
              onClick={() => setEditing(true)}
              style={{
                marginTop: "0.5rem",
                padding: "0.5rem 1rem",
                background: "#444",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Edit Profile
            </button>
          )}

          {isOwner && editing && (
            <div style={{ marginTop: "1rem" }}>
              <label>
                Theme Color:{" "}
                <input
                  type="color"
                  value={themeColor}
                  onChange={(e) => setThemeColor(e.target.value)}
                />
              </label>
              <br />
              <button
                onClick={handleSaveProfile}
                style={{
                  marginTop: "0.5rem",
                  padding: "0.5rem 1rem",
                  background: "#444",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Save Profile
              </button>
              <button
                onClick={() => setEditing(false)}
                style={{
                  marginLeft: "0.5rem",
                  padding: "0.5rem 1rem",
                  background: "gray",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
            </div>
          )}

          {!isOwner && <p style={{ marginTop: "1rem" }}>View-only profile</p>}
        </div>
      </div>
    </div>
  );
}
