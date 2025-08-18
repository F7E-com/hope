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
  const [newPost, setNewPost] = useState({
    title: "",
    mediaType: "image",
    src: "",
    themeId: "none",
    description: ""
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
              faction: userSnap.data()?.faction || "Unknown",
              bio: userSnap.data()?.bio || "",
              avatar: userSnap.data()?.avatar || "",
              ...userSnap.data()
            }
          : { name: "Unknown Creator", themeId: "none", faction: "Unknown", bio: "", avatar: "" };

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

      {isOwner && (
        <div style={{ margin: "1rem 0", padding: "1rem", border: "1px solid #555", borderRadius: "8px" }}>
          <h3>New Post</h3>
          <br/>
          <input
            type="text"
            placeholder="Title"
            value={newPost.title}
            onChange={e => setNewPost({ ...newPost, title: e.target.value })}
          />
          <br/>
          <br/>
          <input
            type="text"
            placeholder="Media URL"
            value={newPost.src}
            onChange={e => setNewPost({ ...newPost, src: e.target.value })}
          />
          <br/>
          <br/>
          <select value={newPost.mediaType} onChange={e => setNewPost({ ...newPost, mediaType: e.target.value })}>
            <option value="image">Image</option>
            <option value="youtube">YouTube</option>
            <option value="video">Video</option>
          </select>
          <br/>
          <br/>
          <select value={newPost.themeId} onChange={e => setNewPost({ ...newPost, themeId: e.target.value })}>
            <option value="none">Default</option>
            {Object.keys(THEMES).map(key => (
              <option key={key} value={key}>{THEMES[key].name}</option>
            ))}
          </select>
          <br/>
          <br/>
          <textarea
            placeholder="Description"
            value={newPost.description}
            onChange={e => setNewPost({ ...newPost, description: e.target.value })}
          />
          <br/>
          <br/>
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
