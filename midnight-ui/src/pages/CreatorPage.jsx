// CreatorPage.jsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc, collection, getDocs, addDoc, updateDoc, setDoc } from "firebase/firestore";
import { db } from "@/utils/firebase";
import { useUser } from "../contexts/UserContext";
import ContentModule from "../components/modules/ContentModule";
import ThemePickerDropdown from "../components/modules/ThemePickerDropdown";
import { THEMES } from "../themes/ThemeIndex";
import "../themes/FactionThemes.css"; // Ensure CSS is imported

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

  return (
    <div className={`creator-page-wrapper ${pageThemeId}`}>
      {/* Banner */}
      <div className="creator-banner" style={{ backgroundImage: `url(${banner})` }}>
        <h1>{creatorData.name}</h1>
      </div>

      {/* Creator profile/theme editor */}
      {isOwner && (
        <div className="creator-controls">
          <h3>Edit Creator Theme & Banner</h3>
          <ThemePickerDropdown
            unlockedThemes={Object.keys(THEMES)}
            selectedTheme={pageThemeId}
            onChange={setPageThemeId}
            customColor={pageCustomColor}
            onCustomColorChange={setPageCustomColor}
          />
          <label>
            Custom Theme Color:
            <input
              type="color"
              value={pageCustomColor}
              onChange={(e) => setPageCustomColor(e.target.value)}
            />
          </label>
          <input
            type="text"
            placeholder="Banner URL"
            value={banner}
            onChange={(e) => setBanner(e.target.value)}
          />
          <button onClick={savePageTheme}>Save Theme & Banner</button>
        </div>
      )}

      {/* New post panel */}
      {isOwner && (
        <div className="creator-controls">
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
            customColor={pageCustomColor}
            onCustomColorChange={setPageCustomColor}
          />

          <textarea
            placeholder="Description"
            value={newPost.description}
            onChange={(e) => setNewPost({ ...newPost, description: e.target.value })}
          />
          <button onClick={handleNewPostSubmit}>Upload</button>
        </div>
      )}

      {/* Content list */}
      <div className="creator-posts">
        {posts.map((post) => (
          <ContentModule
            key={post.id}
            post={post}
            currentUser={currentUser}
            className={THEMES[post.themeId]?.className || ""}
          />
        ))}
      </div>
    </div>
  );
}
