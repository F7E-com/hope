// BioBox.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DOMPurify from "dompurify";

export default function BioBox({
  initialBio = "",
  editable = false,
  isOwner = false,   // new prop for profile ownership
  onSave,
  themeColor = "#222222",
}) {
  const navigate = useNavigate();
  const [bio, setBio] = useState(initialBio);
  const [editing, setEditing] = useState(false);

  const handleSave = async () => {
    if (onSave) await onSave(bio);
    setEditing(false);
  };

  const renderBio = () => {
    if (!bio) return "No bio yet.";

    const sanitized = DOMPurify.sanitize(
      bio.replace(/href="(\/[^"]*)"/g, 'data-internal="$1" href="$1"')
    );

    return (
      <span
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

  return (
    <div
      style={{
        background: editing ? "#222" : themeColor,
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
              color: "black",
            }}
          />
          {editable && isOwner && (
            <>
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
          )}
        </>
      ) : (
        <>
          {renderBio()}
          {editable && isOwner && !editing && (
            <button
              onClick={() => setEditing(true)}
              style={{ marginTop: "0.5rem", padding: "0.5rem 1rem" }}
            >
              Edit
            </button>
          )}
        </>
      )}
    </div>
  );
}
