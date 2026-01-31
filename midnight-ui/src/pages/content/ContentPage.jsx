// src/pages/ContentPage.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../utils/firebase";
import ContentModule from "../../components/modules/ContentModule";
import { THEMES } from "../../themes/ThemeIndex";
import { applyTheme } from "../../utils/themeUtils";

export default function ContentPage({ currentUser }) {
  const { postId } = useParams();
  const [media, setMedia] = useState(null);
  const [loading, setLoading] = useState(true);
  const [themeId, setThemeId] = useState("none");


  useEffect(() => {
    const fetchMedia = async () => {
      setLoading(true);
      try {
        const snap = await getDoc(doc(db, "posts", postId)); // 🔑 top-level posts
        if (snap.exists()) {
          const data = snap.data();
          setMedia({ id: snap.id, ...data });
          setThemeId(data.themeId || "none");
        } else {
          setMedia(null);
        }
      } catch (err) {
        console.error("Error fetching media:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMedia();
  }, [postId]);

  useEffect(() => {
    if (themeId && THEMES[themeId]) {
      const wrapper = document.querySelector(".media-page-wrapper");
      if (wrapper) {
        applyTheme(THEMES[themeId], null, wrapper);
      }
    }
  }, [themeId]);

  if (loading) return <p>Loading...</p>;
  if (!media) return <p>Media not found. {postId}</p>;

  return (
    <div className={`media-page-wrapper ${themeId}`}>
      <ContentModule
        post={media}
        currentUser={currentUser}
        pageTheme={themeId}
      />
    </div>
  );
}
