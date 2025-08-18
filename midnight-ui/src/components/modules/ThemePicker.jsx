import React from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { THEMES } from "../../themes/ThemeIndex";

export default function ThemePicker({ user }) {
  const { selectedTheme, setSelectedTheme } = useTheme();

  const availableThemes = Object.keys(THEMES).filter(theme =>
    user.unlockedThemes.includes(theme)
  );

  return (
    <div className="theme-picker">
      <h3>Choose Your Theme</h3>
      <div className="theme-options">
        {availableThemes.map((themeKey) => {
          const theme = THEMES[themeKey];
          return (
            <button
              key={themeKey}
              className={`theme-button ${theme.className} ${selectedTheme === themeKey ? "active" : ""}`}
              onClick={() => setSelectedTheme(themeKey)}
              style={{
                background: theme.preview.background,
                color: theme.preview.color
              }}
            >
              {theme.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
