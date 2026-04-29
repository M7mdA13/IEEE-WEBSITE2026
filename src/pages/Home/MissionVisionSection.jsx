import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import './MissionVisionSection.css';

const stats = [
  { label: 'Members',  value: 200, suffix: '+' },
  { label: 'Events',   value: 20,  suffix: '+' },
  { label: 'Partners', value: 12,  suffix: '+' },
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

/* ── Roman Wreath Generator ── 
   Calculates a quadratic bezier curve for the stem and mathematically places 
   inner/outer leaves along the tangent of the curve for a realistic wrap. */
const WreathBranch = ({ isRight }) => {
  const leaves = [];
  const numPairs = 13; 
  // P0 = Bottom crossing point, P1 = Wide belly curve, P2 = Top tip
  const P0 = { x: 215, y: 205 }; 
  const P1 = { x: 15, y: 160 };  
  const P2 = { x: 85, y: 25 };   
  
  for (let i = 1; i <= numPairs; i++) {
    const t = i / (numPairs + 1); 
    
    // Position along the curve
    const x = Math.pow(1-t, 2) * P0.x + 2 * (1-t) * t * P1.x + Math.pow(t, 2) * P2.x;
    const y = Math.pow(1-t, 2) * P0.y + 2 * (1-t) * t * P1.y + Math.pow(t, 2) * P2.y;
    
    // Derivative (Tangent) to find the angle of the curve at this point
    const dx = 2 * (1-t) * (P1.x - P0.x) + 2 * t * (P2.x - P1.x);
    const dy = 2 * (1-t) * (P1.y - P0.y) + 2 * t * (P2.y - P1.y);
    const angle = Math.atan2(dy, dx) * (180 / Math.PI);
    
    // Leaf vector
    const leafPath = "M 0 0 C 12 -14 26 -10 32 0 C 26 10 12 14 0 0 Z";
    const scale = 0.55 + (0.45 * (1 - t)); // Leaves shrink slightly as they reach the top
    
    // Outer and Inner leaves rotated away from the tangent
    leaves.push(
      <g key={`outer-${i}`} transform={`translate(${x}, ${y}) rotate(${angle - 35}) scale(${scale})`}>
        <path d={leafPath} fill="#FFC107" />
      </g>
    );
    leaves.push(
      <g key={`inner-${i}`} transform={`translate(${x}, ${y}) rotate(${angle + 35}) scale(${scale})`}>
        <path d={leafPath} fill="#FFC107" />
      </g>
    );
  }
  
  // Single terminal leaf at the top tip
  const topAngle = Math.atan2( 2 * (P2.y - P1.y), 2 * (P2.x - P1.x) ) * (180 / Math.PI);
  leaves.push(
     <g key="top" transform={`translate(${P2.x}, ${P2.y}) rotate(${topAngle}) scale(0.6)`}>
        <path d="M 0 0 C 12 -14 26 -10 32 0 C 26 10 12 14 0 0 Z" fill="#FFC107" />
     </g>
  );

  const stemPath = `M ${P0.x} ${P0.y} Q ${P1.x} ${P1.y} ${P2.x} ${P2.y}`;

  // Assemble the branch
  const content = (
    <>
      <path d={stemPath} fill="none" stroke="#FFC107" strokeWidth="3.5" strokeLinecap="round" />
      {leaves}
    </>
  );

  // If right branch, flip horizontally around the center
  return isRight ? (
    <g transform="translate(400, 0) scale(-1, 1)">{content}</g>
  ) : (
    <g>{content}</g>
  );
};

const MissionVisionSection = () => {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const missionXDesktop = useTransform(scrollYProgress, [0, 1], [-150, 0]);
  const visionXDesktop  = useTransform(scrollYProgress, [0, 1], [150,  0]);
  const missionXMobile  = useTransform(scrollYProgress, [0, 0.62, 1],  [-150, 0, 150]);
  const visionXMobile   = useTransform(scrollYProgress, [0, 0.62, 1],  [150, 0, -150]);

  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia('(max-width: 650px)').matches
  );

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 650px)');
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
          <svg className="mv-award-wreath-svg" viewBox="0 0 400 220" fill="none" aria-hidden="true">
            <WreathBranch isRight={false} />
            <WreathBranch isRight={true} />
          </svg>

          <div className="mv-award-text">
            <span className="mv-award-title">2025 IEEE Exemplary Branch Award</span>
            <span className="mv-award-sub">Recognized among Egypt's finest IEEE student branches</span>
          </div>
        </div>
      </motion.div>

      <div className="mv-wrapper">
        {/* ── Mission ── */}
        <motion.div
          className="mv-tri mv-tri--mission"
          style={{ x: isMobile ? missionXMobile : missionXDesktop }}
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
            <p className="mv-tri__body mv-tri__body--light mv-tri__body--desktop">
              To foster a supportive, connected community that bridges the gap between students and industry through hands-on workshops, meaningful events, and real opportunities that empower every member to grow, belong, and lead.
            </p>
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
          style={{ x: isMobile ? visionXMobile : visionXDesktop }}
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
            <p className="mv-tri__body mv-tri__body--dark mv-tri__body--desktop">
              A thriving, connected IEEE community where members feel valued, inspired to innovate, and empowered to lead the future of technology.
            </p>
            <p className="mv-tri__body mv-tri__body--dark mv-tri__body--mobile">
              A Thriving,<br/>
              connected IEEE<br/>
              community where members<br/>
              feel valued, inspired to innovate and<br/>
              empowered to lead the future of technology.<br/>
            </p>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default MissionVisionSection;