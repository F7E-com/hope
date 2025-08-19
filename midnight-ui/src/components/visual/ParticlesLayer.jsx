// src/components/visual/ParticlesLayer.jsx
import React, { useMemo } from 'react';
import Particles from 'react-tsparticles';

export default function ParticlesLayer({ config }) {
  const opts = useMemo(() => {
    if (!config) return null;
    const {
      number = 40,
      color = '#ffffff',
      size = 2,
      speed = 0.6,
      random = true,
    } = config;

    return {
      fullScreen: { enable: true, zIndex: 0 },
      background: { color: 'transparent' },
      fpsLimit: 60,
      particles: {
        number: { value: number, density: { enable: true, area: 800 } },
        color: { value: color },
        shape: { type: 'circle' },
        opacity: { value: 0.6 },
        size: { value: size, random: { enable: random, minimumValue: 1 } },
        move: {
          enable: true,
          speed,
          direction: 'none',
          random,
          straight: false,
          outModes: { default: 'out' },
        },
      },
      detectRetina: true,
    };
  }, [config]);

  if (!opts) return null;
  return <Particles options={opts} />;
}
