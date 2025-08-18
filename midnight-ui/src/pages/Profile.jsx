import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/utils/firebase";
import BioBox from "../components/BioBox";
import { useUser } from "../contexts/UserContext";
import ThemePickerDropdown from "../components/modules/ThemePickerDropdown";
import { THEMES } from "../themes/ThemeIndex";
import "../themes/Vale.css"; // import all theme CSS files here

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

  // fetch profile
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
      } catch (err) {
        console.error("Error fetching profile:", err);
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

  // pull active theme
  const themeClass = selectedTheme !== "custom" ? THEMES[selectedTheme]?.className || "" : "";

  return (
    <div className={`profile-container ${themeClass}`}>
      {/* Banner */}
      <div
        className={`profile-banner ${themeClass}`}
        style={{
          backgroundColor: selectedTheme === "custom" ? themeColor : undefined,
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
            className="banner-input"
          />
        )}
      </div>

      {/* Two-column layout */}
      <div className="profile-columns">
        <div className="profile-kudos">
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

        <div className="profile-main">
          <h1>{profileUser.name}</h1>
          <p><strong>Faction:</strong> {profileUser.faction}</p>

          <BioBox
            initialBio={profileUser.bio || ""}
            isOwner={isOwner}
            editable={isOwner}
            onSave={handleSaveBio}
            themeColor={themeColor}
            backgroundColor={selectedTheme === "custom" ? themeColor : undefined}
          />

          {isOwner && !editing && (
            <button className="edit-profile-btn" onClick={() => setEditing(true)}>
              Edit Profile
            </button>
          )}

          {isOwner && editing && (
            <div className="edit-profile-panel">
              <label>
                Custom Theme Color:
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

              <button className="save-btn" onClick={handleSaveProfile}>Save Profile</button>
              <button className="cancel-btn" onClick={() => setEditing(false)}>Cancel</button>
            </div>
          )}

          {!isOwner && <p className="view-only-text">View-only profile</p>}
        </div>
      </div>
    </div>
  );
}
