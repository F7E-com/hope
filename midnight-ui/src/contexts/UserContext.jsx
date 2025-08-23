import { createContext, useContext, useState, useEffect } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/utils/firebase";

const UserContext = createContext();

// Default schema for all user fields
const DEFAULT_USER_FIELDS = {
  banner: "",
  bannerUrl: "",
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
  },
  name: "Unnamed",
  siteCustomColor: "#222222",
  siteThemeID: "default",
  themeColor: "#ffffff",
  themeId: "default",
  securityLevel: 0,
  totalKudos: 0,
};

async function fetchAndSyncUser(uid) {
  const docRef = doc(db, "users", uid);
  const snapshot = await getDoc(docRef);

  if (!snapshot.exists()) {
    return null;
  }

  const data = snapshot.data();

  // Merge defaults
  const merged = {
    ...DEFAULT_USER_FIELDS,
    ...data,
    kudos: { ...DEFAULT_USER_FIELDS.kudos, ...(data.kudos || {}) },
  };

  // Recalculate total kudos
  merged.totalKudos = Object.values(merged.kudos).reduce((a, b) => a + b, 0);

  // Persist changes back to Firestore if anything was missing
  await setDoc(docRef, merged, { merge: true });

  // Attach UID
  merged.id = uid;
  return merged;
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

  // Keep user in localStorage
  useEffect(() => {
    if (currentUser && currentUser.id) {
      localStorage.setItem("currentUser", JSON.stringify(currentUser));
      localStorage.setItem("currentUserId", currentUser.id);
    } else {
      localStorage.removeItem("currentUser");
      localStorage.removeItem("currentUserId");
    }
  }, [currentUser]);

  // Fetch fresh data for logged-in user
  useEffect(() => {
    let mounted = true;

    const initUser = async () => {
      const uid = localStorage.getItem("currentUserId");
      if (!uid) {
        if (mounted) {
          setCurrentUser(null);
          setLoading(false);
        }
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
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) return <p>Loading user...</p>;

  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
