// src/utils/themeUtils.js
export function applyTheme(theme, customColor = null) {
  const bg = theme.id === "custom" ? customColor : theme.preview?.background || "#222";
  const color = theme.preview?.color || "#fff";
  const font = theme.fontFamily || "'Cinzel', serif";

  document.documentElement.style.setProperty("--background-color", bg);
  document.documentElement.style.setProperty("--text-color", color);
  document.documentElement.style.setProperty("--font-family", font);
  document.documentElement.style.setProperty("--module-bg", bg);
  document.documentElement.style.setProperty("--module-color", color);
}
