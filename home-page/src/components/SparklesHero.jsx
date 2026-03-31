import React, { useState, useEffect, useMemo } from 'react';
import Particles, { initParticlesEngine } from '@tsparticles/react';
import { loadFull } from 'tsparticles';

const SparklesHero = ({ isDark }) => {
  const [ init, setInit ] = useState(false);
  const particleColor = isDark ? "#FFFFFF" : "#054377";

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadFull(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const particlesConfig = useMemo(() => ({
    background: {
      color: {
        value: "transparent",
      },
    },
    fullScreen: {
      enable: false,
    },
    fpsLimit: 120,
    interactivity: {
      events: {
        onClick: {
          enable: true,
          mode: "push",
        },
        onHover: {
          enable: false,
          mode: "repulse",
        },
        resize: true,
      },
      modes: {
        push: {
          quantity: 4,
        },
        repulse: {
          distance: 200,
          duration: 0.4,
        },
      },
    },
    particles: {
      bounce: {
        horizontal: { value: 1 },
        vertical: { value: 1 },
      },
      color: {
        value: particleColor,
      },
      move: {
        direction: "none",
        enable: true,
        outModes: {
          default: "out",
        },
        random: false,
        speed: {
          min: 0.1,
          max: 1,
        },
        straight: false,
      },
      number: {
        density: {
          enable: true,
          width: 400,
          height: 400,
        },
        value: 1200,
      },
      opacity: {
        value: {
          min: 0.1,
          max: 1,
        },
        animation: {
          enable: true,
          speed: 4,
          sync: false,
          startValue: "random",
          destroy: "none",
        },
      },
      shape: {
        type: "circle",
      },
      size: {
        value: {
          min: 0.4,
          max: 1,
        },
      },
    },
    detectRetina: true,
  }), [particleColor]);

  return (
    <section className="sparkles-hero relative">
      <div className="hero-content">
        <div className="header-ieee-logo">
          <img className="logo-animate" src="/images/IEEE-MUST.png" alt="IEEE MUST logo" />
        </div>
        <div className="header-text">
          <h1 className="text-animate-title">IEEE MUST</h1>
          <span className="text-animate-sub">Student Branch</span>
        </div>
      </div>

      <div className="sparkles-container">
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

        <div className="sparkles-mask"></div>
      </div>
    </section>
  );
};

export default SparklesHero;
