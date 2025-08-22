import React from "react";
import MediaViewer from "../MediaViewer";
import LikeButton from "../LikeButton";
import { THEMES } from "../../themes/ThemeIndex";

export default function ContentModule({ post, currentUser, pageTheme }) {
  if (!post) return <p>Loading...</p>;

  // Determine which theme to use: post theme overrides page theme
  const theme = THEMES[post.themeId] || THEMES[pageTheme] || { preview: { background: "#fff", color: "#000" }, fontFamily: "inherit" };

  return (
    <div
      className="content-module"
      style={{
        backgroundColor: theme.preview.background,
        color: theme.preview.color,
        fontFamily: theme.fontFamily || "inherit",
        borderRadius: "8px",
        padding: "1rem",
        transition: "all 0.3s ease",
      }}
    >
      <h4 style={{ marginBottom: "0.5rem" }}>
        {post.title} by{" "}
        <a
          href={`/profile/${post.creatorId}`}
          style={{ color: theme.preview.color, textDecoration: "underline" }}
        >
          {post.creatorName}
        </a>
      </h4>

      <MediaViewer type={post.mediaType} src={post.mediaSrc} />

      {post.description && <p className="content-description">{post.description}</p>}

      <LikeButton
        contentCreatorId={post.creatorId}
        contentCreatorFaction={post.creatorFaction}
        currentUser={currentUser}
      />
    </div>
  );
}
