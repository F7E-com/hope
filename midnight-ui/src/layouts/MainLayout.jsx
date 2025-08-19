import { useState, useEffect, useRef } from "react";
import { Link, Outlet } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import { THEMES } from "../themes/ThemeIndex";
import ThemePickerDropdown from "../components/modules/ThemePickerDropdown";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/utils/firebase";

export default function MainLayout() {
  const { currentUser } = useUser();
  const [activePopup, setActivePopup] = useState(null);
  const [popupPos, setPopupPos] = useState({ x: 0, y: 0 });
  const [siteThemeID, setSiteThemeID] = useState("background"); // default
  const [customColor, setCustomColor] = useState("#222222");
  const popupRef = useRef(null);

  useEffect(() => {
    if (currentUser?.siteThemeID) setSiteThemeID(currentUser.siteThemeID);
    if (currentUser?.siteCustomColor) setCustomColor(currentUser.siteCustomColor);
  }, [currentUser]);

  const siteThemeClass =
    siteThemeID === "custom" ? "" : THEMES[siteThemeID]?.className || "background";

  const handleChangeSiteTheme = async (themeId) => {
    setSiteThemeID(themeId);
    if (!currentUser?.id) return;
    try {
      const userRef = doc(db, "users", currentUser.id);
      await updateDoc(userRef, { siteThemeID: themeId });
    } catch (err) {
      console.error("Error saving site theme:", err);
    }
  };

  const handleChangeCustomColor = async (color) => {
    setCustomColor(color);
    if (!currentUser?.id) return;
    try {
      const userRef = doc(db, "users", currentUser.id);
      await updateDoc(userRef, { siteCustomColor: color, siteThemeID: "custom" });
    } catch (err) {
      console.error("Error saving custom site color:", err);
    }
  };

  const togglePopup = (id, e) => {
    if (activePopup === id) setActivePopup(null);
    else {
      setPopupPos({ x: e.pageX, y: e.pageY });
      setActivePopup(id);
    }
  };

  // Close popups on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        setActivePopup(null);
      }
    };
    if (activePopup) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [activePopup]);

  return (
    <div
      className={`site-wrapper ${siteThemeClass} min-h-screen flex flex-col`}
      style={{
        background: siteThemeID === "custom" ? customColor : undefined,
        transition: "all 0.3s ease",
      }}
    >
      {/* Change Site Theme button using ThemePickerDropdown */}
      {currentUser && (
        <ThemePickerDropdown
          unlockedThemes={Object.keys(THEMES)}
          selectedTheme={siteThemeID}
          onChange={handleChangeSiteTheme}
          customColor={customColor}
          onCustomColorChange={handleChangeCustomColor}
        />
      )}

      {/* Profile & Menu Buttons */}
      <div className="circle-button profile-button" onClick={(e) => togglePopup("profile", e)} />
      <div className="circle-button menu-button" onClick={(e) => togglePopup("menu", e)} />

      {/* Popups */}
      {activePopup && (
        <div
          ref={popupRef}
          className="popup"
          style={{ top: `${popupPos.y}px`, left: `${popupPos.x}px`, position: "absolute" }}
        >
          {activePopup === "profile" && (
            <>
              <Link to="/new-user">New User/Login</Link>
              {currentUser ? <Link to={`/profile/${currentUser.id}`}>Profile</Link> : <span style={{ color: "gray" }}>Profile (login first)</span>}
              {currentUser ? <Link to={`/creator-page/${currentUser.id}`}>View Creator Page</Link> : <span style={{ color: "gray" }}>View Creator Page (login first)</span>}
            </>
          )}
          {activePopup === "menu" && (
            <>
              <Link to="/watch">Watch</Link>
              <Link to="/read">Read</Link>
              <Link to="/listen">Listen</Link>
              <Link to="/play">Play</Link>
              <Link to="/events">Events</Link>
              <Link to="/search">Search</Link>
              <Link to="/">Home</Link>
            </>
          )}
        </div>
      )}

      <div className="title2">Faction Seven</div>
      <div className="slogan">Your one-stop media source</div>

      <main className="flex-grow container mx-auto p-4">
        <Outlet />
      </main>
    </div>
  );
}
