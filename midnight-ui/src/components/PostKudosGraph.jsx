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
  ];

  const [animatedValues, setAnimatedValues] = useState(
    factions.map(f => post.kudos?.[f] ?? 0)
  );

  useEffect(() => {
    const targetValues = factions.map(f => post.kudos?.[f] ?? 0);
    const animationFrames = 15;
    let frame = 0;

    const interval = setInterval(() => {
      frame++;
      setAnimatedValues(prev =>
        prev.map((v, i) =>
          v + (targetValues[i] - v) / (animationFrames - frame + 1)
        )
      );
      if (frame >= animationFrames) clearInterval(interval);
    }, 25);

    return () => clearInterval(interval);
  }, [post.kudos]);

  const kudosValues = animatedValues;
  const maxKudos = Math.max(...factions.map(f => post.kudos?.[f] ?? 0), 1);
  const avgKudos =
    factions.reduce((sum, f) => sum + (post.kudos?.[f] ?? 0), 0) / factions.length;

  const graphHeight = 40;
  const borderColor = theme?.preview?.color || "#000";

  return (
    <div className="relative flex items-center justify-center w-full h-10">
      <div
        className="absolute inset-0 rounded pointer-events-none"
        style={{ border: `1px solid ${borderColor}` }}
      />

      <span className="absolute text-xl font-bold pointer-events-none select-none bg-white/70 px-1 rounded">
        {Math.round(avgKudos)}
      </span>

      <div className="flex items-end h-full z-10 px-1 gap-[2px]">
        {factions.map((faction, i) => {
          const barHeight = (kudosValues[i] / maxKudos) * graphHeight;
          const [color1, color2] = factionColors[faction] || ["#999", "#666"];

          return (
            <div
              key={faction}
              style={{
                width: "3px",
                height: `${barHeight}px`,
                backgroundImage: `repeating-linear-gradient(
                  to bottom,
                  ${color1},
                  ${color1} 1px,
                  ${color2} 3px
                )`,
                transition: "height 0.3s ease",
              }}
            />
          );
        })}
      </div>
    </div>
  );
}

export default PostKudosGraph;
