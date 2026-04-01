import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SolarSystem from './SolarSystem';
import './About.css';

const CONTENT = {
  story: {
    title: 'Our Story',
    subtitle: 'How it all began',
    body: 'IEEE MUST Student Branch was founded at Misr University for Science and Technology with one goal: bring students closer to the engineering world. From a small group of passionate students, we grew into one of the most active IEEE branches in Egypt — hosting workshops, competitions, and events that shape future engineers.',
    stats: [
      { label: 'Founded',     value: '2012' },
      { label: 'Years Active', value: '12+' },
    ],
    accent: '#f59e0b',
  },
  mission: {
    title: 'Our Mission',
    subtitle: 'What drives us forward',
    body: 'We exist to advance technology for the benefit of humanity. That means giving students access to real knowledge, real networks, and real opportunities — through technical workshops, mentorship programs, and a culture of continuous learning across every discipline.',
    stats: [
      { label: 'Committees',  value: '8'   },
      { label: 'Events/Year', value: '50+' },
    ],
    accent: '#3b82f6',
  },
  team: {
    title: 'Our Team',
    subtitle: 'The people behind it all',
    body: 'Our leadership board is elected every year from within our member base. Each committee is led by passionate students who volunteer their time to build something meaningful — from technical content to logistics, marketing, and beyond.',
    stats: [
      { label: 'Board Members', value: '12'   },
      { label: 'Active Volunteers', value: '100+' },
    ],
    accent: '#ef4444',
  },
  impact: {
    title: 'Our Impact',
    subtitle: 'What we have built',
    body: 'Over the years, MUST Student Branch has hosted hundreds of events, produced countless memories, and helped launch the careers of engineers now working across Egypt and the world. Numbers only tell part of the story — but they tell it well.',
    stats: [
      { label: 'Events Held', value: '200+' },
      { label: 'Members',     value: '400+' },
    ],
    accent: '#22c55e',
  },
};

const isMobile = () => window.innerWidth <= 768;

const getPanelVariants = () => isMobile()
  ? {
      hidden:  { y: '100%', opacity: 0 },
      visible: { y: 0,      opacity: 1, transition: { type: 'spring', stiffness: 280, damping: 30 } },
      exit:    { y: '100%', opacity: 0, transition: { duration: 0.25, ease: 'easeIn' } },
    }
  : {
      hidden:  { x: '100%', opacity: 0 },
      visible: { x: 0,      opacity: 1, transition: { type: 'spring', stiffness: 280, damping: 30 } },
      exit:    { x: '100%', opacity: 0, transition: { duration: 0.25, ease: 'easeIn' } },
    };

export default function About() {
  const [selected, setSelected] = useState(null);

  const handleSelect = useCallback((planet) => {
    setSelected(planet ? CONTENT[planet.id] : null);
  }, []);

  const content = selected;

  return (
    <main className="about-page">
      <SolarSystem onPlanetSelect={handleSelect} />

      {/* Hint text when nothing is selected */}
      <AnimatePresence>
        {!selected && (
          <motion.p
            className="solar-hint"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 1.2, duration: 0.6 } }}
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
          >
            Click a planet to explore
          </motion.p>
        )}
      </AnimatePresence>

      {/* Info panel */}
      <AnimatePresence>
        {content && (
          <motion.aside
            key={content.title}
            className="planet-panel"
            variants={getPanelVariants()}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={{ '--panel-accent': content.accent }}
          >
            <button
              className="panel-close"
              onClick={() => {
                setSelected(null);
                /* camera reset is handled by clicking outside in SolarSystem */
              }}
              aria-label="Close"
            >
              ✕
            </button>

            <div className="panel-accent-bar" />

            <p className="panel-subtitle">{content.subtitle}</p>
            <h2 className="panel-title">{content.title}</h2>

            <p className="panel-body">{content.body}</p>

            <div className="panel-stats">
              {content.stats.map(s => (
                <div key={s.label} className="panel-stat">
                  <span className="stat-value">{s.value}</span>
                  <span className="stat-label">{s.label}</span>
                </div>
              ))}
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </main>
  );
}
