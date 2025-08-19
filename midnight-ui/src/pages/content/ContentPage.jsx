// PostPage.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";
import ContentModule from "./components/content/ContentModule";

export default function PostPage({ currentUser }) {
  const { id } = useParams(); // /post/:id
  const [post, setPost] = useState(null);

  useEffect(() => {
    async function fetchPost() {
      try {
        const ref = doc(db, "posts", id);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          setPost({ id: snap.id, ...snap.data() });
        }
      } catch (err) {
        console.error("Error fetching post:", err);
      }
    }
    fetchPost();
  }, [id]);

  return (
    <main
      style={{
        maxWidth: "900px",
        margin: "2rem auto",
        padding: "1rem",
      }}
    >
      <ContentModule post={post} currentUser={currentUser} />
    </main>
  );
}
