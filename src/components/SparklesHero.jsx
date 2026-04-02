import React, { useState, useEffect, useMemo } from 'react';
import Particles, { initParticlesEngine } from '@tsparticles/react';
import { loadFull } from 'tsparticles';

const SparklesHero = ({ isDark }) => {
  const [init, setInit] = useState(false);

  // Delayed isDark so particles switch color only after fading out
  const [activeIsDark, setActiveIsDark] = useState(isDark);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadFull(engine);
    }).then(() => setInit(true));
  }, []);

  useEffect(() => {
    setFading(true);
    const swap = setTimeout(() => {
      setActiveIsDark(isDark);
      setFading(false);
    }, 300); 
    return () => clearTimeout(swap);
  }, [isDark]);

  const particleColor = activeIsDark ? '#FFFFFF' : '#054377';

  const particlesConfig = useMemo(() => ({
    background: { color: { value: 'transparent' } },
    fullScreen: { enable: false },
    fpsLimit: 60, /* Locked to 60fps to prevent lag */
    interactivity: {
      events: {
        onClick: { enable: true, mode: 'push' },
        onHover: { enable: true, mode: 'grab' },
        resize: true,
      },
      modes: {
        push: { quantity: 4 },
        grab: { distance: 220, links: { opacity: 0.7, color: particleColor } },
      },
    },
    particles: {
      bounce: { horizontal: { value: 1 }, vertical: { value: 1 } },
      color: { value: particleColor },
      move: {
        direction: 'none',
        enable: true,
        outModes: { default: 'out' },
        random: false,
        speed: { min: 0.1, max: 1 },
        straight: false,
      },
      number: {
        density: { enable: true, width: 800, height: 800 },
        value: 120, /* Reduced from 1200 to enable fullscreen grab seamlessly */
      },
      opacity: {
        value: { min: 0.1, max: 1 },
        animation: {
          enable: true,
          speed: 4,
          sync: false,
          startValue: 'random',
          destroy: 'none',
        },
      },
      shape: { type: 'circle' },
      size: { value: { min: 0.4, max: 1 } },
    },
    detectRetina: true,
  }), [particleColor]);

  return (
    <section className="sparkles-hero relative">
      <div className="hero-content" style={{ pointerEvents: 'none' }}>
        <div className="header-ieee-logo">
          <img className="logo-animate" src="/images/IEEE-MUST.png" alt="IEEE MUST logo" />
        </div>
        <div className="header-text">
          <h1 className="text-animate-title">IEEE MUST</h1>
          <span className="text-animate-sub">Student Branch</span>
        </div>
      </div>

      <div className={`sparkles-container${fading ? ' fading' : ''}`}>
        <div className="sparkles-gradients">
          <div className="grad-1"></div>
          <div className="grad-2"></div>
          <div className="grad-3"></div>
          <div className="grad-4"></div>
        </div>

        {init && (
          <Particles
            id="tsparticles"
            className="w-full h-full"
            options={particlesConfig}
          />
        )}
      </div>
    </section>
  );
};

export default SparklesHero;
