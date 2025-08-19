// src/utils/themeUtils.js
function ensureGoogleFontLoaded(googleFont) {
  if (!googleFont) return;
  const id = `google-font-${googleFont.replace(/\s+/g, '-')}`;
  if (document.getElementById(id)) return;

  const link = document.createElement('link');
  link.id = id;
  link.rel = 'stylesheet';
  link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(googleFont)}:wght@300;400;500;700&display=swap`;
  document.head.appendChild(link);
}

export function applyTheme(theme, customColor = null) {
  // Background & color bases
  const bg = theme?.id === 'custom'
    ? (customColor || '#222')
    : (theme?.preview?.background || '#222');

  const fg = theme?.preview?.color || '#fff';
  const font = theme?.fontFamily || "'Cinzel', serif";

  // Module surface styling
  const moduleBg = theme?.texture
    ? `${theme.texture}, ${bg}`
    : bg;

  // Write CSS variables
  const root = document.documentElement;
  root.style.setProperty('--background-color', bg);
  root.style.setProperty('--text-color', fg);
  root.style.setProperty('--font-family', font);

  root.style.setProperty('--module-bg', moduleBg);
  root.style.setProperty('--module-color', fg);
  root.style.setProperty('--module-border', theme?.border || 'none');
  root.style.setProperty('--module-radius', theme?.borderRadius || '0');
  root.style.setProperty('--module-shadow', theme?.boxShadow || 'none');
  root.style.setProperty('--module-padding', theme?.modulePadding || '1rem');
  root.style.setProperty('--module-margin', theme?.moduleMargin || '1rem');

  // Accent variables (optional for components)
  if (theme?.accents?.primary) root.style.setProperty('--accent-primary', theme.accents.primary);
  if (theme?.accents?.secondary) root.style.setProperty('--accent-secondary', theme.accents.secondary);

  // Particles flag (for conditional render)
  root.style.setProperty('--particles-enabled', theme?.particles ? '1' : '0');

  // Load Google Font if provided
  if (theme?.googleFont) ensureGoogleFontLoaded(theme.googleFont);
}
