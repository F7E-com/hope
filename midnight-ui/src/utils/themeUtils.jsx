export function applyTheme(theme, customColor = null) {
  const bg = theme.id === "custom" ? customColor : theme.preview?.background || "#222";
  const color = theme.preview?.color || "#fff";
  const font = theme.fontFamily || "'Cinzel', serif";

  // Global CSS variables
  document.documentElement.style.setProperty("--background-color", bg);
  document.documentElement.style.setProperty("--text-color", color);
  document.documentElement.style.setProperty("--font-family", font);

  // Module-specific
  document.documentElement.style.setProperty("--module-bg", bg);
  document.documentElement.style.setProperty("--module-color", color);
  document.documentElement.style.setProperty("--module-padding", theme.modulePadding || "32px");
  document.documentElement.style.setProperty("--module-margin", theme.moduleMargin || "24px auto");
}
