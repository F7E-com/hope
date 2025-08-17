import { useState } from "react";
import NavBar from "../components/NavBar";
import { Link } from "react-router-dom";


export default function MainLayout({ children }) {
  // State to control which popup is open
  const [activePopup, setActivePopup] = useState(null);

  const togglePopup = (id) => {
    setActivePopup(activePopup === id ? null : id);
  };

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
          <link to="/new-user"></link>
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
      <div className="title2">Midnight UI</div>

      {/* Slogan */}
      <div className="slogan">Your one-stop media source</div>

      {/* Page content gets injected here */}
      <main className="flex-grow container mx-auto p-4">{children}</main>
    </div>
  );
}

