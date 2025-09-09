import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { doc, deleteDoc } from "firebase/firestore";
import { db } from "../../utils/firebase";
import MediaViewer from "../MediaViewer";
import LikeButton from "../LikeButton";
import PostKudosGraph from "../PostKudosGraph";
import { THEMES } from "../../themes/ThemeIndex";

export default function ContentModule({ post: initialPost, currentUser, pageTheme }) {
  const navigate = useNavigate();

  const [post, setPost] = useState({
    ...initialPost,
    kudos: initialPost.kudos || {}, // ensure kudos exists
  });
  const [liked, setLiked] = useState(false);
  const [localKudos, setLocalKudos] = useState(null);

  if (!post) return <p>Loading...</p>;

  const theme =
    THEMES[post.themeId] ||
    THEMES[pageTheme] || {
      preview: { background: "#fff", color: "#000" },
      fontFamily: "inherit",
    };

  const handleClick = () => navigate(`/content/${post.id}`);

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (!currentUser || post.creatorId !== currentUser.id) return;
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      await deleteDoc(doc(db, "posts", post.id));
      alert("Post deleted");
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Failed to delete post");
    }
  };

  const handleLocalLike = (giverFaction, creatorFaction) => {
    const newKudos = { ...(post.kudos || {}) };
    newKudos[giverFaction] = (newKudos[giverFaction] || 0) + 10;
    newKudos[creatorFaction] = (newKudos[creatorFaction] || 0) + 1;
    setPost({ ...post, kudos: newKudos });
    setLocalKudos({ giverFaction, creatorFaction });
    setLiked(true);
  };

  return (
    <div
      className="content-module group cursor-pointer relative"
      onClick={handleClick}
      style={{
        backgroundColor:
          theme.preview?.background && !theme.preview.background.includes("gradient")
            ? theme.preview.background
            : undefined,
        backgroundImage: theme.texture
          ? `${theme.texture}${
              theme.preview?.background?.includes("gradient")
                ? `, ${theme.preview.background}`
                : ""
            }`
          : theme.preview?.background?.includes("gradient")
          ? theme.preview.background
          : undefined,
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
        <h4 style={{ marginBottom: "0.5rem" }} onClick={(e) => e.stopPropagation()}>
          {post.title} by{" "}
          <a
            href={`/profile/${post.creatorId}`}
            style={{ color: theme.preview?.color || "#000", textDecoration: "underline" }}
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

      <div className="flex items-center gap-4" onClick={(e) => e.stopPropagation()}>
        {!liked && (
          <LikeButton
            contentCreatorId={post.creatorId}
            contentCreatorFaction={post.creatorFaction}
            currentUser={currentUser}
            postId={post.id}
            onLocalLike={handleLocalLike}
          />
        )}
        <PostKudosGraph post={post} theme={theme} localKudos={localKudos} />
      </div>
    </div>
  );
}
