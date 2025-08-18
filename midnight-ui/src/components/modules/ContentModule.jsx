// ContentModule.jsx
import React, { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../utils/firebase";
import MediaViewer from "../MediaViewer";
import LikeButton from "../LikeButton";

export default function ContentModule({ postId }) {
  const [content, setContent] = useState(null);

  useEffect(() => {
    async function fetchContent() {
      const ref = doc(db, "posts", postId);
      const snap = await getDoc(ref);
      if (snap.exists()) setContent(snap.data());
    }
    fetchContent();
  }, [postId]);

  if (!content) return <p>Loading...</p>;

  return (
    <div className="content-module">
      <h4>
        {content.title} by{" "}
        <a href={`/profile/${content.creatorId}`}>{content.creatorName}</a>
      </h4>

      <MediaViewer type={content.mediaType} src={content.mediaSrc} />

      {content.description && (
        <p className="content-description">{content.description}</p>
      )}

      <LikeButton
        contentCreatorId={content.creatorId}
        contentCreatorFaction={content.creatorFaction}
      />
    </div>
  );
}
