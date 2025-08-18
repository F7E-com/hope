import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/utils/firebase";
import BioBox from "../components/BioBox";
import { useUser } from "../contexts/UserContext";
import ThemePicker from "../components/modules/ThemePicker";
import ThemePickerDropdown from "../components/modules/ThemePickerDropdown";
import "../themes/Vale.css"; // import all theme CSS files here
import { THEMES } from "../themes/ThemeIndex"; // your new theme index

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

  // inside your component, after `profileUser` etc.
  const getActiveThemeStyles = () => {
    const theme = THEMES[selectedTheme] || { preview: {}, className: "" };
    return {
      primaryColor: theme.preview.background || themeColor,
      secondaryColor: theme.preview.color || "#fff",
      fontFamily: theme.fontFamily || "inherit",
      borderStyle: theme.borderStyle || "none",
      bannerOverlay: theme.bannerOverlay || null,
      buttonStyle: {
        background: theme.preview.background || "#444",
        color: theme.preview.color || "#fff",
        border: theme.borderStyle || "1px solid #666",
        borderRadius: "6px",
        padding: "0.5rem 1rem",
        cursor: "pointer",
        fontFamily: theme.fontFamily || "inherit",
      },
      inputStyle: {
        background: theme.preview.background || "#222",
        color: theme.preview.color || "#fff",
        border: theme.borderStyle || "1px solid #555",
        borderRadius: "6px",
        padding: "0.3rem",
        fontFamily: theme.fontFamily || "inherit",
      },
    };
  };

  const activeTheme = getActiveThemeStyles();

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

  const activeTheme = THEMES[selectedTheme] || {
    preview: { background: themeColor, color: "#fff" },
  };

  const backgroundStyle = {
    backgroundColor: activeTheme.preview?.background || themeColor,
    color: activeTheme.preview?.color || "#fff",
    fontFamily: activeTheme.fontFamily || "inherit",
    border: activeTheme.borderStyle || "none",
    transition: "all 0.3s ease",
  };

  return (
    <div
      style={{
        maxWidth: "900px",
        margin: "2rem auto",
        padding: "1rem",
        borderRadius: "12px",
        ...backgroundStyle,
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
          overflow: "hidden",
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
            themeColor={activeTheme.preview?.color || themeColor}
            textColor={activeTheme.preview?.color}
            backgroundColor={activeTheme.preview?.background}
          />

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

              {/* ThemePicker pulling from THEMES */}
              <ThemePickerDropdown
                unlockedThemes={profileUser.unlockedThemes || Object.keys(FACTION_THEMES)}
                selectedTheme={selectedTheme}
                onChange={setSelectedTheme}
                customColor={themeColor}
                onCustomColorChange={setThemeColor}
              />


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
