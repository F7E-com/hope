// src/components/LikeButton.jsx
import React from "react";
import { addKudos, checkMilestones } from "../utils/Kudos";
import { useUser } from "../contexts/UserContext";
import { factionIcons } from "../constants/factionIcons";

function LikeButton({ contentCreatorId, contentCreatorFaction }) {
  const { currentUser } = useUser();

  const handleLike = async () => {
    if (!currentUser) return;

    const giverId = currentUser.id;
    const giverFaction = currentUser.faction;

    try {
      // 1. Give +10 kudos to content creator, credited to GIVER’s faction
      await addKudos(contentCreatorId, giverFaction, 10);

      // 2. Give +1 kudos to giver, credited to CREATOR’s faction
      await addKudos(giverId, contentCreatorFaction, 1);

      // 3. Check milestones for creator
      const milestones = await checkMilestones(contentCreatorId);
      console.log("Milestones reached:", milestones);
    } catch (err) {
      console.error("Error handling like:", err);
    }
  };

  const icon = factionIcons[contentCreatorFaction];

  return (
    <button
      onClick={handleLike}
      className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 shadow-sm hover:shadow-md hover:scale-105 transition"
    >
      {icon && (
        <img
          src={icon}
          alt={`Faction ${contentCreatorFaction} icon`}
          className="w-6 h-6 object-contain"
        />
      )}
      <span>Like</span>
    </button>
  );
}

export default LikeButton;
