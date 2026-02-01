// src/pages/ContentPage.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../utils/firebase";
import ContentModule from "../../components/modules/ContentModule";
import { THEMES } from "../../themes/ThemeIndex";
import { applyTheme } from "../../utils/themeUtils";

export default function ContentPage({ currentUser }) {
  // URL param IS the Firestore document ID
  const { id } = useParams();
  const postId = id;

  const [media, setMedia] = useState(null);
  const [loading, setLoading] = useState(true);
  const [themeId, setThemeId] = useState("none");

  useEffect(() => {
    if (!postId) return;

    const fetchMedia = async () => {
      setLoading(true);
      try {
        const snap = await getDoc(doc(db, "posts", postId));

        if (snap.exists()) {
          const data = snap.data();

          setMedia({
            id: snap.id,
            mediaSrc: data.src || "", // 🔑 normalize shape
            ...data,
          });

          setThemeId(data.themeId || "none");
        } else {
          setMedia(null);
        }
      } catch (err) {
        console.error("Error fetching media:", err);
        setMedia(null);
      } finally {
        setLoading(false);
      }
    };

    fetchMedia();
  }, [postId]);

  useEffect(() => {
    if (!themeId || !THEMES[themeId]) return;

    const wrapper = document.querySelector(".media-page-wrapper");
    if (wrapper) {
      applyTheme(THEMES[themeId], null, wrapper);
    }
  }, [themeId]);

  if (!postId) return <p>Invalid URL — no post ID.</p>;
  if (loading) return <p>Loading...</p>;
  if (!media) return <p>Media not found.</p>;

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
