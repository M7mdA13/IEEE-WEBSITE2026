import React, { useRef, useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import './About.css';

/* ─────────────────────────────────────────────────────────────
   ALL CARD DATA (text + image, all have panel content)
───────────────────────────────────────────────────────────── */
const CARDS = [
  /* ── ROW 1 ─────────────────────────── */
  {
    id: 'who',
    type: 'text',
    tag: 'About Us',
    title: 'Who We Are',
    accent: '#3b82f6',
    x: 60,  y: 80,  w: 300, h: 320,
    panel: {
      subtitle: 'About the Branch',
      body: 'IEEE MUST Student Branch was founded at Misr University for Science and Technology with one goal: bring students closer to the engineering world. From a small group of passionate students, we grew into one of Egypt\'s most active IEEE branches — hosting workshops, hackathons, and events that shape future engineers.',
      image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=900&q=80',
      stats: [{ label: 'Founded', value: '2012' }, { label: 'Years Active', value: '12+' }],
    },
  },
  {
    id: 'img-make',
    type: 'image',
    tag: 'News',
    label: 'Make Your Move',
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&q=80',
    x: 400, y: 60,  w: 340, h: 280,
    panel: {
      subtitle: 'Latest at IEEE MUST',
      title: 'Make Your Move',
      body: 'Step into a community that challenges you, supports you, and helps you grow into the engineer you were meant to be. Join IEEE MUST and start your journey.',
      image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=900&q=80',
      stats: [{ label: 'Open to', value: 'All' }, { label: 'Disciplines', value: '6+' }],
    },
  },
  {
    id: 'values',
    type: 'text',
    tag: 'Our Principles',
    title: 'What We\nStand For',
    accent: '#8b5cf6',
    x: 790, y: 80,  w: 300, h: 300,
    panel: {
      subtitle: 'Our Core Principles',
      body: 'Innovation without boundaries, collaboration without ego, and impact without compromise. Every event, workshop, and project we run is grounded in the belief that students can shape the future of technology — starting right now, not after graduation.',
      image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=900&q=80',
      stats: [{ label: 'Core Values', value: '3' }, { label: 'Outreach', value: 'National' }],
    },
  },
  {
    id: 'mission',
    type: 'text',
    tag: 'What Drives Us',
    title: 'Our Mission',
    accent: '#f59e0b',
    x: 1140, y: 60,  w: 300, h: 340,
    panel: {
      subtitle: 'What Drives Us Forward',
      body: 'We exist to advance technology for the benefit of humanity. That means giving students access to real knowledge, real networks, and real opportunities — through technical workshops, mentorship programs, and a culture of continuous learning across every discipline.',
      image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=900&q=80',
      stats: [{ label: 'Committees', value: '8' }, { label: 'Events / Year', value: '50+' }],
    },
  },
  {
    id: 'img-strategy-top',
    type: 'image',
    tag: 'About Us',
    label: 'Our Strategy',
    image: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=600&q=80',
    x: 1490, y: 70,  w: 280, h: 260,
    panel: {
      subtitle: 'How We Operate',
      title: 'Our Strategy',
      body: 'We build capability from within. Our strategy focuses on training leaders, rotating roles across committees, and systematically expanding our reach to every engineering discipline. Each year\'s board sets goals, measures outcomes, and passes knowledge forward.',
      image: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=900&q=80',
      stats: [{ label: 'Annual Plans', value: 'Active' }, { label: 'Growth', value: '↑ 40%' }],
    },
  },
  {
    id: 'strategy',
    type: 'text',
    tag: 'About Us',
    title: 'Our Strategy',
    accent: '#06b6d4',
    x: 1820, y: 60,  w: 280, h: 300,
    panel: {
      subtitle: 'How We Operate',
      body: 'We build capability from within. Our strategy focuses on training leaders, rotating roles across committees, and systematically expanding our reach to every engineering discipline. Each year\'s board sets goals, measures outcomes, and passes knowledge forward.',
      image: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=900&q=80',
      stats: [{ label: 'Annual Plans', value: 'Active' }, { label: 'Growth', value: '↑ 40%' }],
    },
  },
  {
    id: 'img-cocurr-top',
    type: 'image',
    tag: 'School Life',
    label: 'Co-curricular\nPrograms',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80',
    x: 2150, y: 80,  w: 290, h: 260,
    panel: {
      subtitle: 'What We Do',
      title: 'Co-curricular Programs',
      body: 'From robotics and AI to public speaking and entrepreneurship, our programs equip members with skills that matter in the real world. We partner with industry, compete regionally, and collaborate with other IEEE branches across Egypt.',
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=900&q=80',
      stats: [{ label: 'Programs', value: '12+' }, { label: 'Disciplines', value: '6+' }],
    },
  },
  {
    id: 'img-community-top',
    type: 'image',
    tag: 'About Us',
    label: 'Community',
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&q=80',
    x: 2490, y: 70,  w: 270, h: 260,
    panel: {
      subtitle: 'Our Community',
      title: 'Community',
      body: 'IEEE MUST is more than a student branch — it\'s a thriving community of engineers, creators, leaders, and thinkers. We celebrate diversity of thought and build connections that last a lifetime.',
      image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=900&q=80',
      stats: [{ label: 'Members', value: '400+' }, { label: 'Alumni', value: 'Global' }],
    },
  },

  /* ── ROW 2 ─────────────────────────── */
  {
    id: 'img-workshop',
    type: 'image',
    tag: 'Events',
    label: 'Workshops',
    image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&q=80',
    x: 60,  y: 460, w: 280, h: 340,
    panel: {
      subtitle: 'Technical Training',
      title: 'Workshops & Training',
      body: 'Our workshops cover everything from embedded systems and machine learning to web development and competitive programming. Led by senior members and industry professionals, these sessions give you hands-on skills you can use immediately.',
      image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=900&q=80',
      stats: [{ label: 'Workshops / Year', value: '30+' }, { label: 'Topics', value: '15+' }],
    },
  },
  {
    id: 'img-campus',
    type: 'image',
    tag: 'Campus Life',
    label: 'MUST Campus',
    image: 'https://images.unsplash.com/photo-1562774053-701939374585?w=600&q=80',
    x: 390, y: 420, w: 330, h: 370,
    panel: {
      subtitle: 'Our Home',
      title: 'MUST Campus',
      body: 'Misr University for Science and Technology in 6th of October City is home to thousands of students across engineering, medicine, science, and more. IEEE MUST Student Branch is at the heart of campus life.',
      image: 'https://images.unsplash.com/photo-1562774053-701939374585?w=900&q=80',
      stats: [{ label: 'Location', value: '6th Oct' }, { label: 'Students', value: '10k+' }],
    },
  },
  {
    id: 'img-team',
    type: 'image',
    tag: 'About Us',
    label: 'Our Team',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&q=80',
    x: 770, y: 450, w: 310, h: 360,
    panel: {
      subtitle: 'The People Behind It All',
      title: 'Our Team',
      body: 'Our leadership board is elected every year from within our member base. Each committee is led by passionate students who volunteer their time to build something meaningful — from technical content to logistics, marketing, and beyond.',
      image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=900&q=80',
      stats: [{ label: 'Board Members', value: '12' }, { label: 'Volunteers', value: '100+' }],
    },
  },
  {
    id: 'img-events',
    type: 'image',
    tag: 'About Us',
    label: 'What We Do',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80',
    x: 1130, y: 470, w: 330, h: 360,
    panel: {
      subtitle: 'Activities & Events',
      title: 'What We Do',
      body: 'From large-scale annual events to intimate technical sessions, IEEE MUST runs a full calendar of activities designed to educate, inspire, and connect. Every event is an opportunity to learn, network, and grow.',
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=900&q=80',
      stats: [{ label: 'Events Held', value: '200+' }, { label: 'Attendees', value: '5k+' }],
    },
  },
  {
    id: 'img-community',
    type: 'image',
    tag: 'School Life',
    label: 'Community',
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&q=80',
    x: 1510, y: 440, w: 280, h: 350,
    panel: {
      subtitle: 'Our Community',
      title: 'Community',
      body: 'IEEE MUST is more than a student branch — it\'s a thriving community of engineers, creators, leaders, and thinkers. We celebrate diversity of thought and build connections that last a lifetime.',
      image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=900&q=80',
      stats: [{ label: 'Members', value: '400+' }, { label: 'Alumni', value: 'Global' }],
    },
  },
  {
    id: 'img-senior',
    type: 'image',
    tag: 'School Life',
    label: 'Senior Members',
    image: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=600&q=80',
    x: 1840, y: 450, w: 290, h: 340,
    panel: {
      subtitle: 'Experience Matters',
      title: 'Senior Members',
      body: 'Our senior members bring years of IEEE experience — they mentor juniors, lead technical workshops, represent MUST at regional conferences, and bridge the gap between student life and professional engineering.',
      image: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=900&q=80',
      stats: [{ label: 'Seniors', value: '40+' }, { label: 'Mentors', value: 'Active' }],
    },
  },
  {
    id: 'img-cocurricular',
    type: 'image',
    tag: 'School Life',
    label: 'Programs',
    image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=600&q=80',
    x: 2180, y: 430, w: 280, h: 340,
    panel: {
      subtitle: 'Learning Beyond Class',
      title: 'Programs',
      body: 'Our co-curricular programs run year-round, blending technical depth with soft skills. Members join programs tailored to their committee — whether that\'s circuits lab, public speaking, or entrepreneurship bootcamps.',
      image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=900&q=80',
      stats: [{ label: 'Programs', value: '12+' }, { label: 'Duration', value: 'Year Round' }],
    },
  },
  {
    id: 'img-build',
    type: 'image',
    tag: 'Community',
    label: 'Build Together',
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&q=80',
    x: 2510, y: 420, w: 260, h: 330,
    panel: {
      subtitle: 'Collaboration at Heart',
      title: 'Build Together',
      body: 'The best projects are built together. At IEEE MUST, we foster a culture of collaboration — pairing experienced members with newcomers, running team-based hackathons, and celebrating group achievement.',
      image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=900&q=80',
      stats: [{ label: 'Teams', value: 'Dozens' }, { label: 'Projects', value: 'Active' }],
    },
  },

  /* ── ROW 3 ─────────────────────────── */
  {
    id: 'programs',
    type: 'text',
    tag: 'What We Do',
    title: 'Co-curricular\nPrograms',
    accent: '#22c55e',
    x: 60,  y: 870, w: 310, h: 340,
    panel: {
      subtitle: 'Beyond the Classroom',
      body: 'From robotics and AI to public speaking and entrepreneurship, our programs equip members with skills that matter in the real world. We partner with industry, compete regionally, and collaborate with other IEEE branches across Egypt.',
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=900&q=80',
      stats: [{ label: 'Programs', value: '12+' }, { label: 'Disciplines', value: '6+' }],
    },
  },
  {
    id: 'img-bottom-2',
    type: 'image',
    tag: 'Campus Life',
    label: 'Truganina Campus',
    image: 'https://images.unsplash.com/photo-1562774053-701939374585?w=600&q=80',
    x: 420, y: 870, w: 300, h: 320,
    panel: {
      subtitle: 'Our Campus',
      title: 'Truganina Campus',
      body: 'A modern campus environment that provides the perfect backdrop for learning, innovation, and collaboration. State-of-the-art facilities support engineering education and student life.',
      image: 'https://images.unsplash.com/photo-1562774053-701939374585?w=900&q=80',
      stats: [{ label: 'Labs', value: '20+' }, { label: 'Facilities', value: 'Modern' }],
    },
  },
  {
    id: 'img-williamstown',
    type: 'image',
    tag: 'Campus Life',
    label: 'Williamstown',
    image: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=600&q=80',
    x: 770, y: 880, w: 290, h: 300,
    panel: {
      subtitle: 'Campus Spirit',
      title: 'Williamstown',
      body: 'Where innovation meets community. Our campus spaces are designed for collaboration, with open areas for project work, events, and spontaneous conversations that spark great ideas.',
      image: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=900&q=80',
      stats: [{ label: 'Spaces', value: 'Open' }, { label: 'Spirit', value: '✓' }],
    },
  },
  {
    id: 'impact',
    type: 'text',
    tag: 'Numbers That Matter',
    title: 'Our Impact',
    accent: '#ef4444',
    x: 1110, y: 860, w: 310, h: 340,
    panel: {
      subtitle: 'Numbers Tell the Story',
      body: 'Over 200 events hosted, 400+ members engaged, and a growing network of alumni now working across Egypt and the world. Our impact extends beyond the university — touching industries, communities, and the next generation of engineers.',
      image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=900&q=80',
      stats: [{ label: 'Events Held', value: '200+' }, { label: 'Members', value: '400+' }],
    },
  },
  {
    id: 'img-senior-school',
    type: 'image',
    tag: 'School Life',
    label: 'Senior School',
    image: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=600&q=80',
    x: 1470, y: 870, w: 280, h: 310,
    panel: {
      subtitle: 'Senior Excellence',
      title: 'Senior School',
      body: 'Our senior track prepares advanced members for leadership, professional certifications, and IEEE global engagement. Senior members represent MUST at national and international IEEE events.',
      image: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=900&q=80',
      stats: [{ label: 'Seniors', value: '40+' }, { label: 'Certs', value: 'Active' }],
    },
  },
  {
    id: 'img-events-bottom',
    type: 'image',
    tag: 'Events',
    label: 'Annual Events',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80',
    x: 1800, y: 870, w: 300, h: 320,
    panel: {
      subtitle: 'Signature Events',
      title: 'Annual Events',
      body: 'From our flagship MUST Hackathon to the Annual Symposium and Industry Day, our calendar is packed with high-impact events that bring together students, professors, and industry leaders.',
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=900&q=80',
      stats: [{ label: 'Flagship Events', value: '5+' }, { label: 'Attendees', value: '500+' }],
    },
  },
  {
    id: 'img-cocurr-bottom',
    type: 'image',
    tag: 'School Life',
    label: 'Co-curricular',
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&q=80',
    x: 2150, y: 860, w: 280, h: 310,
    panel: {
      subtitle: 'Extra-curricular Excellence',
      title: 'Co-curricular',
      body: 'Beyond technical skills, our co-curricular activities build leadership, communication, and teamwork. From debate clubs to entrepreneurship competitions, there\'s something for every passion.',
      image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=900&q=80',
      stats: [{ label: 'Activities', value: '20+' }, { label: 'Leaders', value: 'Yearly' }],
    },
  },
  {
    id: 'img-community-bottom',
    type: 'image',
    tag: 'About Us',
    label: 'Our Community',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&q=80',
    x: 2480, y: 870, w: 280, h: 300,
    panel: {
      subtitle: 'Global Network',
      title: 'Our Community',
      body: 'IEEE MUST alumni are now engineers, entrepreneurs, and innovators working across Egypt, the Middle East, and the world. Our community is a lifelong network that opens doors long after graduation.',
      image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=900&q=80',
      stats: [{ label: 'Alumni', value: 'Global' }, { label: 'Network', value: 'Active' }],
    },
  },
];

/* ─────────────────────────────────────────────────────────────
   FULL-SCREEN OVERLAY PANEL (like Westbourne reference)
───────────────────────────────────────────────────────────── */
function OverlayPanel({ card, onClose }) {
  const p = card.panel;
  const title = card.type === 'text' ? card.title : (p.title || card.label);

  return (
    <motion.div
      className="overlay-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onClose}
    >
      {/* Close button — floats above the panel */}
      <motion.button
        className="overlay-close"
        onClick={onClose}
        aria-label="Close"
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1, transition: { delay: 0.15, duration: 0.25 } }}
        exit={{ opacity: 0, scale: 0.7 }}
      >
        ✕
      </motion.button>

      {/* Panel Card */}
      <motion.div
        className="overlay-panel"
        initial={{ opacity: 0, y: 40, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1, transition: { delay: 0.05, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] } }}
        exit={{ opacity: 0, y: 20, scale: 0.97, transition: { duration: 0.25 } }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="overlay-header">
          <p className="overlay-tag">{p.subtitle || card.tag}</p>
          <h2 className="overlay-title">{title}</h2>
        </div>

        {/* Image */}
        {p.image && (
          <div className="overlay-image-wrap">
            <img src={p.image} alt={title} className="overlay-image" />
          </div>
        )}

        {/* Body */}
        {p.body && <p className="overlay-body">{p.body}</p>}

        {/* Stats */}
        {p.stats && (
          <div className="overlay-stats">
            {p.stats.map((s) => (
              <div key={s.label} className="overlay-stat">
                <span className="ostat-value">{s.value}</span>
                <span className="ostat-label">{s.label}</span>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────
   BOTTOM NAV PILLS
───────────────────────────────────────────────────────────── */
function BottomNav({ onNavigate }) {
  return (
    <div className="bottom-nav">
      <button className="bottom-pill" onClick={() => onNavigate('who')}>
        I am a <strong>New Member</strong>
      </button>
      <div className="bottom-pill-divider">
        <span className="bottom-pill-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <line x1="2" y1="12" x2="22" y2="12"/>
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
          </svg>
        </span>
      </div>
      <button className="bottom-pill" onClick={() => onNavigate('programs')}>
        Exploring <strong>What We Do</strong>
      </button>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   MAIN ABOUT PAGE
───────────────────────────────────────────────────────────── */
const CANVAS_W = 2900;
const CANVAS_H = 1350;

export default function About() {
  const wrapRef     = useRef(null);
  const offsetRef   = useRef({ x: 0, y: 0 });
  const startRef    = useRef({ x: 0, y: 0 });
  const isDragging  = useRef(false);
  const velocityRef = useRef({ x: 0, y: 0 });
  const lastPos     = useRef({ x: 0, y: 0 });
  const didDrag     = useRef(false);

  const [dragging, setDragging]         = useState(false);
  const [activeCard, setActiveCard]     = useState(null);
  const [hintVisible, setHintVisible]   = useState(true);
  const [cardsVisible, setCardsVisible] = useState(false);

  /* ── Initial centering ────────────────────────────────────── */
  useEffect(() => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    offsetRef.current = {
      x: vw / 2 - CANVAS_W / 2,
      y: vh / 2 - CANVAS_H / 2,
    };
    applyTransform(false);
    setTimeout(() => setCardsVisible(true), 200);
    const t = setTimeout(() => setHintVisible(false), 4500);
    return () => clearTimeout(t);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const applyTransform = useCallback((smooth = false) => {
    if (!wrapRef.current) return;
    const { x, y } = offsetRef.current;
    wrapRef.current.style.transition = smooth
      ? 'transform 0.55s cubic-bezier(0.17,0.67,0.40,1.00)'
      : 'none';
    wrapRef.current.style.transform = `translate(${x}px, ${y}px)`;
  }, []);

  const clamp = useCallback((val, min, max) => Math.min(Math.max(val, min), max), []);

  const getBounds = useCallback(() => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    return {
      minX: -(CANVAS_W - vw + 100),
      maxX: 100,
      minY: -(CANVAS_H - vh + 100),
      maxY: 100,
    };
  }, []);

  /* ── Pointer events ──────────────────────────────────────── */
  const onPointerDown = useCallback((e) => {
    if (activeCard) return;
    if (e.target.closest('.bottom-nav') || e.target.closest('.overlay-backdrop')) return;
    isDragging.current  = true;
    didDrag.current     = false;
    startRef.current    = { x: e.clientX - offsetRef.current.x, y: e.clientY - offsetRef.current.y };
    lastPos.current     = { x: e.clientX, y: e.clientY };
    velocityRef.current = { x: 0, y: 0 };
    setDragging(true);
  }, [activeCard]);

  const onPointerMove = useCallback((e) => {
    if (!isDragging.current) return;
    const dx = Math.abs(e.clientX - lastPos.current.x);
    const dy = Math.abs(e.clientY - lastPos.current.y);
    if (dx > 3 || dy > 3) didDrag.current = true;
    const bounds = getBounds();
    velocityRef.current = { x: e.clientX - lastPos.current.x, y: e.clientY - lastPos.current.y };
    lastPos.current = { x: e.clientX, y: e.clientY };
    offsetRef.current = {
      x: clamp(e.clientX - startRef.current.x, bounds.minX, bounds.maxX),
      y: clamp(e.clientY - startRef.current.y, bounds.minY, bounds.maxY),
    };
    applyTransform(false);
  }, [applyTransform, clamp, getBounds]);

  const onPointerUp = useCallback(() => {
    if (!isDragging.current) return;
    isDragging.current = false;
    setDragging(false);
    const vx = velocityRef.current.x * 5;
    const vy = velocityRef.current.y * 5;
    const bounds = getBounds();
    offsetRef.current = {
      x: clamp(offsetRef.current.x + vx, bounds.minX, bounds.maxX),
      y: clamp(offsetRef.current.y + vy, bounds.minY, bounds.maxY),
    };
    applyTransform(true);
  }, [applyTransform, clamp, getBounds]);

  /* ── Touch ───────────────────────────────────────────────── */
  const onTouchStart = useCallback((e) => {
    if (activeCard) return;
    if (e.target.closest('.bottom-nav') || e.target.closest('.overlay-backdrop')) return;
    const t = e.touches[0];
    isDragging.current  = true;
    didDrag.current     = false;
    startRef.current    = { x: t.clientX - offsetRef.current.x, y: t.clientY - offsetRef.current.y };
    lastPos.current     = { x: t.clientX, y: t.clientY };
    velocityRef.current = { x: 0, y: 0 };
    setDragging(true);
  }, [activeCard]);

  const onTouchMove = useCallback((e) => {
    if (!isDragging.current) return;
    const t = e.touches[0];
    const dx = Math.abs(t.clientX - lastPos.current.x);
    const dy = Math.abs(t.clientY - lastPos.current.y);
    if (dx > 3 || dy > 3) didDrag.current = true;
    const bounds = getBounds();
    velocityRef.current = { x: t.clientX - lastPos.current.x, y: t.clientY - lastPos.current.y };
    lastPos.current = { x: t.clientX, y: t.clientY };
    offsetRef.current = {
      x: clamp(t.clientX - startRef.current.x, bounds.minX, bounds.maxX),
      y: clamp(t.clientY - startRef.current.y, bounds.minY, bounds.maxY),
    };
    applyTransform(false);
  }, [applyTransform, clamp, getBounds]);

  const onTouchEnd = useCallback(() => {
    isDragging.current = false;
    setDragging(false);
    const vx = velocityRef.current.x * 5;
    const vy = velocityRef.current.y * 5;
    const bounds = getBounds();
    offsetRef.current = {
      x: clamp(offsetRef.current.x + vx, bounds.minX, bounds.maxX),
      y: clamp(offsetRef.current.y + vy, bounds.minY, bounds.maxY),
    };
    applyTransform(true);
  }, [applyTransform, clamp, getBounds]);

  /* ── Card click ──────────────────────────────────────────── */
  const handleCardClick = useCallback((e, card) => {
    e.stopPropagation();
    if (didDrag.current) return;
    setActiveCard(card);
  }, []);

  const handleBottomNav = useCallback((id) => {
    const card = CARDS.find(c => c.id === id);
    if (card) setActiveCard(card);
  }, []);

  return (
    <main
      className={`about-page${dragging ? ' is-dragging' : ''}`}
      onMouseDown={onPointerDown}
      onMouseMove={onPointerMove}
      onMouseUp={onPointerUp}
      onMouseLeave={onPointerUp}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Background particles */}
      <div className="bg-particles" aria-hidden="true">
        {Array.from({ length: 60 }).map((_, i) => (
          <span
            key={i}
            className="bg-dot"
            style={{
              left: `${(i * 37.3) % 100}%`,
              top: `${(i * 53.7) % 100}%`,
              animationDelay: `${(i * 0.3) % 6}s`,
              animationDuration: `${4 + (i % 6)}s`,
            }}
          />
        ))}
      </div>

      {/* Draggable canvas */}
      <div
        ref={wrapRef}
        className="canvas-wrap"
        style={{ width: CANVAS_W, height: CANVAS_H }}
      >
        {CARDS.map((card, i) => {
          const isText  = card.type === 'text';
          const delay   = i * 0.055;

          return isText ? (
            <motion.div
              key={card.id}
              className="about-card text-card"
              style={{
                left: card.x, top: card.y,
                width: card.w, minHeight: card.h,
                '--card-accent': card.accent,
              }}
              initial={{ opacity: 0, scale: 0.85, y: 24 }}
              animate={cardsVisible ? { opacity: 1, scale: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay, ease: [0.34, 1.56, 0.64, 1] }}
              onClick={(e) => handleCardClick(e, card)}
            >
              <span className="card-tag">{card.tag}</span>
              <h3 className="card-title">{card.title}</h3>
              <span className="card-arrow">→</span>
            </motion.div>
          ) : (
            <motion.div
              key={card.id}
              className="about-card image-card"
              style={{
                left: card.x, top: card.y,
                width: card.w, height: card.h,
              }}
              initial={{ opacity: 0, scale: 0.85, y: 24 }}
              animate={cardsVisible ? { opacity: 1, scale: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay, ease: [0.34, 1.56, 0.64, 1] }}
              onClick={(e) => handleCardClick(e, card)}
            >
              <img
                src={card.image}
                alt={card.label}
                className="image-card-bg"
                loading="lazy"
                draggable="false"
              />
              <div className="image-card-overlay" />
              <div className="image-card-content">
                <span className="card-tag">{card.tag}</span>
                <h3 className="card-label">{card.label}</h3>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Drag hint */}
      <AnimatePresence>
        {hintVisible && (
          <motion.div
            className="drag-hint"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 1.2, duration: 0.6 } }}
            exit={{ opacity: 0, transition: { duration: 0.4 } }}
          >
            <svg className="drag-hint-icon" width="22" height="22" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 9l-3 3 3 3"/><path d="M9 5l3-3 3 3"/>
              <path d="M15 19l-3 3-3-3"/><path d="M19 9l3 3-3 3"/>
              <line x1="2" y1="12" x2="22" y2="12"/>
              <line x1="12" y1="2" x2="12" y2="22"/>
            </svg>
            Drag to explore
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom nav */}
      <BottomNav onNavigate={handleBottomNav} />

      {/* Full-screen overlay panel */}
      <AnimatePresence>
        {activeCard && (
          <OverlayPanel card={activeCard} onClose={() => setActiveCard(null)} />
        )}
      </AnimatePresence>
    </main>
  );
}
