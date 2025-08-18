import React from "react";
import LikeButton from "./LikeButton";
import { factionIcons } from "../constants/factionIcons";

function ContentModule({ content }) {
  return (
    <div className="content-module p-4 border rounded-md shadow-sm bg-white">
      <h2 className="text-xl font-bold mb-2">{content.title}</h2>
      <p className="mb-4">{content.body}</p>

      <LikeButton
        contentCreatorId={content.creatorId}
        contentCreatorFaction={content.creatorFaction}
        icon={factionIcons[content.creatorFaction]}
      />
    </div>
  );
}

export default ContentModule;
