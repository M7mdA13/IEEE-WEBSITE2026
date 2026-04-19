import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SolarSystem from './SolarSystem';
import api from '../../api/public';
import './About.css';

/* ── Planet content ──────────────────────────────────────────── */
const PLANET_CONTENT = {
  story: {
    title: 'Our Story',
    body: 'IEEE MUST Student Branch was founded at Misr University for Science and Technology with one goal: bring students closer to the engineering world. From a small group of passionate students, we grew into one of Egypt\'s most active IEEE branches — hosting workshops, hackathons, and events that shape future engineers.',
    stats: [{ label: 'Founded', value: '2012' }, { label: 'Years Active', value: '12+' }, { label: 'Members', value: '400+' }],
  },
  mission: {
    title: 'Our Mission',
    body: 'We exist to advance technology for the benefit of humanity. That means giving students access to real knowledge, real networks, and real opportunities — through technical workshops, mentorship programs, and a culture of continuous learning across every discipline.',
    stats: [{ label: 'Committees', value: '8' }, { label: 'Events / Year', value: '50+' }, { label: 'Disciplines', value: '6+' }],
  },
  team: {
    title: 'Our Team',
    body: 'Our leadership board is elected every year from within our member base. Each committee is led by passionate students who volunteer their time to build something meaningful — from technical content to media, marketing, and beyond. Behind every event is a team of dedicated people.',
    stats: [{ label: 'Committees', value: '8' }, { label: 'Board Members', value: '16+' }, { label: 'Volunteers', value: '100+' }],
  },
  impact: {
    title: 'Our Impact',
    body: 'Over 200 events hosted, 400+ members engaged, and a growing network of alumni now working across Egypt and the world. Our impact extends beyond the university — touching industries, communities, and the next generation of engineers.',
    stats: [{ label: 'Events Held', value: '200+' }, { label: 'Members', value: '400+' }, { label: 'Alumni', value: 'Global' }],
  },
};

/* ── Timeline milestones ─────────────────────────────────────── */
const TIMELINE = [
  { year: '2012', icon: 'fa-flag',        color: '#0096ED', title: 'Branch Founded',          desc: 'IEEE MUST Student Branch established at Misr University for Science and Technology with a small group of passionate students.' },
  { year: '2015', icon: 'fa-bolt',        color: '#f97316', title: 'First Hackathon',         desc: 'Hosted our first 24-hour hackathon, attracting over 80 student participants from across the university.' },
  { year: '2017', icon: 'fa-layer-group', color: '#8b5cf6', title: 'Eight Committees',        desc: 'Expanded into 8 specialized technical and non-technical committees, covering everything from AI to media.' },
  { year: '2019', icon: 'fa-users',       color: '#22c55e', title: '200+ Members',            desc: 'Crossed 200 active members and launched the mentorship program connecting students with industry professionals.' },
  { year: '2022', icon: 'fa-award',       color: '#06b6d4', title: 'National Recognition',    desc: 'Recognized among Egypt\'s most active IEEE branches for event volume, quality, and community impact.' },
  { year: '2024', icon: 'fa-code',        color: '#3b82f6', title: 'New Website',             desc: 'Launched a fully redesigned website, built entirely by our in-house engineering and design team.' },
  { year: '2025', icon: 'fa-star',        color: '#ffc107', title: 'Exemplary Branch Award',  desc: 'IEEE MUST Student Branch received the prestigious 2025 IEEE Exemplary Student Branch award — the highest recognition for outstanding technical excellence, community engagement, and impact.' },
];

/* ── Website Team (pyramid tiers) ───────────────────────────── */
const TIERS = [
  {
    label: 'Tier I — Leadership',
    members: [
      { name: 'Mennatallah Mostafa', role: 'Webmaster', photo: '/images/Mennatallah copy.png' },
    ],
  },
  {
    label: 'Tier II — Design',
    members: [
      { name: 'Firstname Lastname', role: 'UI/UX Designer', photo: null },
      { name: 'Firstname Lastname', role: 'UI/UX Designer', photo: null },
      { name: 'Firstname Lastname', role: 'UI/UX Designer', photo: null },
    ],
  },
  {
    label: 'Tier III — Engineering',
    members: [
      { name: 'Firstname Lastname',  role: 'Frontend Developer',   photo: null },
      { name: 'Firstname Lastname',  role: 'Full Stack Developer',  photo: null },
      { name: 'Firstname Lastname',  role: 'Frontend Developer',   photo: null },
    ],
  },
];

const TIER_LABELS = {
  1: 'Tier I — Leadership',
  2: 'Tier II — Design',
  3: 'Tier III — Engineering',
};

function membersToTiers(members) {
  const groups = { 1: [], 2: [], 3: [] };
  members.forEach(m => { if (groups[m.tier]) groups[m.tier].push(m); });
  return [1, 2, 3]
    .filter(t => groups[t].length > 0)
    .map(t => ({ label: TIER_LABELS[t], members: groups[t] }));
}

