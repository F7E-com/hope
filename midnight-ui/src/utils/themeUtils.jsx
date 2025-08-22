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
  if (!theme) return;

  // Set background and text
  const bg = theme.id === 'custom'
    ? (customColor || '#222')
    : (theme.preview?.background || '#222');
  const fg = theme.preview?.color || '#fff';
  const font = theme.fontFamily || "'Cinzel', serif";

  // If texture is defined, use it *with* background layered
  const moduleBg = theme.texture
    ? `${theme.texture}, ${bg}`
    : bg;

  // Base styles
  wrapper.style.setProperty('--background-color', bg);
  wrapper.style.setProperty('--text-color', fg);
  wrapper.style.setProperty('--font-family', font);

  wrapper.style.setProperty('--module-bg', moduleBg);
  wrapper.style.setProperty('--module-color', fg);
  wrapper.style.setProperty('--module-border', theme.border || 'none');
  wrapper.style.setProperty('--module-radius', theme.borderRadius || '0');
  wrapper.style.setProperty('--module-shadow', theme.boxShadow || 'none');
  wrapper.style.setProperty('--module-padding', theme.modulePadding || '1rem');
  wrapper.style.setProperty('--module-margin', theme.moduleMargin || '1rem');

  // Border image (gradient border support)
  if (theme.borderImage) {
    wrapper.style.setProperty('--module-border-image', theme.borderImage);
    wrapper.style.setProperty('--module-border-image-slice', theme.borderImageSlice ?? 1);
  } else {
    wrapper.style.removeProperty('--module-border-image');
    wrapper.style.removeProperty('--module-border-image-slice');
  }

  // Accent colors
  if (theme.accents?.primary)
    wrapper.style.setProperty('--accent-primary', theme.accents.primary);
  if (theme.accents?.secondary)
    wrapper.style.setProperty('--accent-secondary', theme.accents.secondary);

  // Particle system settings
  if (theme.particles) {
    wrapper.style.setProperty('--particles-enabled', '1');
    wrapper.style.setProperty('--particles-number', theme.particles.number ?? 0);
    wrapper.style.setProperty('--particles-color', theme.particles.color ?? '#fff');
    wrapper.style.setProperty('--particles-size', theme.particles.size ?? 2);
    wrapper.style.setProperty('--particles-speed', theme.particles.speed ?? 1);
    wrapper.style.setProperty('--particles-random', theme.particles.random ? '1' : '0');
  } else {
    wrapper.style.setProperty('--particles-enabled', '0');
    wrapper.style.removeProperty('--particles-number');
    wrapper.style.removeProperty('--particles-color');
    wrapper.style.removeProperty('--particles-size');
    wrapper.style.removeProperty('--particles-speed');
    wrapper.style.removeProperty('--particles-random');
  }

  // Optional: apply a className to wrapper (if it's a top-level container)
  if (theme.className) {
    wrapper.classList.add(theme.className);
  }

  // Load Google font
  if (theme.googleFont) {
    ensureGoogleFontLoaded(theme.googleFont);
  }
}
