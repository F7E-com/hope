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
      name: "Default",
      className: "",
      preview: { background: "#fff", color: "#000" },
      fontFamily: "inherit",
    };

  const handleClick = () => {
    navigate(`/content/${post.id}`);
  };

  return (
    <div
      className={`content-module group cursor-pointer ${theme.className || ""}`}
      onClick={handleClick}
      style={{
        background: theme.preview?.background || "#fff",
        color: theme.preview?.color || "#000",
        fontFamily: theme.fontFamily || "inherit",
        border: theme.border || "none",
        borderRadius: theme.borderRadius || "8px",
        boxShadow: theme.boxShadow || "none",
        padding: theme.modulePadding || "1rem",
        margin: theme.moduleMargin || "1rem auto",
        backgroundImage: theme.texture || "none",
        backgroundSize: theme.texture ? "cover" : "auto",
        transition: "all 0.3s ease",
      }}
    >
      <h4
        style={{ marginBottom: "0.5rem" }}
        onClick={(e) => e.stopPropagation()}
      >
        {post.title} by{" "}
        <a
          href={`/profile/${post.creatorId}`}
          style={{
            color: theme.accents?.primary || theme.preview?.color,
            textDecoration: "underline",
          }}
        >
          {post.creatorName}
        </a>
      </h4>

      <div className="media-viewer-wrapper">
        <MediaViewer type={post.mediaType} src={post.mediaSrc || post.src} />
      </div>

      {post.description && (
        <p className="content-description">{post.description}</p>
      )}

      <div onClick={(e) => e.stopPropagation()}>
        <LikeButton
          contentCreatorId={post.creatorId}
          contentCreatorFaction={post.creatorFaction}
          currentUser={currentUser}
        />
      </div>
    </div>
  );
}
