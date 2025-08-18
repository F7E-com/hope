// CreatorPage.jsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc, collection, getDocs, addDoc, updateDoc, setDoc } from "firebase/firestore";
import { db } from "@/utils/firebase";
import { useUser } from "../contexts/UserContext";
import ContentModule from "../components/modules/ContentModule";
import ThemePickerDropdown from "../components/modules/ThemePickerDropdown";
import { THEMES } from "../themes/ThemeIndex";

export default function CreatorPage() {
  const { uid } = useParams();
  const { currentUser } = useUser();
  const isOwner = currentUser?.id === uid;

  const [creatorData, setCreatorData] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Creator profile theme/banner
  const [banner, setBanner] = useState("");
  const [creatorTheme, setCreatorTheme] = useState("none");
  const [customColor, setCustomColor] = useState("#ffffff");

  // CreatorPage-specific theme
  const [pageThemeId, setPageThemeId] = useState("none");
  const [pageCustomColor, setPageCustomColor] = useState("#ffffff");

  const [newPost, setNewPost] = useState({
    title: "",
    mediaType: "image",
    src: "",
    themeId: "none",
    description: "",
    banner: "",
  });

  // Load creator profile + posts
  useEffect(() => {
    if (!uid) return;

    const fetchCreator = async () => {
      setLoading(true);
      try {
        // User profile
        const userSnap = await getDoc(doc(db, "users", uid));
        const safeCreatorData = userSnap.exists()
          ? {
              name: userSnap.data()?.name || "Unknown Creator",
              themeId: userSnap.data()?.themeId || "none",
              banner: userSnap.data()?.banner || "",
              ...userSnap.data(),
            }
          : { name: "Unknown Creator", themeId: "none", banner: "" };

        setCreatorData(safeCreatorData);
        setBanner(safeCreatorData.banner);
        setCreatorTheme(safeCreatorData.themeId);

        // Creator posts
        const postsSnap = await getDocs(collection(db, "users", uid, "posts"));
        const postList = postsSnap.docs.map((docSnap) => {
          const data = docSnap.data() || {};
          return {
            id: docSnap.id,
            creatorId: uid,
            creatorName: safeCreatorData.name,
            creatorFaction: safeCreatorData.faction || "Unknown",
            title: data.title || "Untitled",
            mediaType: data.mediaType || "image",
            mediaSrc: data.src || "",
            themeId: data.themeId || "none",
            description: data.description || "",
            date: data.date || null,
          };
        });
        setPosts(postList);

        // CreatorPage-specific theme
        const pageSnap = await getDoc(doc(db, "creatorPages", uid));
        if (pageSnap.exists()) {
          const pageData = pageSnap.data();
          setPageThemeId(pageData.creatorPageThemeId || "none");
          setPageCustomColor(pageData.customColor || "#ffffff");
        }
      } catch (err) {
        console.error("Error fetching creator:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCreator();
  }, [uid]);

  // Save creator profile theme/banner
  const saveCreatorTheme = async () => {
    if (!isOwner || !creatorData) return;
    try {
      await updateDoc(doc(db, "users", uid), {
        themeId: creatorTheme,
        banner: banner,
      });
      setCreatorData({ ...creatorData, themeId: creatorTheme, banner });
    } catch (err) {
      console.error("Error saving creator theme/banner:", err);
    }
  };

  // Save page-specific theme
  const savePageTheme = async () => {
    if (!isOwner) return;
    try {
      await setDoc(
        doc(db, "creatorPages", uid),
        {
          creatorPageThemeId: pageThemeId,
          customColor: pageCustomColor,
        },
        { merge: true }
      );
      alert("Page theme saved!");
    } catch (err) {
      console.error("Error saving page theme:", err);
    }
  };

  // Create new post
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

  const pageTheme =
    pageThemeId === "custom"
      ? { preview: { background: pageCustomColor, color: "#000" } }
      : THEMES[pageThemeId] || { preview: { background: "#222", color: "#fff" } };

  return (
    <div
      style={{
        maxWidth: "900px",
        margin: "2rem auto",
        padding: "1rem",
        borderRadius: "12px",
        backgroundColor: pageTheme.preview.background,
        color: pageTheme.preview.color,
        fontFamily: pageTheme.fontFamily || "inherit",
      }}
    >
      {/* Banner with creator name */}
      <div
        style={{
          width: "100%",
          height: "200px",
          backgroundImage: `url(${banner})`,
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
      </div>

      {/* Edit creator profile theme/banner */}
      {isOwner && (
        <div style={{ marginBottom: "2rem", padding: "1rem", border: "1px solid #555", borderRadius: "8px", background: "#111" }}>
          <h3>Edit Creator Theme & Banner</h3>
          <ThemePickerDropdown
            unlockedThemes={Object.keys(THEMES)}
            selectedTheme={pageThemeId}
            onChange={setPageThemeId}
            customColor={pageCustomColor}
            onCustomColorChange={setPageCustomColor}
          />
          <label>
                Theme Color:{" "}
                <input
                  type="color"
                  value={pageCustomColor}
                  onChange={(e) => setPageCustomColor(e.target.value)}
                />
          </label>
          <br />
          <input
            type="text"
            placeholder="Banner URL"
            value={banner}
            onChange={(e) => setBanner(e.target.value)}
            style={{ color: "#000", width: "100%", marginTop: "0.5rem" }}
          />
          <br />
          <button onClick={savePageTheme} style={{ marginTop: "0.5rem" }}>
            Save Theme & Banner
          </button>
        </div>
      )}

      {/* New post panel */}
      {isOwner && (
        <div style={{ margin: "1rem 0", padding: "1rem", border: "1px solid #555", borderRadius: "8px", background: "#111" }}>
          <h3>New Post</h3>
          <input
            type="text"
            placeholder="Title"
            value={newPost.title}
            onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
            style={{ color: "#000", width: "100%", marginBottom: "0.5rem" }}
          />
          <input
            type="text"
            placeholder="Media URL"
            value={newPost.src}
            onChange={(e) => setNewPost({ ...newPost, src: e.target.value })}
            style={{ color: "#000", width: "100%", marginBottom: "0.5rem" }}
          />
          <select
            value={newPost.mediaType}
            onChange={(e) => setNewPost({ ...newPost, mediaType: e.target.value })}
            style={{ color: "#000", marginBottom: "0.5rem" }}
          >
            <option value="image">Image</option>
            <option value="youtube">YouTube</option>
            <option value="video">Video</option>
            <option value="gdrive">GDrive</option>
          </select>

          {/* Conditional Instructions */}
          {(newPost.mediaType === "youtube" || newPost.mediaType === "gdrive") && (
            <div
              style={{
                marginTop: "0.5rem",
                padding: "0.5rem 1rem",
                backgroundColor: "#333",
                color: "#fff",
                borderRadius: "6px",
                fontSize: "0.9rem",
              }}
            >
              {newPost.mediaType === "youtube" && (
                <p>
                  To embed a YouTube video, click "Share" → "Embed", then copy just the `src` link.
                  Example: <br />
                  https://www.youtube.com/embed/lqZWO5K1xtA
                </p>
              )}
              {newPost.mediaType === "gdrive" && (
                <p>
                  Paste the Google Drive file share link, make sure "Anyone with the link can view" is
                  enabled, and replace <code>view</code> with <code>preview</code> for in-page display.
                </p>
              )}
            </div>
          )}

          {/* Theme picker for posts */}
          <ThemePickerDropdown
            unlockedThemes={Object.keys(THEMES)}
            selectedTheme={newPost.themeId}
            onChange={(t) => setNewPost({ ...newPost, themeId: t })}
            customColor={pageCustomColor}
            onCustomColorChange={setPageCustomColor}
          />

          <textarea
            placeholder="Description"
            value={newPost.description}
            onChange={(e) => setNewPost({ ...newPost, description: e.target.value })}
            style={{ color: "#000", width: "100%", marginBottom: "0.5rem" }}
          />
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
