import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/utils/firebase";
import LinkifyText from "@/components/LinkifyText";

export default function ProfilePage({ userId }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const snap = await getDoc(doc(db, "users", userId));
      if (snap.exists()) setUser(snap.data());
    };
    fetchUser();
  }, [userId]);

  if (!user) return <p>Loading...</p>;

  return (
    <div className="max-w-md mx-auto bg-gray-900 rounded-2xl shadow-lg p-6 space-y-4 text-white">
      {/* Avatar */}
      <div className="flex justify-center">
        <img
          src={user.photoURL || "/default-avatar.png"}
          alt="Profile"
          className="w-32 h-32 rounded-full object-cover border-4 border-faction"
        />
      </div>

      {/* Name */}
      <h2 className="text-2xl font-bold text-center">{user.name}</h2>
      <p className="text-center text-sm text-gray-400">{user.faction}</p>

      {/* Bio */}
      <div className="bg-gray-800 p-4 rounded-lg">
        <LinkifyText text={user.bio || "No bio yet."} />
      </div>

      {/* Kudos */}
      <div className="grid grid-cols-2 gap-2">
        {Object.entries(user.kudos || {}).map(([key, val]) => (
          <div key={key} className="bg-gray-700 p-2 rounded-lg flex justify-between">
            <span>{key}</span>
            <span>{val}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
