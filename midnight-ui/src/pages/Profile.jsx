// Profile.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/utils/firebase";
import BioBox from "../components/BioBox";
import { useUser } from "../contexts/UserContext";
import ThemePickerDropdown from "../components/modules/ThemePickerDropdown";
import { THEMES } from "../themes/ThemeIndex";
import { applyTheme } from "../utils/themeUtils"; // 👈 bring in your util

export default function Profile() {
  const { uid } = useParams();
  const { currentUser } = useUser();

  const [profileUser, setProfileUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [themeColor, setThemeColor] = useState("#222222");
  const [bannerUrlInput, setBannerUrlInput] = useState("");
  const [bannerPreview, setBannerPreview] = useState("#222222");
  const [selectedTheme, setSelectedTheme] = useState("none");
  const [editing, setEditing] = useState(false);

  const isOwner = currentUser?.id === uid;

  useEffect(() => {
    if (!uid) return;

    setProfileUser(null);
    setLoading(true);

    const fetchProfile = async () => {
      try {
        const userRef = doc(db, "users", uid);
        const snapshot = await getDoc(userRef);

        if (snapshot.exists()) {
          const data = snapshot.data();
          data.id = uid;
          data.unlockedThemes = data.unlockedThemes || Object.keys(THEMES);

          setProfileUser(data);
          setThemeColor(data.themeColor || "#222222");
          setBannerUrlInput(data.bannerUrl || "");
          setBannerPreview(data.bannerUrl || data.themeColor || "#222222");
          setSelectedTheme(data.themeId || "none");
        } else {
          setProfileUser(null);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        setProfileUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [uid]);

  // 🔥 Apply the theme whenever selectedTheme/themeColor changes
  useEffect(() => {
  if (selectedTheme && THEMES[selectedTheme]) {
    const wrapper = document.querySelector('.profile-page-wrapper');
    if (wrapper) applyTheme(THEMES[selectedTheme], themeColor, wrapper);
  }
}, [selectedTheme, themeColor]);


  const handleSaveProfile = async () => {
    if (!uid) return;
    try {
      const userRef = doc(db, "users", uid);
      await updateDoc(userRef, {
        themeColor,
        bannerUrl: bannerUrlInput,
        themeId: selectedTheme,
      });
      setProfileUser((prev) => ({
        ...prev,
        themeColor,
        bannerUrl: bannerUrlInput,
        themeId: selectedTheme,
      }));
      setBannerPreview(bannerUrlInput);

      // 👇 immediately apply after saving too
      if (THEMES[selectedTheme]) {
        applyTheme(THEMES[selectedTheme], themeColor);
      }

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
      setProfileUser((prev) => ({ ...prev, bio: newBio }));
    } catch (err) {
      console.error("Error saving bio:", err);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!profileUser) return <p>User not found.</p>;

  // Determine wrapper classes
  const themeClass = THEMES[selectedTheme]?.className || "background";

  return (
    <div className={`profile-page-wrapper ${themeClass}`}>
      {/* Banner */}
      <div
        className="creator-banner"
        style={{
          backgroundColor: !bannerPreview ? themeColor : undefined,
          backgroundImage: bannerPreview ? `url(${bannerPreview})` : undefined,
        }}
      >
        {editing && isOwner && (
          <input
            type="text"
            placeholder="Banner Image URL"
            value={bannerUrlInput}
            onChange={(e) => {
              setBannerUrlInput(e.target.value);
              setBannerPreview(e.target.value);
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
        <div style={{ flex: "1", background: "#222", padding: "1rem", borderRadius: "8px" }}>
          <h2>Kudos</h2>
          <ul>
            {profileUser.kudos &&
              Object.entries(profileUser.kudos).map(([factionName, points]) => (
                <li key={factionName}>
                  <strong>{factionName}:</strong> {points}
                </li>
              ))}
          </ul>
        </div>

        <div style={{ flex: "2" }}>
          <h1 style={{ marginBottom: "0.5rem" }}>{profileUser.name}</h1>
          <p><strong>Faction:</strong> {profileUser.faction}</p>

          <BioBox
            initialBio={profileUser.bio || ""}
            isOwner={isOwner}
            editable={isOwner}
            onSave={handleSaveBio}
            themeColor={THEMES[selectedTheme]?.preview.color || "#fff"}
            textColor={THEMES[selectedTheme]?.preview.color || "#fff"}
            backgroundColor={THEMES[selectedTheme]?.preview.background || "#222"}
          />

          {isOwner && !editing && (
            <button onClick={() => setEditing(true)}>Edit Profile</button>
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

              <ThemePickerDropdown
                unlockedThemes={profileUser.unlockedThemes || Object.keys(THEMES)}
                selectedTheme={selectedTheme}
                onChange={setSelectedTheme}
                customColor={themeColor}
                onCustomColorChange={setThemeColor}
              />

              <button onClick={handleSaveProfile}>Save Profile</button>
              <button onClick={() => setEditing(false)}>Cancel</button>
            </div>
          )}

          {!isOwner && <p style={{ marginTop: "1rem" }}>View-only profile</p>}
        </div>
      </div>
    </div>
  );
}
