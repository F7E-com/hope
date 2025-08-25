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

  return (
    <div
      className="content-module group cursor-pointer"
      onClick={handleClick}
      style={{
        backgroundColor: theme.preview.background,
        color: theme.preview.color,
        fontFamily: theme.fontFamily || "inherit",
        borderRadius: "8px",
        padding: "1rem",
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
            color: theme.preview.color,
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
