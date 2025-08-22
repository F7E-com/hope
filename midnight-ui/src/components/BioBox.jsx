// BioBox.jsx
import React, { useState } from "react";
import { useUser } from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import DOMPurify from "dompurify";

// Helper to get readable text color based on background
function getContrastColor(hexcolor) {
  if (!hexcolor) return "#fff";
  hexcolor = hexcolor.replace("#", "");
  const r = parseInt(hexcolor.substr(0, 2), 16);
  const g = parseInt(hexcolor.substr(2, 2), 16);
  const b = parseInt(hexcolor.substr(4, 2), 16);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 128 ? "#000" : "#fff";
}

export default function BioBox({
  initialBio = "",
  editable = false,
  isOwner = false,
  onSave,
  backgroundColor = "#222222",
  textColor,
  fontFamily,
}) {
  const navigate = useNavigate();
  const [bio, setBio] = useState(initialBio);
  const [editing, setEditing] = useState(false);

  const { currentUser } = useUser();
  const userName = currentUser?.name || "User";

  const canEvalJS = currentUser?.securityLevel >= 5 || userName === "Raszyra";

  const handleSave = async () => {
    if (onSave) await onSave(bio);
    setEditing(false);
  };

  const renderBio = () => {
    if (!bio) return "No bio yet.";

    if (canEvalJS) {
      try {
        // Wrap in a function to avoid polluting globals
        processedBio = new Function("user", `
        const bio = \`${processedBio}\`;
        return bio;
      `)(currentUser);
      } catch (err) {
        processedBio = `Error in bio JS: ${err.message}`;
        console.error(err);
      }
    }

    const sanitized = DOMPurify.sanitize(
      bio.replace(/href="(\/[^"]*)"/g, 'data-internal="$1" href="$1"')
    );

    return (
      <span
        style={{ color: textColor || getContrastColor(backgroundColor), fontFamily: fontFamily || "inherit" }}
        dangerouslySetInnerHTML={{ __html: sanitized }}
        onClick={(e) => {
          const internal = e.target.getAttribute("data-internal");
          if (internal) {
            e.preventDefault();
            navigate(internal);
          }
        }}
      />
    );
  };

  const fgColor = textColor || getContrastColor(backgroundColor);

  return (
    <div
      style={{
        backgroundColor: backgroundColor,
        color: fgColor,
        fontFamily: fontFamily || "inherit",
        padding: "1rem",
        borderRadius: "6px",
        margin: "1rem 0",
      }}
    >
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
              backgroundColor: backgroundColor,
              color: fgColor,
              fontFamily: fontFamily || "inherit",
              border: "1px solid #555",
            }}
          />
          {editable && isOwner && (
            <>
              <button
                onClick={handleSave}
                style={{
                  marginTop: "0.5rem",
                  padding: "0.5rem 1rem",
                  background: "#444",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Save
              </button>
              <button
                onClick={() => setEditing(false)}
                style={{
                  marginLeft: "0.5rem",
                  padding: "0.5rem 1rem",
                  background: "gray",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
            </>
          )}
        </>
      ) : (
        <>
          {renderBio()}
          {editable && isOwner && !editing && (
            <button
              onClick={() => setEditing(true)}
              style={{
                marginTop: "0.5rem",
                padding: "0.5rem 1rem",
                background: "#444",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Edit
            </button>
          )}
        </>
      )}
    </div>
  );
}
