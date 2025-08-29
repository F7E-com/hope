import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import MediaViewer from "../MediaViewer";
import LikeButton from "../LikeButton";
import { THEMES } from "../../themes/ThemeIndex";
import { db } from "../../utils/firebase"; // make sure you’ve got this set up
import { doc, deleteDoc } from "firebase/firestore";

export default function ContentModule({ post, currentUser, pageTheme }) {
  const navigate = useNavigate();
  const [deleting, setDeleting] = useState(false);
  const [deleted, setDeleted] = useState(false);

  if (!post) return <p>Loading...</p>;
  if (deleted) return <p style={{ color: "red" }}>✅ Post deleted</p>;

  // Theme: post overrides page theme
  const theme =
    THEMES[post.themeId] ||
    THEMES[pageTheme] || {
      preview: { background: "#fff", color: "#000" },
      fontFamily: "inherit",
    };

  const handleClick = () => {
    navigate(`/content/${post.id}`);
  };

  const handleDelete = async (e) => {
    e.stopPropagation(); // stop the post box click
    const confirmDelete = window.confirm("Are you sure you want to delete this post?");
    if (!confirmDelete) return;

    try {
      setDeleting(true);
      await deleteDoc(doc(db, "posts", post.id));
      setDeleted(true);
    } catch (err) {
      console.error("❌ Error deleting post:", err);
      alert("Something went wrong while deleting.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div
      className="content-module group relative cursor-pointer"
      onClick={handleClick}
      style={{
        background: theme.preview.background,
        color: theme.preview.color,
        fontFamily: theme.fontFamily || "inherit",
        border: theme.border || "none",
        borderRadius: theme.borderRadius || "8px",
        padding: theme.modulePadding || "1rem",
        margin: theme.moduleMargin || "1rem 0",
        boxShadow: theme.boxShadow || "none",
        backgroundImage: theme.texture ? `url(${theme.texture})` : "none",
        backgroundSize: "cover",
        backgroundBlendMode: "overlay",
        transition: "all 0.3s ease",
      }}
    >
      {/* Delete button only if post owner */}
      {post.creatorId === currentUser?.id && (
        <button
          onClick={handleDelete}
          disabled={deleting}
          style={{
            position: "absolute",
            top: "8px",
            left: "8px",
            background: "rgba(0,0,0,0.6)",
            color: "white",
            border: "none",
            borderRadius: "50%",
            width: "28px",
            height: "28px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
          title="Delete post"
        >
          ✕
        </button>
      )}

      <h4
        style={{ marginBottom: "0.5rem" }}
        onClick={(e) => e.stopPropagation()}
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
        <MediaViewer type={post.mediaType} src={post.mediaSrc} title={post.title} />
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
