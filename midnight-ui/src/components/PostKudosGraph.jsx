import React from "react";

function PostKudosGraph({ post, theme }) {
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

  // Safe access: default to 0 if post.kudos or faction field doesn't exist
  const kudosValues = factions.map(f => post.kudos?.[f] ?? 0);
  const maxKudos = Math.max(...kudosValues, 1);
  const avgKudos =
    kudosValues.reduce((sum, v) => sum + v, 0) / kudosValues.length;

  const graphHeight = 40; // px, matches h-10
  const borderColor = theme?.preview?.color || "#000";

  return (
    <div className="relative flex items-center justify-center w-full h-10">
      {/* Border container (theme-colored) */}
      <div
        className="absolute inset-0 rounded pointer-events-none"
        style={{ border: `1px solid ${borderColor}` }}
      />

      {/* Average kudos text */}
      <span className="absolute text-xl font-bold pointer-events-none select-none bg-white/70 px-1 rounded">
        {Math.round(avgKudos)}
      </span>

      {/* Bars */}
      <div className="flex items-end h-full z-10 px-1 gap-[2px]">
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
