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

export function applyTheme(theme, customColor = null, wrapper = document.documentElement) {
  const bg = theme?.id === 'custom'
    ? (customColor || '#222')
    : (theme?.preview?.background || '#222');

  const fg = theme?.preview?.color || '#fff';
  const font = theme?.fontFamily || "'Cinzel', serif";

  const moduleBg = theme?.texture
    ? `${theme.texture}, ${bg}`
    : bg;

  wrapper.style.setProperty('--background-color', bg);
  wrapper.style.setProperty('--text-color', fg);
  wrapper.style.setProperty('--font-family', font);

  wrapper.style.setProperty('--module-bg', moduleBg);
  wrapper.style.setProperty('--module-color', fg);
  wrapper.style.setProperty('--module-border', theme?.border || 'none');
  wrapper.style.setProperty('--module-radius', theme?.borderRadius || '0');
  wrapper.style.setProperty('--module-shadow', theme?.boxShadow || 'none');
  wrapper.style.setProperty('--module-padding', theme?.modulePadding || '1rem');
  wrapper.style.setProperty('--module-margin', theme?.moduleMargin || '1rem');

  if (theme?.accents?.primary) wrapper.style.setProperty('--accent-primary', theme.accents.primary);
  if (theme?.accents?.secondary) wrapper.style.setProperty('--accent-secondary', theme.accents.secondary);

  wrapper.style.setProperty('--particles-enabled', theme?.particles ? '1' : '0');

  if (theme?.googleFont) ensureGoogleFontLoaded(theme.googleFont);
}
