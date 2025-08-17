import { useState, useEffect, useRef } from "react";
import NavBar from "../components/NavBar";
import { Link, Outlet } from "react-router-dom";
import { useUser } from "../contexts/UserContext"; // make sure context is available

export default function MainLayout() {
  const { currentUser } = useUser();
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
              <a href="#">Home</a>
            </>
          )}
        </div>
      )}

      <div className="title2">Faction Seven</div>
      <div className="slogan">Your one-stop media source</div>

      <main className="flex-grow container mx-auto p-4">
        <Outlet /> {/* <-- This is crucial for nested routes */}
      </main>
    </div>
  );
}
