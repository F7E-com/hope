// CreatorPage.jsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc, collection, getDocs, addDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "@/utils/firebase";
import { useUser } from "../contexts/UserContext";
import ContentModule from "../components/modules/ContentModule";
import ThemePickerDropdown from "../components/modules/ThemePickerDropdown";
import { THEMES } from "../themes/ThemeIndex";
import "../themes/FactionThemes.css"; // Make sure CSS is imported

export default function CreatorPage() {
  const { uid } = useParams();
  const { currentUser } = useUser();
  const isOwner = currentUser?.id === uid;

  const [creatorData, setCreatorData] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [banner, setBanner] = useState("");
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
              banner: userSnap.data()?.banner || "",
              ...userSnap.data(),
            }
          : { name: "Unknown Creator", themeId: "none", banner: "" };
        setCreatorData(safeCreatorData);
        setBanner(safeCreatorData.banner);

        const postsSnap = await getDocs(collection(db, "users", uid, "posts"));
        const postList = postsSnap.docs.map((docSnap) => ({
          id: docSnap.id,
          creatorId: uid,
          creatorName: safeCreatorData.name,
          creatorFaction: safeCreatorData.faction || "Unknown",
          title: docSnap.data()?.title || "Untitled",
          mediaType: docSnap.data()?.mediaType || "image",
          mediaSrc: docSnap.data()?.src || "",
          themeId: docSnap.data()?.themeId || "none",
          description: docSnap.data()?.description || "",
          date: docSnap.data()?.date || null,
        }));
        setPosts(postList);

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

  const savePageTheme = async () => {
    if (!isOwner) return;
    try {
      await setDoc(
        doc(db, "creatorPages", uid),
        { creatorPageThemeId: pageThemeId, customColor: pageCustomColor },
        { merge: true }
      );
      alert("Page theme saved!");
    } catch (err) {
      console.error("Error saving page theme:", err);
    }
  };

  const handleNewPostSubmit = async () => {
    if (!isOwner) return;
    try {
      const postRef = await addDoc(collection(db, "users", uid, "posts"), newPost);
      setPosts([
        ...posts,
        { ...newPost, id: postRef.id, creatorName: creatorData?.name || "Unknown" },
      ]);
      setNewPost({ title: "", mediaType: "image", src: "", themeId: "none", description: "", banner: "" });
    } catch (err) {
      console.error("Error creating post:", err);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!creatorData) return <p>Creator not found.</p>;

  const pageThemeClass =
    pageThemeId === "custom" ? "" : THEMES[pageThemeId]?.className || "";

  const pageStyle =
    pageThemeId === "custom"
      ? { background: pageCustomColor, color: "#000" }
      : {};

  return (
    <div className={`creator-page ${pageThemeClass}`} style={pageStyle}>
      {/* Banner */}
      <div
        className="creator-banner"
        style={{ backgroundImage: `url(${banner})` }}
      >
        <h1>{creatorData.name}</h1>
      </div>

      {/* Theme picker */}
      {isOwner && (
        <div className="theme-editor">
          <h3>Edit Creator Page Theme</h3>
          <ThemePickerDropdown
            unlockedThemes={Object.keys(THEMES)}
            selectedTheme={pageThemeId}
            onChange={setPageThemeId}
            customColor={pageCustomColor}
            onCustomColorChange={setPageCustomColor}
          />
          <input
            type="color"
            value={pageCustomColor}
            onChange={(e) => setPageCustomColor(e.target.value)}
          />
          <button onClick={savePageTheme}>Save Theme</button>
        </div>
      )}

      {/* New Post */}
      {isOwner && (
        <div className="new-post-panel">
          <h3>New Post</h3>
          <input
            type="text"
            placeholder="Title"
            value={newPost.title}
            onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
          />
          <input
            type="text"
            placeholder="Media URL"
            value={newPost.src}
            onChange={(e) => setNewPost({ ...newPost, src: e.target.value })}
          />
          <select
            value={newPost.mediaType}
            onChange={(e) => setNewPost({ ...newPost, mediaType: e.target.value })}
          >
            <option value="image">Image</option>
            <option value="youtube">YouTube</option>
            <option value="video">Video</option>
            <option value="gdrive">GDrive</option>
            <option value="audio">Audio</option>
            <option value="pdf">PDF</option>
            <option value="text">Text</option>
            <option value="webpage">Webpage</option>
          </select>

          <ThemePickerDropdown
            unlockedThemes={Object.keys(THEMES)}
            selectedTheme={newPost.themeId}
            onChange={(t) => setNewPost({ ...newPost, themeId: t })}
          />
          <textarea
            placeholder="Description"
            value={newPost.description}
            onChange={(e) => setNewPost({ ...newPost, description: e.target.value })}
          />
          <button onClick={handleNewPostSubmit}>Upload</button>
        </div>
      )}

      {/* Posts */}
      <div className="posts-list">
        {posts.map((post) => (
          <ContentModule key={post.id} post={post} currentUser={currentUser} />
        ))}
      </div>
    </div>
  );
}
