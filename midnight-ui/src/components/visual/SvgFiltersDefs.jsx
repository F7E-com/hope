// src/components/visual/SvgFiltersDefs.jsx
import React from 'react';

export default function SvgFiltersDefs() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }}>
      <defs>
        {/* Neon glow */}
        <filter id="fx-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur"/>
          <feMerge>
            <feMergeNode in="blur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>

        {/* Inky edge (for modules) */}
        <filter id="fx-ink" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="1" result="noise"/>
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" xChannelSelector="R" yChannelSelector="G"/>
        </filter>

        {/* Hologram shimmer on hover */}
        <filter id="fx-holo" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.01" numOctaves="2" seed="2" result="noise"/>
          <feColorMatrix type="saturate" values="1"/>
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="6"/>
        </filter>
      </defs>
    </svg>
  );
}
