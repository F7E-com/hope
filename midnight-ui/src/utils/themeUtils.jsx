// src/utils/themeUtils.js
export function applyTheme(theme, customColor = null) {
  const bg = theme.id === "custom" ? customColor : theme.preview?.background || "#222";
  const color = theme.preview?.color || "#fff";
  const font = theme.fontFamily || "'Times New Roman', serif"; // changed font for test

  document.documentElement.style.setProperty("--background-color", bg);
  document.documentElement.style.setProperty("--text-color", color);
  document.documentElement.style.setProperty("--font-family", font);
  document.documentElement.style.setProperty("--module-bg", bg);
  document.documentElement.style.setProperty("--module-color", color);

  // Force global font change
  document.body.style.setProperty("font-family", font, "important");
}
