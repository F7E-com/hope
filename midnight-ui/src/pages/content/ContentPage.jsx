import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/utils/firebase";
import { useUser } from "../contexts/UserContext";
import { THEMES } from "../themes/ThemeIndex";
import { applyTheme } from "@/utils/themeUtils";
import ContentModule from "../components/modules/ContentModule";
import "../themes/FactionThemes.css";

export default function ContentPage() {
  const { mediaId } = useParams();
  const { currentUser } = useUser();
  const navigate = useNavigate();

  const [media, setMedia] = useState(null);
  const [loading, setLoading] = useState(true);
  const [themeId, setThemeId] = useState("none");

  useEffect(() => {
    const fetchMedia = async () => {
      setLoading(true);
      try {
        const snap = await getDoc(doc(db, "media", mediaId));
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
  }, [mediaId]);

  useEffect(() => {
    const wrapper = document.querySelector(".content-page-wrapper");
    if (!wrapper || !themeId || !THEMES[themeId]) return;
    applyTheme(THEMES[themeId], null, wrapper);
  }, [themeId]);

  if (loading) return <p>Loading...</p>;
  if (!media) return <p>Media not found.</p>;

  return (
    <div className={`content-page-wrapper ${themeId}`}>

      {/* Top buttons */}
      <div className="content-page-topbar">
        <button
          onClick={() =>
            navigate(
              `/search?genre=${encodeURIComponent(media.genre || "all")}`
            )
          }
        >
          More in Genre
        </button>
        <button onClick={() => navigate(`/creator/${media.creatorId}`)}>
          More from {media.creatorName}
        </button>
        <button onClick={() => navigate(`/browse/${media.mediaType}`)}>
          More in {media.mediaType}
        </button>
      </div>

      {/* Background */}
      <div
        className="content-page-background"
        style={{
          backgroundImage: `url(${media.banner || media.mediaSrc || ""})`,
        }}
      />

      {/* Central media */}
      <div className="content-page-content">
        <ContentModule post={media} currentUser={currentUser} />
      </div>

      {/* Info + comments */}
      <div className="content-page-info">
        <h2>{media.title}</h2>
        <p>{media.description}</p>
        <p>
          Uploaded by <strong>{media.creatorName}</strong>
        </p>
        <p>Genre: {media.genre || "Uncategorized"}</p>
      </div>

      <div className="content-page-comments">
        <h3>Comments</h3>
        <p>Comments section goes here...</p>
      </div>
    </div>
  );
}
