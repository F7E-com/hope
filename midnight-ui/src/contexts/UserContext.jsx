import { createContext, useContext, useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/utils/firebase";

const UserContext = createContext();

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
          const data = snapshot.data();
          data.id = uid;
          setCurrentUser(data);
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

export const useUser = () => useContext(UserContext);
