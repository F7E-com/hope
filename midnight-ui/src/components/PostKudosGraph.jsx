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

export default function PostKudosGraph({ post, theme, localKudos }) {
  if (!post) return null;

  // Always ensure kudos is an object with all factions as numbers
  const getNormalizedKudos = (kudos) => {
    const normalized = {};
    factions.forEach((f) => {
      normalized[f] = kudos && typeof kudos[f] === "number" ? kudos[f] : 0;
    });
    return normalized;
  };

  const [animatedValues, setAnimatedValues] = useState(getNormalizedKudos(post.kudos));

  // Animate from current to target on post.kudos change
  useEffect(() => {
    const targetValues = getNormalizedKudos(post.kudos);
    const frames = 20;
    let frame = 0;

    const interval = setInterval(() => {
      frame++;
      setAnimatedValues((prev) =>
        factions.reduce((acc, f) => {
          acc[f] = prev[f] + (targetValues[f] - prev[f]) / (frames - frame + 1);
          return acc;
        }, {})
      );
      if (frame >= frames) clearInterval(interval);
    }, 20);

    return () => clearInterval(interval);
  }, [post.kudos]);

  // Handle local likes immediately
  useEffect(() => {
    if (!localKudos) return;
    setAnimatedValues((prev) => {
      const next = { ...prev };
      if (localKudos.giverFaction) next[localKudos.giverFaction] += 10;
      if (localKudos.creatorFaction) next[localKudos.creatorFaction] += 1;
      return next;
    });
  }, [localKudos]);

  const maxKudos = Math.max(...Object.values(animatedValues), 1);
  const avgKudos =
    Object.values(animatedValues).reduce((sum, v) => sum + v, 0) / factions.length;

  const graphHeight = 40;
  const borderColor = theme?.preview?.color || "#000";

  return (
    <div
      className="relative flex flex-col items-center justify-end h-20 px-1"
      style={{ border: `1px solid ${borderColor}`, borderRadius: "4px", boxSizing: "border-box" }}
    >
      {/* Average kudos */}
      <span className="text-xl font-bold pointer-events-none select-none mb-1">
        {Math.round(avgKudos)}
      </span>

      <div className="flex flex-row items-end gap-[2px] w-full h-full justify-center">
        {factions.map((faction) => {
          const value = animatedValues[faction];
          const barHeight = (value / maxKudos) * graphHeight;
          const [color1, color2] = factionColors[faction] || ["#999", "#666"];

          return (
            <div key={faction} className="flex flex-col items-center justify-end">
              <span className="text-xs mb-1">{Math.round(value)}</span>
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
                  transition: "height 0.2s ease",
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
