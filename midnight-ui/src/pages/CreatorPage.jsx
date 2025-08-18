import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc, collection, getDocs, addDoc } from "firebase/firestore";
import { db } from "@/utils/firebase";
import { useUser } from "../contexts/UserContext";
import ContentModule from "../components/modules/ContentModule";
import ThemePickerDropdown from "../components/modules/ThemePickerDropdown";
import { THEMES } from "../themes/ThemeIndex";

export default function CreatorPage() {
  const { uid } = useParams();
  const { currentUser } = useUser();

  const [creatorData, setCreatorData] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newPost, setNewPost] = useState({
    title: "",
    mediaType: "image",
    src: "",
    themeId: "none",
    description: "",
    banner: "",
  });

  const [pageTheme, setPageTheme] = useState("none");
  const [customColor, setCustomColor] = useState("#ffffff");

  const isOwner = currentUser?.id === uid;

  useEffect(() => {
    if (!uid) return;

    const fetchCreator = async () => {
      setLoading(true);
      try {
        const userSnap = await getDoc(doc(db, "users", uid));
        const safeCreatorData = userSnap.exists()
          ? {
              name: userSnap.data()?.name || "Unknown Creator",
              themeId: userSnap.data()?.themeId || "none",
              faction: userSnap.data()?.faction || "Unknown",
              bio: userSnap.data()?.bio || "",
              avatar: userSnap.data()?.avatar || "",
              banner: userSnap.data()?.banner || "",
              ...userSnap.data(),
            }
          : {
              name: "Unknown Creator",
              themeId: "none",
              faction: "Unknown",
              bio: "",
              avatar: "",
              banner: "",
            };

        setCreatorData(safeCreatorData);

        const postsSnap = await getDocs(collection(db, "users", uid, "posts"));
        const postList = postsSnap.docs.map((docSnap) => {
          const data = docSnap.data() || {};
          return {
            id: docSnap.id,
            creatorId: uid,
            creatorName: safeCreatorData.name,
            creatorFaction: safeCreatorData.faction,
            title: data.title || "Untitled",
            mediaType: data.mediaType || "image",
            mediaSrc: data.src || "",
            themeId: data.themeId || "none",
            description: data.description || "",
            date: data.date || null,
          };
        });
        setPosts(postList);
      } catch (err) {
        console.error("Error fetching creator:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCreator();
  }, [uid]);

  const handleNewPostSubmit = async () => {
    if (!isOwner) return;
    try {
      const postRef = await addDoc(collection(db, "users", uid, "posts"), newPost);
      setPosts([
        ...posts,
        {
          id: postRef.id,
          creatorId: uid,
          creatorName: creatorData?.name || "Unknown Creator",
          creatorFaction: creatorData?.faction || "Unknown",
          title: newPost.title || "Untitled",
          mediaType: newPost.mediaType || "image",
          mediaSrc: newPost.src || "",
          themeId: newPost.themeId || "none",
          description: newPost.description || "",
          banner: newPost.banner || "",
          date: newPost.date || null,
        },
      ]);
      setNewPost({
        title: "",
        mediaType: "image",
        src: "",
        themeId: "none",
        description: "",
        banner: "",
      });
    } catch (err) {
      console.error("Error creating post:", err);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!creatorData) return <p>Creator not found.</p>;

  const theme =
    pageTheme === "custom"
      ? { preview: { background: customColor, color: "#000" } }
      : THEMES[pageTheme] || THEMES[creatorData.themeId] || { preview: { background: "#222", color: "#fff" } };

  return (
    <div
      style={{
        maxWidth: "900px",
        margin: "2rem auto",
        padding: "1rem",
        borderRadius: "12px",
        backgroundColor: theme.preview.background,
        color: theme.preview.color,
        fontFamily: theme.fontFamily || "inherit",
      }}
    >
      {/* Banner with creator name */}
      <div
        style={{
          width: "100%",
          height: "200px",
          backgroundImage: `url(${creatorData.banner || ""})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          borderRadius: "8px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "1rem",
        }}
      >
        <h1
          style={{
            color: "#fff",
            background: "rgba(0,0,0,0.4)",
            padding: "0.5rem 1rem",
            borderRadius: "6px",
          }}
        >
          {creatorData.name}
        </h1>
        <br />

        {/* Theme picker dropdown */}
          <ThemePickerDropdown
            unlockedThemes={Object.keys(THEMES)}
            selectedTheme={newPost.themeId}
            onChange={(value) => setNewPost({ ...newPost, themeId: value })}
            customColor={customColor}
            onCustomColorChange={(color) => setCustomColor(color)}
          />
          <br />

          {/* Banner URL input */}
          <input
            type="text"
            placeholder="Banner Image URL"
            value={newPost.banner}
            onChange={(e) => setNewPost({ ...newPost, banner: e.target.value })}
            style={{ color: "#000" }}
          />
      </div>

      {/* Owner-only upload panel */}
      {isOwner && (
        <div
          style={{
            margin: "1rem 0",
            padding: "1rem",
            border: "1px solid #555",
            borderRadius: "8px",
            background: "#111",
          }}
        >
          <h3>New Post</h3>
          <br />

          <input
            type="text"
            placeholder="Title"
            value={newPost.title}
            onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
            style={{ color: "#000" }}
          />
          <br />
          <br />

          <input
            type="text"
            placeholder="Media URL"
            value={newPost.src}
            onChange={(e) => setNewPost({ ...newPost, src: e.target.value })}
            style={{ color: "#000" }}
          />
          <br />
          <br />

          <select
            value={newPost.mediaType}
            onChange={(e) => setNewPost({ ...newPost, mediaType: e.target.value })}
            style={{ color: "#000" }}
          >
            <option value="image">Image</option>
            <option value="youtube">YouTube</option>
            <option value="video">Video</option>
          </select>
          <br />
          <br />

          <textarea
            placeholder="Description"
            value={newPost.description}
            onChange={(e) => setNewPost({ ...newPost, description: e.target.value })}
            style={{ color: "#000" }}
          />
          <br />
          <br />

          <button onClick={handleNewPostSubmit}>Upload</button>
        </div>
      )}

      {/* Content list */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {posts.map((post) => (
          <ContentModule key={post.id} post={post} currentUser={currentUser} />
        ))}
      </div>
    </div>
  );
}