const isTouch = typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0);

/* ── Page ─────────────────────────────────────────────────────── */
const About = () => {
  const [selected, setSelected] = useState(null);
  const [tiers, setTiers] = useState(TIERS);

  useEffect(() => {
    api.get('/website-team')
      .then(({ data }) => {
        if (data.data?.length > 0) setTiers(membersToTiers(data.data));
      })
      .catch(() => {});
  }, []);
  const content = selected ? PLANET_CONTENT[selected.id] : null;
  const panelColor = selected ? `#${selected.color.toString(16).padStart(6, '0')}` : '#3b82f6';

  return (
    <div className="about-page">

      {/* ── Full-screen solar system ── */}
      <section className="about-solar-section">
        <motion.div
          className="about-solar-heading"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <h1>About <span>IEEE MUST</span></h1>
        </motion.div>

        <SolarSystem onPlanetSelect={setSelected} />

        {/* Panel — absolute inside section, below FAB z-index */}
        <AnimatePresence>
          {content && (
            <motion.div
              className="about-panel"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 40 }}
              transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <div className="about-panel-accent" style={{ background: panelColor }} />
              <button
                className="about-panel-close"
                onClick={() => {
                  setSelected(null);
                  document.dispatchEvent(new CustomEvent('reset-orbit'));
                }}
                aria-label="Close"
              >
                <i className="fas fa-times" />
              </button>
              <div className="about-panel-dot" style={{ background: panelColor }} />
              <h3 className="about-panel-title" style={{ color: panelColor }}>{content.title}</h3>
              <p className="about-panel-body">{content.body}</p>
              <div className="about-panel-stats">
                {content.stats.map((s, i) => (
                  <div key={i} className="about-panel-stat">
                    <span className="about-panel-stat-value" style={{ color: panelColor }}>{s.value}</span>
                    <span className="about-panel-stat-label">{s.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {!selected && (
            <motion.p
              className="about-hint"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 1 }}
            >
              <i className={isTouch ? 'fas fa-hand' : 'fas fa-hand-pointer'} />
              {isTouch ? 'Tap' : 'Click'} a planet to explore
            </motion.p>
          )}
        </AnimatePresence>
      </section>

      {/* ── Timeline ── */}
      <section className="about-timeline-section">
        <div className="about-website-inner">
          <motion.div
            className="about-section-header"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2>Our Journey</h2>
            <p>Over a decade of building, learning, and growing.</p>
          </motion.div>

          <div className="about-timeline">
            {TIMELINE.map((item, i) => (
              <motion.div
                key={i}
                className={`about-timeline-item ${i % 2 === 0 ? 'tl-left' : 'tl-right'}`}
                initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: 0.05, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                <div
                  className="about-timeline-card"
                  style={{ '--card-accent': item.color }}
                >
                  <div className="about-timeline-card-top">
                    <div className="about-timeline-icon">
                      <i className={`fas ${item.icon}`} />
                    </div>
                    <span className="about-timeline-year">{item.year}</span>
                  </div>
                  <h4 className="about-timeline-title">{item.title}</h4>
                  <p className="about-timeline-desc">{item.desc}</p>
                </div>
                <div
                  className="about-timeline-dot"
                  style={{ '--card-accent': item.color }}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Website Team ── */}
      <section className="about-website-team">
        <div className="about-website-inner">
          <motion.div
            className="about-section-header"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2>Website Team</h2>
            <p>The engineers behind the screen — building the digital home of IEEE MUST.</p>
          </motion.div>

          <div className="website-team-pyramid">
            {tiers.map((tier, ti) => (
              <motion.div
                key={ti}
                className="website-tier"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ delay: ti * 0.12, duration: 0.5 }}
              >
                <span className="website-tier-label">{tier.label}</span>
                <div className="website-tier-row">
                  {tier.members.map((member, mi) => (
                    <div key={mi} className="website-team-card">
                      <div className="website-team-photo">
                        {member.photo ? (
                          <img src={member.photo} alt={member.name} />
                        ) : (
                          <div className="website-team-placeholder">
                            <i className="fas fa-user" />
                          </div>
                        )}
                      </div>
                      <div className="website-team-info">
                        <h4>{member.name}</h4>
                        <span>{member.role}</span>
                        {(member.github || member.linkedin || member.email) && (
                          <div className="website-team-social">
                            {member.github && member.github !== '#' && (
                              <a href={member.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                                <i className="fab fa-github" />
                              </a>
                            )}
                            {member.linkedin && member.linkedin !== '#' && (
                              <a href={member.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                                <i className="fab fa-linkedin" />
                              </a>
                            )}
                            {member.email && member.email !== '#' && (
                              <a href={`mailto:${member.email}`} aria-label="Email">
                                <i className="fas fa-envelope" />
                              </a>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};

export default About;
