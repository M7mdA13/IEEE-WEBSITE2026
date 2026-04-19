import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
// tsparticles is loaded dynamically at idle time — keeps the 144 KB chunk off the critical path

const SparklesHero = ({ isDark }) => {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] });
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -120]);

  const [ParticlesComp, setParticlesComp] = useState(null);
  const [init, setInit] = useState(false);

  // Delayed isDark so particles switch color only after fading out
  const [activeIsDark, setActiveIsDark] = useState(isDark);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const run = async () => {
      const [{ initParticlesEngine, default: Particles }, { loadSlim }] = await Promise.all([
        import('@tsparticles/react'),
        import('@tsparticles/slim'),
      ]);
      await initParticlesEngine(async (engine) => { await loadSlim(engine); });
      setParticlesComp(() => Particles);
      setInit(true);
    };

    if ('requestIdleCallback' in window) {
      const id = requestIdleCallback(run, { timeout: 2000 });
      return () => cancelIdleCallback(id);
    } else {
      const t = setTimeout(run, 200);
      return () => clearTimeout(t);
    }
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
    fpsLimit: 60,
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
        value: 120,
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
    <section ref={sectionRef} className="sparkles-hero relative">
      <motion.div className="hero-content" style={{ pointerEvents: 'none', y: contentY }}>
        <div className="header-ieee-logo">
          <img className="logo-animate" src="/images/IEEE-MUST.webp" alt="IEEE MUST logo" fetchpriority="high" />
        </div>
        <div className="header-text">
          <h1 className="text-animate-title">IEEE MUST</h1>
          <span className="text-animate-sub">Student Branch</span>
        </div>
      </motion.div>

      <div className={`sparkles-container${fading ? ' fading' : ''}`}>
        <div className="sparkles-gradients">
          <div className="grad-1"></div>
          <div className="grad-2"></div>
          <div className="grad-3"></div>
          <div className="grad-4"></div>
        </div>

        {init && ParticlesComp && (
          <ParticlesComp
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
