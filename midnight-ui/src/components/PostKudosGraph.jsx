import React from "react";

function PostKudosGraph({ post }) {
  if (!post) return null;

  const factions = [
    "Research",
    "Security",
    "Intelligence",
    "Industry",
    "Infrastructure",
    "Commerce",
    "Government",
  ];

  const kudosValues = factions.map(f => post.kudos?.[f] || 0);
  const maxKudos = Math.max(...kudosValues, 1);
  const avgKudos =
    kudosValues.reduce((sum, v) => sum + v, 0) / kudosValues.length;

  const graphHeight = 40; // px, matches h-10

  return (
    <div className="relative flex items-center justify-center w-full h-10">
      {/* Average kudos text */}
      <span className="absolute text-xl font-bold pointer-events-none select-none">
        {Math.round(avgKudos)}
      </span>

      {/* Bars */}
      <div className="flex items-end gap-[2px] h-full">
        {kudosValues.map((value, i) => {
          const barHeight = (value / maxKudos) * graphHeight;
          return (
            <div
              key={factions[i]}
              style={{
                width: "3px",
                height: `${barHeight}px`,
              }}
              className="bg-blue-500 rounded-sm"
            />
          );
        })}
      </div>
    </div>
  );
}

export default PostKudosGraph;
// File: midnight-ui/src/components/PostKudosGraph.jsx