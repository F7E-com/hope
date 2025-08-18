import { createContext, useContext, useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/utils/firebase";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    // Try to read cached user from localStorage
    const saved = localStorage.getItem("currentUser");
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(!currentUser); // if we have cached user, no need to load immediately

  // Whenever currentUser changes, cache or remove it
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("currentUser", JSON.stringify(currentUser));
      if (currentUser.id) {
        localStorage.setItem("currentUserId", currentUser.id);
      }
    } else {
      localStorage.removeItem("currentUser");
      localStorage.removeItem("currentUserId");
    }
  }, [currentUser]);

  // Pull user from Firebase if we have a UID in localStorage
  useEffect(() => {
    const uid = localStorage.getItem("currentUserId");
    if (!uid) {
      setCurrentUser(null);
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      setLoading(true);
      try {
        const docRef = doc(db, "users", uid);
        const snapshot = await getDoc(docRef);
        if (snapshot.exists()) {
          setCurrentUser(snapshot.data());
        } else {
          setCurrentUser(null);
        }
      } catch (err) {
        console.error("Error fetching user:", err);
        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser, loading }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook for easier access
export const useUser = () => useContext(UserContext);
