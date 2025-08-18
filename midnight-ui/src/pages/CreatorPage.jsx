import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc, collection, getDocs, addDoc, updateDoc } from "firebase/firestore";
import { db } from "@/utils/firebase";
import { useUser } from "../contexts/UserContext";
import ContentModule from "../components/modules/ContentModule";
import ThemePickerDropdown from "../components/modules/ThemePickerDropdown";
import { THEMES } from "../themes/ThemeIndex";

function CreatorBanner({ creatorData, selectedTheme, setSelectedTheme, isOwner, customColor, setCustomColor }) {
  const [bannerUrl, setBannerUrl] = useState(creatorData?.banner || "");

  const handleBannerChange = async () => {
    if (!isOwner) return;
    try {
      await updateDoc(doc(db, "users", creatorData.id), { banner: bannerUrl });
    } catch (err) {
      console.error("Error updating banner:", err);
    }
  };

  const bannerStyle = {
    width: "100%",
    height: "200px",
    borderRadius: "12px",
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "center",
    backgroundImage: bannerUrl ? `url(${bannerUrl})` : "none",
    backgroundColor: "#333",
    backgroundSize: "cover",
    backgroundPosition: "center",
    color: selectedTheme?.preview?.color || "#fff",
    fontFamily: selectedTheme?.fontFamily || "inherit",
    position: "relative",
    padding: "1rem",
  };

  return (
    <div style={{ marginBottom: "1rem" }}>
      <div style={bannerStyle}>
        <h1 style={{ margin: 0, textShadow: "1px 1px 3px rgba(0,0,0,0.7)" }}>
          {creatorData?.name || "Unknown Creator"}
        </h1>
      </div>
      {isOwner && (
        <div style={{ marginTop: "0.5rem", display: "flex", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
          <input
            type="text"
            placeholder="Banner Image URL"
            value={bannerUrl}
            onChange={(e) => setBannerUrl(e.target.value)}
            style={{ flex: "1 1 250px" }}
          />
          <button onClick={handleBannerChange}>Save Banner</button>

          <ThemePickerDropdown
            unlockedThemes={Object.keys(THEMES)}
            selectedTheme={selectedTheme?.id || "none"}
            onChange={(themeId) => setSelectedTheme(themeId === "none" ? null : THEMES[themeId])}
            customColor={customColor}
            onCustomColorChange={setCustomColor}
          />
        </div>
      )}
    </div>
  );
}

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
    description: ""
  });

  const [pageTheme, setPageTheme] = useState(null);
  const [customColor, setCustomColor] = useState(null);

  const isOwner = currentUser?.id === uid;

  useEffect(() => {
    if (!uid) return;

    const fetchCreator = async () => {
      setLoading(true);
      try {
        const userSnap = await getDoc(doc(db, "users", uid));
        const safeCreatorData = userSnap.exists()
          ? {
              id: uid,
              name: userSnap.data()?.name || "Unknown Creator",
              themeId: userSnap.data()?.themeId || "none",
              faction: userSnap.data()?.faction || "Unknown",
              bio: userSnap.data()?.bio || "",
              avatar: userSnap.data()?.avatar || "",
              banner: userSnap.data()?.banner || "",
              ...userSnap.data()
            }
          : { id: uid, name: "Unknown Creator", themeId: "none", faction: "Unknown", bio: "", avatar: "", banner: "" };

        setCreatorData(safeCreatorData);

        const postsSnap = await getDocs(collection(db, "users", uid, "posts"));
        const postList = postsSnap.docs.map(docSnap => {
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
            date: data.date || null
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

  const effectiveTheme = customColor
    ? { preview: { background: customColor, color: "#fff" }, fontFamily: creatorData?.fontFamily || "inherit" }
    : pageTheme || THEMES[creatorData?.themeId] || { preview: { background: "#222", color: "#fff" } };

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
          themeId: effectiveTheme?.id || "none",
          description: newPost.description || "",
          date: newPost.date || null
        }
      ]);
      setNewPost({ title: "", mediaType: "image", src: "", themeId: "none", description: "" });
    } catch (err) {
      console.error("Error creating post:", err);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!creatorData) return <p>Creator not found.</p>;

  return (
    <div
      style={{
        maxWidth: "900px",
        margin: "2rem auto",
        padding: "1rem",
        borderRadius: "12px",
        backgroundColor: effectiveTheme.preview.background,
        color: effectiveTheme.preview.color,
        fontFamily: effectiveTheme.fontFamily || "inherit",
      }}
    >
      <CreatorBanner
        creatorData={creatorData}
        selectedTheme={effectiveTheme}
        setSelectedTheme={setPageTheme}
        customColor={customColor}
        setCustomColor={setCustomColor}
        isOwner={isOwner}
      />

      {isOwner && (
        <div style={{ margin: "1rem 0", padding: "1rem", border: "1px solid #555", borderRadius: "8px" }}>
          <h3>New Post</h3>
          <input
            type="text"
            placeholder="Title"
            value={newPost.title}
            onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
          />
          <br/><br/>
          <input
            type="text"
            placeholder="Media URL"
            value={newPost.src}
            onChange={(e) => setNewPost({ ...newPost, src: e.target.value })}
          />
          <br/><br/>
          <select value={newPost.mediaType} onChange={(e) => setNewPost({ ...newPost, mediaType: e.target.value })}>
            <option value="image">Image</option>
            <option value="youtube">YouTube</option>
            <option value="video">Video</option>
          </select>
          <br/><br/>
          <textarea
            placeholder="Description"
            value={newPost.description}
            onChange={(e) => setNewPost({ ...newPost, description: e.target.value })}
          />
          <br/><br/>
          <button onClick={handleNewPostSubmit}>Upload</button>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {posts.map(post => (
          <ContentModule key={post.id} post={post} currentUser={currentUser} />
        ))}
      </div>
    </div>
  );
}
