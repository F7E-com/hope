import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/utils/firebase";
import BioBox from "../components/BioBox";
import { useUser } from "../contexts/UserContext";
import ThemePickerDropdown from "../components/modules/ThemePickerDropdown";
import { THEMES } from "../themes/ThemeIndex";
import { applyTheme } from "../utils/themeUtils";

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

  const isOwner = currentUser?.id?.toString() === uid?.toString();

  useEffect(() => {
    if (!uid) {
      setProfileUser(null);
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      setLoading(true);
      try {
        const userRef = doc(db, "users", uid);
        const snapshot = await getDoc(userRef);

        if (!snapshot.exists()) {
          setProfileUser(null);
          return;
        }

        const data = snapshot.data() || {};
        const safeData = {
          id: uid,
          name: data.name || "Unnamed Explorer",
          faction: data.faction || "Unaffiliated",
          bio: data.bio || "",
          kudos: data.kudos || {},
          unlockedThemes: data.unlockedThemes || Object.keys(THEMES),
          themeColor: data.themeColor || "#222222",
          bannerUrl: data.bannerUrl || "",
          themeId: data.themeId || "none",
        };

        setProfileUser(safeData);
        setThemeColor(safeData.themeColor);
        setBannerUrlInput(safeData.bannerUrl);
        setBannerPreview(safeData.bannerUrl || safeData.themeColor);
        setSelectedTheme(safeData.themeId);
      } catch (error) {
        console.error("Error fetching profile:", error);
        setProfileUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [uid]);

  // Safely apply theme
  useEffect(() => {
    if (!profileUser || !selectedTheme) return;
    const wrapper = document.querySelector(".profile-page-wrapper");
    if (!wrapper) return;

    try {
      applyTheme(THEMES[selectedTheme], themeColor, wrapper);
    } catch (err) {
      console.error("Error applying theme:", err);
    }
  }, [selectedTheme, themeColor, profileUser]);

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

      setBannerPreview(bannerUrlInput || themeColor);
      const wrapper = document.querySelector(".profile-page-wrapper");
      if (wrapper && THEMES[selectedTheme]) {
        applyTheme(THEMES[selectedTheme], themeColor, wrapper);
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

  return (
    <div className={`profile-page-wrapper ${THEMES[selectedTheme]?.className || "background"}`}>
      {!profileUser ? (
        <p>User not found.</p>
      ) : (
        <>
          <div
            className="creator-banner"
            style={{
              backgroundColor: bannerPreview ? undefined : themeColor,
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

          <div style={{ display: "flex", gap: "2rem" }}>
            <div style={{ flex: "1", background: "#222", padding: "1rem", borderRadius: "8px" }}>
              <h2>Kudos</h2>
              <ul>
                {Object.entries(profileUser.kudos).map(([factionName, points]) => (
                  <li key={factionName}>
                    <strong>{factionName}:</strong> {points}
                  </li>
                ))}
              </ul>
            </div>

            <div style={{ flex: "2" }}>
              <h1 style={{ marginBottom: "0.5rem" }}>{profileUser.name}</h1>
              <p>
                <strong>Faction:</strong> {profileUser.faction}
              </p>

              <BioBox
                initialBio={profileUser.bio}
                isOwner={isOwner}
                editable={isOwner}
                onSave={handleSaveBio}
                textColor={THEMES[selectedTheme]?.preview?.color || "#fff"}
                backgroundColor={THEMES[selectedTheme]?.preview?.background || "#222"}
              />

              {isOwner && !editing && <button onClick={() => setEditing(true)}>Edit Profile</button>}

              {isOwner && editing && (
                <div style={{ marginTop: "1rem" }}>
                  <label>
                    Theme Color:{" "}
                    <input type="color" value={themeColor} onChange={(e) => setThemeColor(e.target.value)} />
                  </label>

                  <ThemePickerDropdown
                    unlockedThemes={profileUser.unlockedThemes}
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
        </>
      )}
    </div>
  );
}
