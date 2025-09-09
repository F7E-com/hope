import React, { useEffect, useState } from "react";

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

const normalizeKudos = (kudos) => {
  const normalized = {};
  factions.forEach((f) => {
    normalized[f] = (kudos && typeof kudos[f] === "number") ? kudos[f] : 0;
  });
  return normalized;
};

export default function PostKudosGraph({ post, theme }) {
  const [values, setValues] = useState(normalizeKudos(post.kudos));

  useEffect(() => {
    setValues(normalizeKudos(post.kudos));
  }, [post.kudos]);

  const maxKudos = Math.max(...Object.values(values), 1);
  const avgKudos = Math.round(Object.values(values).reduce((sum, v) => sum + v, 0) / factions.length);

  const borderColor = theme?.preview?.color || "#000";
  const graphHeight = 40;

  return (
    <div
      className="flex flex-col items-center justify-end p-1"
      style={{ border: `1px solid ${borderColor}`, borderRadius: "4px", boxSizing: "border-box" }}
    >
      <span className="text-xl font-bold mb-1">{avgKudos}</span>
      <div className="flex flex-row gap-[2px] items-end">
        {factions.map((faction) => {
          const value = values[faction];
          const height = (value / maxKudos) * graphHeight;
          const [color1, color2] = factionColors[faction];

          return (
            <div key={faction} className="flex flex-col items-center justify-end">
              <span className="text-xs mb-1">{value}</span>
              <div
                style={{
                  width: "5px",
                  height: `${height}px`,
                  backgroundImage: `repeating-linear-gradient(to bottom, ${color1}, ${color1} 1px, ${color2} 3px)`,
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
