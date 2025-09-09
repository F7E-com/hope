import React, { useEffect, useState } from "react";

const factionColors = {
  Research: ["#4f9ff2", "#3a7dd9"],
  Security: ["#f25f5c", "#d93a3a"],
  Intelligence: ["#9b5de5", "#7a3ad8"],
  Industry: ["#f3c969", "#e5b13a"],
  Infrastructure: ["#00bbf9", "#0092d1"],
  Commerce: ["#00f5d4", "#00c9aa"],
  Government: ["#ff9f1c", "#d97a00"],
  Populace: ["#cccccc", "#999999"],
};

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
    "Populace",
  ];

  // Initialize animatedValues from post.kudos or default to 0
  const [animatedValues, setAnimatedValues] = useState(
    factions.map(f => (post.kudos && post.kudos[f] ? post.kudos[f] : 0))
  );

  useEffect(() => {
    const targetValues = factions.map(f => (post.kudos && post.kudos[f] ? post.kudos[f] : 0));
    setAnimatedValues(targetValues); // directly update so initial load shows the correct values
  }, [post.kudos]);

  const maxKudos = Math.max(...animatedValues, 1);
  const avgKudos =
    animatedValues.reduce((sum, v) => sum + v, 0) / factions.length;

  const graphHeight = 40;
  const borderColor = theme?.preview?.color || "#000";

  return (
    <div
      className="relative flex flex-row items-end justify-center w-full h-16 px-1"
      style={{ border: `1px solid ${borderColor}`, borderRadius: "4px" }}
    >
      {/* Average kudos */}
      <span className="absolute top-0 text-xl font-bold pointer-events-none select-none bg-white/70 px-1 rounded">
        {Math.round(avgKudos)}
      </span>

      <div className="flex flex-row items-end gap-[2px] h-full justify-center">
        {factions.map((faction, i) => {
          const barHeight = (animatedValues[i] / maxKudos) * graphHeight;
          const [color1, color2] = factionColors[faction] || ["#999", "#666"];

          return (
            <div key={faction} className="flex flex-col items-center justify-end">
              <span className="text-xs mb-1">{Math.round(animatedValues[i])}</span>
              <div
                style={{
                  width: "5px",
                  height: `${barHeight}px`,
                  backgroundImage: `repeating-linear-gradient(
                    to bottom,
                    ${color1},
                    ${color1} 1px,
                    ${color2} 3px
                  )`,
                  transition: "height 0.3s ease",
                  transformOrigin: "bottom",
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default PostKudosGraph;
