import { useState } from "react";
import NavBar from "../components/NavBar";
import { Link } from "react-router-dom";


export default function MainLayout({ children }) {
  // State to control which popup is open
  const [activePopup, setActivePopup] = useState(null);
  const [popupPos, setPopupPos] = useState({ x: 0, y: 0 });
  const popupRef = useRef(null);

  const togglePopup = (id, e) => {
    if (activePopup === id) {
      setActivePopup(null);
    } else {
      // where the click happened
      const clickX = e.clientX;
      const clickY = e.clientY;

      // temp coords
      let x = clickX;
      let y = clickY;

      // check bounds after render in useEffect
      setPopupPos({ x, y });
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

      // if popup goes past right edge, flip left
      if (popup.right > viewportWidth) {
        setPopupPos((pos) => ({ ...pos, x: pos.x - popup.width }));
      }
    }
  }, [activePopup]);

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />

      {/* Background Overlay */}
      <div className="background"></div>

      {/* Profile Button */}
      <div
        className="circle-button profile-button"
        onClick={() => togglePopup("profile")}
      ></div>
      {activePopup === "profile" && (
        <div id="profilePopup" className="popup">
          <link to="/new-user">New User/Login</link>
          <a href="#">Bio</a>
          <a href="#">Creator Page</a>
        </div>
      )}

      {/* Menu Button */}
      <div
        className="circle-button menu-button"
        onClick={() => togglePopup("menu")}
      ></div>
      {activePopup === "menu" && (
        <div id="menuPopup" className="popup">
          <a href="#">Watch</a>
          <a href="#">Read</a>
          <a href="#">Listen</a>
          <a href="#">Play</a>
          <a href="#">Events</a>
          <a href="#">Search</a>
          <a href="#">Home</a>
        </div>
      )}

      {/* Banner */}
      <div className="title2">Faction Seven</div>

      {/* Slogan */}
      <div className="slogan">Your one-stop media source</div>

      {/* Page content gets injected here */}
      <main className="flex-grow container mx-auto p-4">{children}</main>
    </div>
  );
}

