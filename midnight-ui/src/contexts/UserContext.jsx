import { createContext, useContext, useState, useEffect } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/utils/firebase";

const UserContext = createContext();

const DEFAULT_USER_FIELDS = {
  banner: "",
  bio: "",
  faction: "Neutral",
  kudos: {
    Background: 0,
    Commerce: 0,
    Government: 0,
    Industry: 0,
    Infrastructure: 0,
    Research: 0,
    Security: 0,
    Intelligence: 0,
    Populace: 0,
  },
  name: "Unnamed",
  themeId: "default",
  totalKudos: 0,
};

export async function fetchAndSyncUser(uid) {
  if (!uid) return { ...DEFAULT_USER_FIELDS, id: null };

  try {
    const docRef = doc(db, "users", uid);
    const snapshot = await getDoc(docRef);

    if (!snapshot.exists()) return { ...DEFAULT_USER_FIELDS, id: uid };

    const data = snapshot.data();
    const merged = {
      ...DEFAULT_USER_FIELDS,
      ...data,
      kudos: { ...DEFAULT_USER_FIELDS.kudos, ...(data.kudos || {}) },
    };
    merged.totalKudos = Object.values(merged.kudos).reduce((a, b) => a + b, 0);

    await setDoc(docRef, merged, { merge: true });
    merged.id = uid;
    return merged;
  } catch (err) {
    console.error("Error in fetchAndSyncUser:", err);
    return { ...DEFAULT_USER_FIELDS, id: uid || null };
  }
}

export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem("currentUser");
      return saved ? JSON.parse(saved) : null;
    } catch {
      localStorage.removeItem("currentUser");
      return null;
    }
  });
  const [loading, setLoading] = useState(!currentUser);

  useEffect(() => {
    if (currentUser?.id) {
      localStorage.setItem("currentUser", JSON.stringify(currentUser));
      localStorage.setItem("currentUserId", currentUser.id);
    } else {
      localStorage.removeItem("currentUser");
      localStorage.removeItem("currentUserId");
    }
  }, [currentUser]);

  useEffect(() => {
    let mounted = true;
    const initUser = async () => {
      const uid = localStorage.getItem("currentUserId");
      if (!uid) {
        if (mounted) { setCurrentUser(null); setLoading(false); }
        return;
      }
      try {
        setLoading(true);
        const user = await fetchAndSyncUser(uid);
        if (mounted) setCurrentUser(user);
      } catch (err) {
        console.error("Error fetching user:", err);
        if (mounted) setCurrentUser(null);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    initUser();
    return () => { mounted = false; };
  }, []);

  if (loading) return <p>Loading user...</p>;

  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
