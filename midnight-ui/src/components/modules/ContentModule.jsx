import React from "react";
import { useNavigate } from "react-router-dom";
import { doc, deleteDoc } from "firebase/firestore";
import { db } from "../../utils/firebase";
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

  // Background handling: texture under gradient/solid
  let backgroundLayers = [];
  if (theme.texture) {
    backgroundLayers.push(theme.texture); // texture first
  }
  if (theme.preview?.background) {
    if (theme.preview.background.includes("gradient")) {
      backgroundLayers.push(theme.preview.background); // gradient on top
    }
  }

  const handleClick = () => {
    navigate(`/content/${post.id}`);
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (!currentUser || post.creatorId !== currentUser.id) return;

    const confirmDelete = window.confirm("Are you sure you want to delete this post?");
    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, "posts", post.id));
      alert("Post deleted");
      window.location.reload(); // refresh to remove the post
    } catch (err) {
      console.error("Error deleting post:", err);
      alert("Failed to delete post");
    }
  };

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
        backgroundImage:
          backgroundLayers.length > 0 ? backgroundLayers.join(", ") : "none",
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
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h4
          style={{ marginBottom: "0.5rem" }}
          onClick={(e) => e.stopPropagation()}
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
        {currentUser?.id === post.creatorId && (
          <button
            onClick={handleDelete}
            style={{
              background: "transparent",
              border: "none",
              color: theme.preview?.color || "#000",
              fontSize: "1.2rem",
              cursor: "pointer",
            }}
            title="Delete post"
          >
            ×
          </button>
        )}
      </div>

      <div className="media-viewer-wrapper">
        <MediaViewer type={post.mediaType} src={post.mediaSrc} />
      </div>

      {post.description && <p className="content-description">{post.description}</p>}

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
