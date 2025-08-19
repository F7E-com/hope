import { useState, useEffect, useRef } from "react";
import NavBar from "../components/modules/NavBar";
import { Link, Outlet } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import ThemePickerDropdown from "../components/modules/ThemePickerDropdown";
import { THEMES } from "../themes/ThemeIndex";
import SearchBar from "../components/modules/SearchBar";

export default function MainLayout() {
  const { currentUser } = useUser();
  const [activePopup, setActivePopup] = useState(null);
  const [popupPos, setPopupPos] = useState({ x: 0, y: 0 });
  const popupRef = useRef(null);

  // ---- SITE THEME STATE ----
  const [siteThemeID, setSiteThemeID] = useState("vale"); // default theme
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

    // Horizontal flip
    if (popup.right > viewportWidth) newX = Math.max(0, popupPos.x - popup.width);
    if (popup.left < 0) newX = 0;

    // Vertical flip
    if (popup.bottom > viewportHeight) newY = Math.max(0, popupPos.y - popup.height);
    if (popup.top < 0) newY = 0;

    setPopupPos({ x: newX, y: newY });
  }, [activePopup, popupPos.x, popupPos.y]);

  // ---- Apply site theme globally ----
  useEffect(() => {
    const theme = THEMES[siteThemeID] || {};
    document.body.style.background = siteThemeID === "custom" ? customColor : theme.preview?.background || "#222";
    document.body.style.color = theme.preview?.color || "#fff";
    document.body.style.fontFamily = theme.fontFamily || "inherit";

    // Optional: set CSS variables for links/buttons
    document.documentElement.style.setProperty("--primary-color", siteThemeID === "custom" ? customColor : theme.preview?.background || "#222");
    document.documentElement.style.setProperty("--secondary-color", theme.preview?.color || "#fff");
    document.documentElement.style.setProperty("--site-font-family", theme.fontFamily || "inherit");
  }, [siteThemeID, customColor]);

  return (
    <div className="min-h-screen flex flex-col site-wrapper">
      <div className="background"></div>

      {/* Theme Picker Dropdown */}
      <div style={{ margin: "1rem" }}>
        <ThemePickerDropdown
          unlockedThemes={Object.keys(THEMES)}
          selectedTheme={siteThemeID}
          onChange={setSiteThemeID}
          customColor={customColor}
          onCustomColorChange={setCustomColor}
        />
      </div>

      {/* Profile Button */}
      <div className="circle-button profile-button" onClick={(e) => togglePopup("profile", e)} />

      {/* Menu Button */}
      <div className="circle-button menu-button" onClick={(e) => togglePopup("menu", e)} />

      {/* Popup */}
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
              {currentUser ? (
                <Link to={`/profile/${currentUser.id}`} style={{ color: "var(--secondary-color)" }}>Profile</Link>
              ) : (
                <span style={{ color: "gray" }}>Profile (login first)</span>
              )}
              {currentUser ? (
                <Link to={`/creator-page/${currentUser.id}`} style={{ color: "var(--secondary-color)" }}>View Creator Page</Link>
              ) : (
                <span style={{ color: "gray" }}>View Creator Page (login first)</span>
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

      <div
        style={{
          display: "flex",
          justifyContent: "center", // centers horizontally
          margin: "2rem 0",
        }}
      >
        <SearchBar />
      </div>

      <div className="title2" style={{ color: "var(--secondary-color)" }}>Faction Seven</div>
      <div className="slogan" style={{ color: "var(--secondary-color)" }}>Your one-stop media source</div>

      <main className="flex-grow container mx-auto p-4">
        <Outlet /> {/* Nested routes render here */}
      </main>
    </div>
  );
}
