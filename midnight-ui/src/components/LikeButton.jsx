import React from "react";
import { addKudos, checkMilestones } from "../utils/kudos";
import { useUser } from "../contexts/UserContext";
import { doc, updateDoc, increment } from "firebase/firestore";
import { db } from "../utils/firebase";

// Import all faction icons
import Beaker from "../assets/Beaker.png";        // Research
import Emblem from "../assets/Emblem.png";       // Security
import f7 from "../assets/f7.png";               // Intelligence
import Gears from "../assets/Gears.png";         // Industry
import Hardhat from "../assets/Hardhat.png";     // Infrastructure
import Scales from "../assets/Scales.png";       // Commerce
import Star from "../assets/Star.png";           // Government
import Like from "../assets/Like.png";           // Populace (default)

// Map factions → icons
const factionIcons = {
  Research: Beaker,
  Security: Emblem,
  Intelligence: f7,
  Industry: Gears,
  Infrastructure: Hardhat,
  Commerce: Scales,
  Government: Star,
  Populace: Like,
};

function LikeButton({ contentCreatorId, contentCreatorFaction, postId }) {
  const { currentUser } = useUser();

  const handleLike = async () => {
    if (!currentUser) return;

    const giverId = currentUser.id;
    const giverFaction = currentUser.faction || "Populace";

    try {
      // 1. Give +10 kudos to content creator, credited to GIVER’s faction
      await addKudos(contentCreatorId, giverFaction, 10);

      // 2. Give +1 kudos to giver, credited to CREATOR’s faction
      await addKudos(giverId, contentCreatorFaction, 1);

      // 3. Update post kudos (create fields if missing)
      if (postId) {
        const postRef = doc(db, "posts", postId);
        await updateDoc(postRef, {
          [`kudos.${giverFaction}`]: increment(10),
          [`kudos.${contentCreatorFaction}`]: increment(1),
        });
      }

      // 4. Check milestones for creator
      const milestones = await checkMilestones(contentCreatorId);
      console.log("Milestones reached:", milestones);
    } catch (err) {
      console.error("Error handling like:", err);
    }
  };

  // Use currentUser faction if available, otherwise default to Populace icon
  const icon = currentUser && factionIcons[currentUser.faction]
    ? factionIcons[currentUser.faction]
    : factionIcons.Populace;

  return (
    <button
      onClick={handleLike}
      className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 shadow-sm hover:shadow-md hover:scale-105 transition"
    >
      {icon && (
        <img
          src={icon}
          alt={`${currentUser?.faction || "Populace"} icon`}
          className="w-6 h-6 object-contain"
        />
      )}
      <span>Like</span>
    </button>
  );
}

export default LikeButton;
