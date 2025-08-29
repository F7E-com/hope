import React from "react";
import { useNavigate } from "react-router-dom";
import MediaViewer from "../MediaViewer";
import LikeButton from "../LikeButton";
import { THEMES } from "../../themes/ThemeIndex";

export default function ContentModule({ post, currentUser, pageTheme }) {
  const navigate = useNavigate();

  if (!post) return <p>Loading...</p>;

  // Theme: post overrides page theme
  const theme =
    THEMES[post.themeId] ||
    THEMES[pageTheme] || {
      preview: { background: "#fff", color: "#000" },
      fontFamily: "inherit",
    };

  const handleClick = () => {
    navigate(`/content/${post.id}`); // assumes media pages are served at /content/:id
  };

  if (theme.texture) {
    backgroundLayers.push(theme.texture);
  }
  
  // Background handling: allow gradient + texture layers
  let backgroundLayers = [];
  if (theme.preview?.background) {
    if (theme.preview.background.includes("gradient")) {
      backgroundLayers.push(theme.preview.background);
    } else {
      // solid color will be handled separately
    }
  }

  return (
    <div
      className="content-module group cursor-pointer"
      onClick={handleClick}
      style={{
        backgroundColor:
          theme.preview?.background &&
            !theme.preview.background.includes("gradient")
            ? theme.preview.background
            : undefined,
        backgroundImage: backgroundLayers.length > 0 ? backgroundLayers.join(", ") : "none",
        backgroundSize: "cover",
        color: theme.preview?.color || "#000",
        fontFamily: theme.fontFamily || "inherit",
        border: theme.border || "none",
        borderRadius: theme.borderRadius || "8px",
        boxShadow: theme.boxShadow || "none",
        padding: theme.modulePadding || "1rem",
        margin: theme.moduleMargin || "1rem auto",
        transition: "all 0.3s ease",
      }}
    >
      <h4
        style={{ marginBottom: "0.5rem" }}
        onClick={(e) => e.stopPropagation()} // stops bubbling so creator link still works
      >
        {post.title} by{" "}
        <a
          href={`/profile/${post.creatorId}`}
          style={{
            color: theme.preview?.color || "#000",
            textDecoration: "underline",
          }}
        >
          {post.creatorName}
        </a>
      </h4>

      <div className="media-viewer-wrapper">
        <MediaViewer type={post.mediaType} src={post.mediaSrc} />
      </div>

      {post.description && (
        <p className="content-description">{post.description}</p>
      )}

      <div
        onClick={(e) => e.stopPropagation()} // stop click bubbling so Like doesn’t navigate
      >
        <LikeButton
          contentCreatorId={post.creatorId}
          contentCreatorFaction={post.creatorFaction}
          currentUser={currentUser}
        />
      </div>
    </div>
  );
}
