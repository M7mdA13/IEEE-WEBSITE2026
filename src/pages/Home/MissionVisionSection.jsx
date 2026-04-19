import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import './MissionVisionSection.css';

const stats = [
  { label: 'Members', value: 200, suffix: '+' },
  { label: 'Events',  value: 20,  suffix: '+'  },
  { label: 'Partners', value: 12, suffix: '+' },
];

const MISSION_PATH = 'M 18,6 L 182,6 Q 196,6 190,20 L 110,162 Q 100,180 90,162 L 10,20 Q 4,6 18,6 Z';
const VISION_PATH = 'M 110,12 L 190,154 Q 196,168 182,168 L 18,168 Q 4,168 10,154 L 90,12 Q 100,-4 110,12 Z';

/* Counts up from 0 → target when scrolled into view.
   After landing, the suffix does a quick bounce. */
const CountUp = ({ target, suffix }) => {
  const [count, setCount] = useState(0);
  const [done, setDone] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  useEffect(() => {
    if (!inView) return;
    const duration = 1400;
    const steps = 40;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        setDone(true);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [inView, target]);

  return (
    <span ref={ref}>
      {count}
      <span className={`mv-suffix ${done ? 'mv-suffix--bounce' : ''}`}>{suffix}</span>
    </span>
  );
};

const MissionVisionSection = () => {
  /* Parallax: section-scoped scroll progress drives the two shapes apart */
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });
  const missionX = useTransform(scrollYProgress, [0, 1], [-150, 0]);
  const visionX  = useTransform(scrollYProgress, [0, 1], [150, 0]);

  /* Disable x-parallax on mobile — stacked layout has no horizontal drift */
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 650px)');
    setIsMobile(mq.matches);
    const handler = (e) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return (
    <section className="mv-section" ref={sectionRef}>
      <motion.div
        className="mv-stats"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className="mv-since">
          <span className="mv-since-label">Since</span>
          <span className="mv-since-year">2011</span>
        </div>

        <div className="mv-stat-row">
          {stats.map((s, i) => (
            <React.Fragment key={s.label}>
              {i > 0 && <div className="mv-divider" />}
              <div className="mv-stat">
                <span className="mv-stat-label">{s.label}</span>
                <span className="mv-stat-value"><CountUp target={s.value} suffix={s.suffix} /></span>
              </div>
            </React.Fragment>
          ))}
        </div>

        <div className="mv-award-banner">
          <span className="mv-award-trophy" aria-label="trophy">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              {/* Cup body */}
              <path d="M8 4h16v12a8 8 0 0 1-16 0V4Z" fill="url(#trophyGold)" stroke="#b8860b" strokeWidth="1"/>
              {/* Handles */}
              <path d="M8 7H5a3 3 0 0 0 0 6h3" stroke="#b8860b" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
              <path d="M24 7h3a3 3 0 0 1 0 6h-3" stroke="#b8860b" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
              {/* Stem */}
              <rect x="13" y="20" width="6" height="5" rx="1" fill="url(#trophyGold)" stroke="#b8860b" strokeWidth="1"/>
              {/* Base */}
              <rect x="10" y="25" width="12" height="3" rx="1.5" fill="url(#trophyGold)" stroke="#b8860b" strokeWidth="1"/>
              {/* Star accent */}
              <path d="M16 8l1.1 2.2 2.4.35-1.75 1.7.41 2.42L16 13.5l-2.16 1.17.41-2.42L12.5 10.55l2.4-.35L16 8Z" fill="#fff8" stroke="none"/>
              <defs>
                <linearGradient id="trophyGold" x1="8" y1="4" x2="24" y2="28" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#ffd700"/>
                  <stop offset="50%" stopColor="#ffc107"/>
                  <stop offset="100%" stopColor="#e6a000"/>
                </linearGradient>
              </defs>
            </svg>
          </span>
          <div className="mv-award-text">
            <span className="mv-award-title">2025 IEEE Exemplary Branch Award</span>
            <span className="mv-award-sub">Recognized among Egypt's finest IEEE student branches</span>
          </div>
          <span className="mv-award-shine" aria-hidden="true" />
        </div>
      </motion.div>

      <div className="mv-wrapper">

        {/* ── Mission ── */}
        <motion.div
          className="mv-tri mv-tri--mission"
          style={{ x: isMobile ? 0 : missionX }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.75, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <svg viewBox="0 0 200 174" preserveAspectRatio="none" className="mv-tri__svg">
            <path d={MISSION_PATH} className="mv-tri__fill--mission" strokeLinejoin="round" />
          </svg>

          <div className="mv-tri__content mv-tri__content--mission">
            <h2 className="mv-tri__heading mv-tri__heading--light">Our Mission</h2>
            {/* Desktop body — hidden on mobile via CSS */}
            <p className="mv-tri__body mv-tri__body--light mv-tri__body--desktop">
              To foster a supportive, connected community that bridges the gap between students and industry through hands-on workshops, meaningful events, and real opportunities that empower every member to grow, belong, and lead.
            </p>
            {/* Mobile body — flows with downward-pointing triangle (wide top, narrow bottom) */}
            <p className="mv-tri__body mv-tri__body--light mv-tri__body--mobile">
              To foster a supportive, connected community<br/>
              that bridges the gap between students<br/>
              and industry through hands-on<br/>
              workshops, meaningful events,<br/>
              and real opportunities<br/>
              that empower every<br/>
              member to grow,<br/>
              belong, and<br/>
              lead.
            </p>
          </div>

          <img src="/images/7fd33e2444354311f749a713ec1cfeddc607bd3f.png" alt="Target" className="mv-tri__icon mv-tri__icon--mission" />
        </motion.div>

        {/* ── Vision ── */}
        <motion.div
          className="mv-tri mv-tri--vision"
          style={{ x: isMobile ? 0 : visionX }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.75, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <svg viewBox="0 0 200 174" preserveAspectRatio="none" className="mv-tri__svg">
            <path d={VISION_PATH} className="mv-tri__fill--vision" vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
          </svg>

          <img src="/images/Icon.png" alt="Eye" className="mv-tri__icon mv-tri__icon--vision" />

          <div className="mv-tri__content mv-tri__content--vision">
            <h2 className="mv-tri__heading mv-tri__heading--dark">Our Vision</h2>
            {/* Desktop body — hidden on mobile via CSS */}
            <p className="mv-tri__body mv-tri__body--dark mv-tri__body--desktop">
              A thriving, connected IEEE community where members feel valued, inspired to innovate, and empowered to lead the future of technology.
            </p>
            {/* Mobile body — flows with upward-pointing triangle (narrow top, wide bottom) */}
            <p className="mv-tri__body mv-tri__body--dark mv-tri__body--mobile">
              A<br/>
              thriving,<br/>
              connected IEEE<br/>
              community where members<br/>
              feel valued, inspired to innovate,<br/>
              and empowered to lead the future<br/>
              of technology.
            </p>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default MissionVisionSection;
