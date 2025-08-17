import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/utils/firebase";
import DOMPurify from "dompurify"; // make sure installed

export default function Profile() {
  const { uid } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  const [bio, setBio] = useState("");
  const [themeColor, setThemeColor] = useState("#222222");

  useEffect(() => {
    if (!uid) return;

    const fetchUser = async () => {
      try {
        const userRef = doc(db, "users", uid);
        const snapshot = await getDoc(userRef);

        if (snapshot.exists()) {
          const data = snapshot.data();
          setUser(data);
          setBio(data.bio || "");
          setThemeColor(data.themeColor || "#222222");
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [uid]);

  const handleSave = async () => {
    if (!uid) return;
    try {
      const userRef = doc(db, "users", uid);
      await updateDoc(userRef, { bio, themeColor });
      setUser((prev) => ({ ...prev, bio, themeColor }));
      setEditing(false);
    } catch (err) {
      console.error("Error saving profile:", err);
    }
  };

  // Convert bio HTML to safe React nodes
  const renderBioAsReactLinks = (bioText) => {
    if (!bioText) return <span>No bio yet.</span>;

    const cleanBio = DOMPurify.sanitize(bioText, { ADD_ATTR: ["target"] });
    const parts = cleanBio.split(/(<a[^>]+>.*?<\/a>)/gi);

    return parts.map((part, i) => {
      if (!part) return null;
      const match = part.match(/<a\s+href="([^"]+)".*?>(.*?)<\/a>/i);
      if (match) {
        const href = match[1];
        const text = match[2];

        if (href.startsWith("/")) {
          return (
            <Link key={i} to={href} style={{ color: "red" }}>
              {text}
            </Link>
          );
        } else {
          return (
            <a
              key={i}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "blue" }}
            >
              {text}
            </a>
          );
        }
      }
      return <span key={i} dangerouslySetInnerHTML={{ __html: part }} />;
    });
  };

  if (loading) return <p>Loading...</p>;
  if (!user) return <p>User not found.</p>;

  return (
    <div
      style={{
        maxWidth: "900px",
        margin: "2rem auto",
        padding: "1rem",
        background: "#111",
        color: "#fff",
        borderRadius: "12px",
      }}
    >
      {/* Banner */}
      <div
        style={{
          width: "100%",
          height: "200px",
          borderRadius: "12px",
          marginBottom: "1rem",
          background: user.bannerUrl
            ? `url(${user.bannerUrl}) center/cover`
            : themeColor,
        }}
      />

      {/* Two-column layout */}
      <div style={{ display: "flex", gap: "2rem" }}>
        {/* Kudos box (left column) */}
        <div
          style={{
            flex: "1",
            background: "#222",
            padding: "1rem",
            borderRadius: "8px",
          }}
        >
          <h2>Kudos</h2>
          <ul>
            {user.kudos &&
              Object.entries(user.kudos).map(([factionName, points]) => (
                <li key={factionName}>
                  <strong>{factionName}:</strong> {points}
                </li>
              ))}
          </ul>
        </div>

        {/* Profile info (right column) */}
        <div style={{ flex: "2" }}>
          <h1 style={{ marginBottom: "0.5rem" }}>{user.name}</h1>
          <p>
            <strong>Faction:</strong> {user.faction}
          </p>

          {editing ? (
            <>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                style={{
                  width: "100%",
                  minHeight: "80px",
                  margin: "0.5rem 0",
                  padding: "0.5rem",
                  borderRadius: "6px",
                  color: "black",
                }}
              />
              <label>
                Theme Color:{" "}
                <input
                  type="color"
                  value={themeColor}
                  onChange={(e) => setThemeColor(e.target.value)}
                />
              </label>
              <br />
              <button
                onClick={handleSave}
                style={{ marginTop: "0.5rem", padding: "0.5rem 1rem" }}
              >
                Save
              </button>
              <button
                onClick={() => setEditing(false)}
                style={{
                  marginLeft: "0.5rem",
                  padding: "0.5rem 1rem",
                  background: "gray",
                }}
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <div style={{ margin: "1rem 0" }}>
                {renderBioAsReactLinks(user.bio)}
              </div>
              <button
                onClick={() => setEditing(true)}
                style={{ padding: "0.5rem 1rem" }}
              >
                Edit Profile
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
