import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc, collection, getDocs, addDoc } from "firebase/firestore";
import { db } from "@/utils/firebase";
import { useUser } from "../contexts/UserContext";
import ContentModule from "../components/modules/ContentModule";
import { THEMES } from "../themes/ThemeIndex";

export default function CreatorPage() {
  const { uid } = useParams();
  const { currentUser } = useUser();

  const [creatorData, setCreatorData] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newPost, setNewPost] = useState({ title: "", mediaType: "image", src: "", themeId: "none" });

  const isOwner = currentUser?.id === uid;

  useEffect(() => {
    if (!uid) return;

    const fetchCreator = async () => {
      setLoading(true);
      try {
        const userSnap = await getDoc(doc(db, "users", uid));
        if (userSnap.exists()) {
          const userData = userSnap.data();
          // Apply defaults for missing fields
          const safeCreatorData = {
            name: userData.name || "Unknown",
            themeId: userData.themeId || "none",
            faction: userData.faction || "Unknown",
            ...userData
          };
          setCreatorData(safeCreatorData);

          const postsSnap = await getDocs(collection(db, "users", uid, "posts"));
          const postList = postsSnap.docs.map(docSnap => {
            const data = docSnap.data();
            return {
              id: docSnap.id,
              creatorId: uid,
              creatorName: safeCreatorData.name,
              creatorFaction: safeCreatorData.faction,
              title: data.title || "Untitled",
              mediaType: data.mediaType || "image",
              mediaSrc: data.src || "",
              themeId: data.themeId || "none",
              description: data.description || ""
            };
          });
          setPosts(postList);
        } else {
          setCreatorData({ name: "Unknown", themeId: "none", faction: "Unknown" });
          setPosts([]);
        }
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
          creatorName: creatorData?.name || "Unknown",
          creatorFaction: creatorData?.faction || "Unknown",
          title: newPost.title || "Untitled",
          mediaType: newPost.mediaType,
          mediaSrc: newPost.src,
          themeId: newPost.themeId,
          description: newPost.description || ""
        }
      ]);
      setNewPost({ title: "", mediaType: "image", src: "", themeId: "none" });
    } catch (err) {
      console.error("Error creating post:", err);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!creatorData) return <p>Creator not found.</p>;

  const theme = THEMES[creatorData.themeId] || { preview: { background: "#222", color: "#fff" } };

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
      <h1>{creatorData.name}'s Content</h1>

      {/* Owner-only upload panel */}
      {isOwner && (
        <div style={{ margin: "1rem 0", padding: "1rem", border: "1px solid #555", borderRadius: "8px" }}>
          <h3>New Post</h3>
          <input
            type="text"
            placeholder="Title"
            value={newPost.title}
            onChange={e => setNewPost({ ...newPost, title: e.target.value })}
          />
          <input
            type="text"
            placeholder="Media URL"
            value={newPost.src}
            onChange={e => setNewPost({ ...newPost, src: e.target.value })}
          />
          <select value={newPost.mediaType} onChange={e => setNewPost({ ...newPost, mediaType: e.target.value })}>
            <option value="image">Image</option>
            <option value="youtube">YouTube</option>
            <option value="video">Video</option>
          </select>
          <select value={newPost.themeId} onChange={e => setNewPost({ ...newPost, themeId: e.target.value })}>
            <option value="none">Default</option>
            {Object.keys(THEMES).map(key => (
              <option key={key} value={key}>{THEMES[key].name}</option>
            ))}
          </select>
          <button onClick={handleNewPostSubmit}>Upload</button>
        </div>
      )}

      {/* Content list */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {posts.map(post => (
          <ContentModule key={post.id} post={post} currentUser={currentUser} />
        ))}
      </div>
    </div>
  );
}
