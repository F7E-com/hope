import React from "react";
import { addKudos, checkMilestones } from "../utils/kudos";
import { useUser } from "../contexts/UserContext";
import { doc, updateDoc, increment } from "firebase/firestore";
import { db } from "../utils/firebase";

// Faction icons
import Beaker from "../assets/Beaker.png";        
import Emblem from "../assets/Emblem.png";       
import f7 from "../assets/f7.png";               
import Gears from "../assets/Gears.png";         
import Hardhat from "../assets/Hardhat.png";     
import Scales from "../assets/Scales.png";       
import Star from "../assets/Star.png";           
import Like from "../assets/Like.png";           

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

function LikeButton({ contentCreatorId, contentCreatorFaction, postId, onLocalLike }) {
  const { currentUser } = useUser();

  const handleLike = async () => {
    if (!currentUser) return;

    const giverId = currentUser.id;
    const giverFaction = currentUser.faction || "Populace";

    try {
      // Add kudos to users
      await addKudos(contentCreatorId, giverFaction, 10);
      await addKudos(giverId, contentCreatorFaction, 1);

      // Add kudos to post
      if (postId) {
        const postRef = doc(db, "posts", postId);
        await updateDoc(postRef, {
          [`kudos.${giverFaction}`]: increment(10),
        });
      }

      // Update graph locally
      if (onLocalLike) onLocalLike(giverFaction, contentCreatorFaction);

      // Check milestones
      const milestones = await checkMilestones(contentCreatorId);
      console.log("Milestones reached:", milestones);
    } catch (err) {
      console.error("Error handling like:", err);
    }
  };

  const icon = currentUser && factionIcons[currentUser.faction]
    ? factionIcons[currentUser.faction]
    : factionIcons.Populace;

  return (
    <button
      onClick={handleLike}
      className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 shadow-sm hover:shadow-md hover:scale-105 transition"
    >
      {icon && <img src={icon} alt={`${currentUser?.faction || "Populace"} icon`} className="w-6 h-6 object-contain" />}
      <span>Like</span>
    </button>
  );
}

export default LikeButton;
