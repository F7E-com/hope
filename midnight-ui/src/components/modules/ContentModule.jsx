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

  // Background handling: allow gradient + texture layers
  let backgroundLayers = [];
  if (theme.preview?.background) {
    if (theme.preview.background.includes("gradient")) {
      backgroundLayers.push(theme.preview.background);
    }
  }
  if (theme.texture) {
    backgroundLayers.push(theme.texture);
  }

  const handleClick = () => {
    navigate(`/content/${post.id}`); // assumes media pages are served at /content/:id
  };

  const handleDelete = async (e) => {
    e.stopPropagation(); // don’t trigger navigation
    const confirmed = window.confirm("Are you sure you want to delete this post?");
    if (!confirmed) return;

    try {
      await deleteDoc(doc(db, "posts", post.id));
      alert("✅ Post deleted.");
    } catch (err) {
      console.error("Error deleting post:", err);
      alert("❌ Failed to delete post.");
    }
  };

  return (
    <div
      className="content-module group relative cursor-pointer"
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
      {/* Delete button, only if user owns post */}
      {currentUser?.id === post.creatorId && (
        <button
          onClick={handleDelete}
          className="absolute top-2 left-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-700"
        >
          ✕
        </button>
      )}

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
