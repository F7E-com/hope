import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  doc,
  getDoc,
  collection,
  getDocs,
  addDoc,
  setDoc,
  updateDoc,
  where,
  query,
} from "firebase/firestore";
import { db } from "../utils/firebase";
import { useUser } from "../contexts/UserContext";
import ContentModule from "../components/modules/ContentModule";
import ThemePickerDropdown from "../components/modules/ThemePickerDropdown";
import { THEMES } from "../themes/ThemeIndex";
import { applyTheme } from "../utils/themeUtils";
import "../themes/FactionThemes.css";

const mediaInstructions = {
  image: "Paste a direct image URL (ends in .jpg, .png, .webp).",
  youtube: "Paste a full YouTube watch URL or share link.",
  video: "Paste a direct video file URL (mp4/webm recommended).",
  gdrive: "Use a public Google Drive share link.",
  audio: "Paste a direct audio file URL (mp3/ogg).",
  pdf: "Paste a publicly accessible PDF URL.",
  text: "Paste text directly into the description field.",
  webpage: "Paste a full webpage URL (https://…).",
};

export default function CreatorPage() {
  const { uid } = useParams();
  const { currentUser, loading: userLoading } = useUser();
  const isOwner = currentUser?.id === uid;

  const [creatorData, setCreatorData] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [banner, setBanner] = useState("");
  const [creatorTheme, setCreatorTheme] = useState("none");
  const [pageThemeId, setPageThemeId] = useState("none");
  const [pageCustomColor, setPageCustomColor] = useState("#ffffff");

  const [newPost, setNewPost] = useState({
    title: "",
    mediaType: "image",
    src: "",
    themeId: "none",
    description: "",
    banner: "",
    tags: [],
  });

  useEffect(() => {
    if (!uid || userLoading) return;

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

        const postsQuery = query(
          collection(db, "posts"),
          where("creatorId", "==", uid)
        );
        const postsSnap = await getDocs(postsQuery);

        setPosts(
          postsSnap.docs.map((docSnap) => ({
            id: docSnap.id,
            ...docSnap.data(),
          }))
        );

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
  }, [uid, userLoading]);

  useEffect(() => {
    const wrapper = document.querySelector(".creator-page-wrapper");
    if (!wrapper) return;

    if (pageThemeId && THEMES[pageThemeId]) {
      applyTheme(THEMES[pageThemeId], pageCustomColor, wrapper);
    }

    const bannerEl = wrapper.querySelector(".creator-banner");
    if (creatorTheme && THEMES[creatorTheme] && bannerEl) {
      applyTheme(THEMES[creatorTheme], null, bannerEl);
    }

    wrapper
      .querySelectorAll("input, textarea, select")
      .forEach((el) => (el.style.color = "#000"));
  }, [pageThemeId, pageCustomColor, creatorTheme, posts]);

  const saveCreatorTheme = async () => {
    if (!isOwner || !creatorData) return;
    await updateDoc(doc(db, "users", uid), {
      themeId: creatorTheme,
      banner,
    });
  };

  const savePageTheme = async () => {
    if (!isOwner) return;
    await setDoc(
      doc(db, "creatorPages", uid),
      { creatorPageThemeId: pageThemeId, customColor: pageCustomColor },
      { merge: true }
    );
  };

  const handleNewPostSubmit = async () => {
    if (!isOwner) return;

    const postPayload = {
      ...newPost,
      creatorId: uid,
      date: new Date(),
    };

    const postRef = await addDoc(collection(db, "posts"), postPayload);

    setPosts([...posts, { id: postRef.id, ...postPayload }]);

    setNewPost({
      title: "",
      mediaType: "image",
      src: "",
      themeId: "none",
      description: "",
      banner: "",
      tags: [],
    });
  };

  if (userLoading || loading) return <p>Loading...</p>;
  if (!creatorData) return <p>Creator not found.</p>;

  return (
    <div className={`creator-page-wrapper ${pageThemeId}`}>
      <div
        className="creator-banner"
        style={{ backgroundImage: `url(${banner})` }}
      >
        <h1>{creatorData.name}</h1>
      </div>

      {isOwner && (
        <div className="creator-controls">
          <h3>New Post</h3>

          <input
            type="text"
            placeholder="Title"
            value={newPost.title}
            onChange={(e) =>
              setNewPost({ ...newPost, title: e.target.value })
            }
          />

          <input
            type="text"
            placeholder="Media URL"
            value={newPost.src}
            onChange={(e) =>
              setNewPost({ ...newPost, src: e.target.value })
            }
          />

          <input
            type="text"
            placeholder="Tags (comma separated)"
            value={newPost.tags.join(", ")}
            onChange={(e) =>
              setNewPost({
                ...newPost,
                tags: e.target.value
                  .split(",")
                  .map((t) => t.trim())
                  .filter(Boolean),
              })
            }
          />

          <select
            value={newPost.mediaType}
            onChange={(e) =>
              setNewPost({ ...newPost, mediaType: e.target.value })
            }
          >
            {Object.keys(mediaInstructions).map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>

          <p style={{ fontSize: "0.85rem", opacity: 0.8 }}>
            {mediaInstructions[newPost.mediaType]}
          </p>

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
            onChange={(e) =>
              setNewPost({ ...newPost, description: e.target.value })
            }
          />

          <button onClick={handleNewPostSubmit}>Upload</button>
        </div>
      )}

      <div className="creator-posts">
        {posts.map((post) => (
          <ContentModule
            key={post.id}
            post={post}
            currentUser={currentUser}
            pageTheme={pageThemeId}
          />
        ))}
      </div>
    </div>
  );
}
