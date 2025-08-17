import { useState, useEffect, useRef } from "react";
import NavBar from "../components/NavBar";
import { Link, Outlet } from "react-router-dom";
import { useUser } from "../contexts/UserContext";

export default function MainLayout() {
  const { currentUser } = useUser();
  const [activePopup, setActivePopup] = useState(null);
  const [popupPos, setPopupPos] = useState({ x: 0, y: 0 });
  const popupRef = useRef(null);

  const togglePopup = (id, e) => {
    if (activePopup === id) {
      setActivePopup(null);
    } else {
      // Use pageX/pageY so the popup accounts for scroll
      setPopupPos({ x: e.pageX, y: e.pageY });
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
    if (activePopup) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [activePopup]);

  // Flip horizontally if out of viewport
  useEffect(() => {
    if (!activePopup || !popupRef.current) return;

    const popup = popupRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    let newX = popupPos.x;

    if (popup.right > viewportWidth) {
      newX = Math.max(0, popupPos.x - popup.width);
    }
    setPopupPos((prev) => ({ ...prev, x: newX }));
  }, [activePopup, popupPos.x]);

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <div className="background"></div>

      {/* Profile Button */}
      <div className="circle-button profile-button" onClick={(e) => togglePopup("profile", e)} />

      {/* Menu Button */}
      <div className="circle-button menu-button" onClick={(e) => togglePopup("menu", e)} />

      {/* Popup */}
      {activePopup && (
        <div
          ref={popupRef}
          className="popup"
          style={{ top: `${popupPos.y}px`, left: `${popupPos.x}px`, position: "absolute" }}
        >
          {activePopup === "profile" && (
            <>
              <Link to="/new-user">New User/Login</Link>
              {currentUser ? (
                <Link to={`/profile/${currentUser.id}`}>Profile</Link>
              ) : (
                <span style={{ color: "gray" }}>Profile (login first)</span>
              )}
              <Link to="/active-projects" style={{ color: "red" }}>
                Active Projects
              </Link>
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
              <Link to="/">Home</Link>
            </>
          )}
        </div>
      )}

      <div className="title2">Faction Seven</div>
      <div className="slogan">Your one-stop media source</div>

      <main className="flex-grow container mx-auto p-4">
        <Outlet /> {/* Nested routes render here */}
      </main>
    </div>
  );
}
