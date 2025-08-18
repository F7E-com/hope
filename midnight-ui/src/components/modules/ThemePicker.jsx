import React from "react";
import { THEMES } from "../../themes/ThemeIndex";

export default function ThemePicker({ unlockedThemes = [], selectedTheme, onChange }) {
  if (!unlockedThemes || unlockedThemes.length === 0) return null;

  return (
    <div className="theme-picker">
      <h3>Choose Your Theme</h3>
      <div className="theme-options">
        {unlockedThemes.map((themeKey) => {
          const theme = THEMES[themeKey];
          if (!theme) return null;

          return (
            <button
              key={themeKey}
              className={`theme-button ${theme.className} ${selectedTheme === themeKey ? "active" : ""}`}
              onClick={() => onChange(themeKey)}
              style={{
                background: theme?.preview?.background || "#222",
                color: theme?.preview?.color || "#fff"
              }}
            >
              {theme.name || themeKey}
            </button>
          );
        })}
      </div>
    </div>
  );
}
