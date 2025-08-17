import { useState, useEffect, useRef } from "react";
import NavBar from "../components/NavBar";
import { Link } from "react-router-dom";

export default function MainLayout({ children }) {
  const [activePopup, setActivePopup] = useState(null);
  const [popupPos, setPopupPos] = useState({ x: 0, y: 0 });
  const popupRef = useRef(null);

  const togglePopup = (id, e) => {
    if (activePopup === id) {
      setActivePopup(null);
    } else {
      const clickX = e.clientX;
      const clickY = e.clientY;
      setPopupPos({ x: clickX, y: clickY });
      setActivePopup(id);
    }
  };

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        setActivePopup(null);
      }
    };
    if (activePopup) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [activePopup]);

  // Adjust if out of bounds (flip horizontally)
  useEffect(() => {
    if (activePopup && popupRef.current) {
      const popup = popupRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;

      if (popup.right > viewportWidth) {
        setPopupPos((pos) => ({ ...pos, x: pos.x - popup.width }));
      }
    }
  }, [activePopup]);

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <div className="background"></div>

      {/* Profile Button */}
      <div
        className="circle-button profile-button"
        onClick={(e) => togglePopup("profile", e)}
      ></div>

      {/* Menu Button */}
      <div
        className="circle-button menu-button"
        onClick={(e) => togglePopup("menu", e)}
      ></div>

      {/* Popup */}
      {activePopup && (
        <div
          ref={popupRef}
          className="popup"
          style={{
            top: `${popupPos.y}px`,
            left: `${popupPos.x}px`,
            position: "absolute",
          }}
        >
          {activePopup === "profile" && (
            <>
              <Link to="/new-user">New User/Login</Link>
              <a href="../pages/Profile">Profile</a>
              <a href="#">Creator Page</a>
            </>
          )}
          {activePopup === "menu" && (
            <>
              <a href="#">Watch</a>
              <a href="#">Read</a>
              <a href="#">Listen</a>
              <a href="#">Play</a>
              <a href="#">Events</a>
              <a href="#">Search</a>
              <a href="#">Home</a>
            </>
          )}
        </div>
      )}

      <div className="title2">Faction Seven</div>
      <div className="slogan">Your one-stop media source</div>
      <main className="flex-grow container mx-auto p-4">{children}</main>
    </div>
  );
}
