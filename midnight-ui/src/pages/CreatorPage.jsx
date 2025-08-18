import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc, collection, getDocs, addDoc, updateDoc } from "firebase/firestore";
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

  // State for editing creator banner/theme
  const [banner, setBanner] = useState("");
  const [creatorTheme, setCreatorTheme] = useState("none");
  const [customColor, setCustomColor] = useState("#ffffff");

  const [newPost, setNewPost] = useState({
    title: "",
    mediaType: "image",
    src: "",
    themeId: "none",
    description: "",
    banner: "",
  });

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

  if (loading) return <p>Loading...</p>;
  if (!creatorData) return <p>Creator not found.</p>;

  const theme =
    creatorTheme === "custom"
      ? { preview: { background: customColor, color: "#000" } }
      : THEMES[creatorTheme] || { preview: { background: "#222", color: "#fff" } };

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

      {isOwner && (
        <div
          style={{
            marginBottom: "2rem",
            padding: "1rem",
            border: "1px solid #555",
            borderRadius: "8px",
            background: "#111",
          }}
        >
          <h3>Edit Creator Theme & Banner</h3>
          <ThemePickerDropdown
            unlockedThemes={Object.keys(THEMES)}
            selectedTheme={creatorTheme}
            onChange={setCreatorTheme}
            customColor={customColor}
            onCustomColorChange={setCustomColor}
          />
          <br />
          <input
            type="text"
            placeholder="Banner URL"
            value={banner}
            onChange={(e) => setBanner(e.target.value)}
            style={{ color: "#000", width: "100%", marginTop: "0.5rem" }}
          />
          <br />
          <button onClick={saveCreatorTheme} style={{ marginTop: "0.5rem" }}>
            Save Theme & Banner
          </button>
        </div>
      )}

      {/* New post panel */}
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
                  To get the embed link for a YouTube video, click "Share" on the video, then "embed",
                  then copy *just the link.* 
                  It should look like this: "https://www.youtube.com/embed/lqZWO5K1xtA?si=iimdDkw2Jx-Gf9wP"
                </p>
              )}
              {newPost.mediaType === "gdrive" && (
                <p>
                  Paste the "Share link" of your Google Drive file and make sure link sharing is enabled. <br />
                  (Options -> Sharing -> Anyone with the link can view)
                  Important! If you want to view in-page, find "view" in the link and change to "preview".
                </p>
              )}
            </div>
          )}
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
