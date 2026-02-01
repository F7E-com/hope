import { useState, useEffect, useRef } from "react";
import { Link, Outlet } from "react-router-dom";
import { useUser, fetchAndSyncUser } from "../contexts/UserContext";
import ThemePickerDropdown from "../components/modules/ThemePickerDropdown";
import { THEMES } from "../themes/ThemeIndex";
import SearchBar from "../components/SearchBar";
import { applyTheme } from "../utils/themeUtils";
import SvgFiltersDefs from "../components/visual/SvgFiltersDefs";
import ParticlesLayer from "../components/visual/ParticlesLayer";
import "../styles/theme-surface.css";

export default function MainLayout() {
  const { currentUser, setCurrentUser } = useUser();

  // Initialize user once on layout mount
  useEffect(() => {
    const initializeUser = async () => {
      try {
        const uid = localStorage.getItem("currentUserId"); // get saved UID
        const user = await fetchAndSyncUser(uid); // pass UID so fetch returns correct user
        setCurrentUser(user);
      } catch (err) {
        console.error("Error initializing user in MainLayout:", err);
      }
    };
    initializeUser();
  }, [setCurrentUser]);

  const [activePopup, setActivePopup] = useState(null);
  const [popupPos, setPopupPos] = useState({ x: 0, y: 0 });
  const popupRef = useRef(null);

  // ---- SITE THEME STATE ----
  const [siteThemeID, setSiteThemeID] = useState("vale"); // default
  const [customColor, setCustomColor] = useState("#222222");

  // ---- Popup logic ----
  const togglePopup = (id, e) => {
    if (activePopup === id) {
      setActivePopup(null);
    } else {
      setPopupPos({ x: e.pageX, y: e.pageY });
      setActivePopup(id);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        setActivePopup(null);
      }
    };
    if (activePopup) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [activePopup]);

  // Flip popup if out of viewport
  useEffect(() => {
    if (!activePopup || !popupRef.current) return;

    const popup = popupRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let newX = popupPos.x;
    let newY = popupPos.y;

    if (popup.right > viewportWidth) newX = Math.max(0, popupPos.x - popup.width);
    if (popup.left < 0) newX = 0;
    if (popup.bottom > viewportHeight) newY = Math.max(0, popupPos.y - popup.height);
    if (popup.top < 0) newY = 0;

    setPopupPos({ x: newX, y: newY });
  }, [activePopup, popupPos.x, popupPos.y]);

  // ---- Apply site theme globally ----
  useEffect(() => {
    const theme = THEMES[siteThemeID] || {};
    applyTheme(theme, siteThemeID === "custom" ? customColor : null);
  }, [siteThemeID, customColor]);

  return (
    <div className="min-h-screen flex flex-col site-wrapper">
      <SvgFiltersDefs />
      {THEMES[siteThemeID]?.particles && (
        <ParticlesLayer config={THEMES[siteThemeID].particles} />
      )}

      <style>
        {`
        .search-bar input {
          color: #000;
          width: 100%;
          padding: 0.4rem;
          font-size: 0.9rem;
        }

        .search-bar select {
          color: #000;
          padding: 0.4rem;
          font-size: 0.9rem;
        }

        .search-bar button {
          color: #000;
          padding: 0.4rem 0.8rem;
          font-size: 0.9rem;
        }
      `}
      </style>

      {/* Top row: Theme Picker + Search */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "1rem",
          marginTop: "0.5rem",
        }}
      >
        <div style={{ flexShrink: 0 }}>
          <ThemePickerDropdown
            unlockedThemes={Object.keys(THEMES)}
            selectedTheme={siteThemeID}
            onChange={setSiteThemeID}
            customColor={customColor}
            onCustomColorChange={setCustomColor}
          />
        </div>
        <div style={{ flex: 1, maxWidth: "450px" }}>
          <SearchBar />
        </div>
      </div>

      {/* Profile & Menu Buttons */}
      <div className="circle-button profile-button" onClick={(e) => togglePopup("profile", e)} />
      <div className="circle-button menu-button" onClick={(e) => togglePopup("menu", e)} />

      {/* Popups */}
      {activePopup && (
        <div
          ref={popupRef}
          className="popup"
          style={{
            top: `${popupPos.y}px`,
            left: `${popupPos.x}px`,
            position: "absolute",
            background: "var(--primary-color)",
            color: "var(--secondary-color)",
            fontFamily: "var(--site-font-family)",
            borderRadius: "8px",
            padding: "0.5rem",
            zIndex: 20,
            minWidth: "150px",
          }}
        >
          {activePopup === "profile" && (
            <>
              <Link to="/new-user" style={{ color: "var(--secondary-color)" }}>New User/Login</Link>
              {currentUser?.id ? (
                <>
                  <Link to={`/profile/${currentUser.id}`} style={{ color: "var(--secondary-color)" }}>Profile</Link>
                  <Link to={`/creator-page/${currentUser.id}`} style={{ color: "var(--secondary-color)" }}>View Creator Page</Link>
                </>
              ) : (
                <>
                  <span style={{ color: "gray" }}>Profile (login first)</span>
                  <span style={{ color: "gray" }}>View Creator Page (login first)</span>
                </>
              )}
            </>
          )}
          {activePopup === "menu" && (
            <>
              <Link to="/watch" style={{ color: "var(--secondary-color)" }}>Watch</Link>
              <Link to="/read" style={{ color: "var(--secondary-color)" }}>Read</Link>
              <Link to="/listen" style={{ color: "var(--secondary-color)" }}>Listen</Link>
              <Link to="/play" style={{ color: "var(--secondary-color)" }}>Play</Link>
              <Link to="/events" style={{ color: "var(--secondary-color)" }}>Events</Link>
              <Link to="/search" style={{ color: "var(--secondary-color)" }}>Search</Link>
              <Link to="/" style={{ color: "var(--secondary-color)" }}>Home</Link>
            </>
          )}
        </div>
      )}

      <main className="flex-grow container mx-auto p-4">
        <Outlet />
        <div className="header">
        <div className="title2" style={{ color: "var(--secondary-color)" }}>RETRO CITY</div>
        <div className="slogan" style={{ color: "var(--secondary-color)" }}>Arcade of Wonders</div>
        </div>

      </main>
    </div>
  );
}
