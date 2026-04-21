import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import './MissionVisionSection.css';

const stats = [
  { label: 'Members',  value: 100, suffix: '+' },
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

const MissionVisionSection = () => {
  /* Parallax: section-scoped scroll progress drives the two shapes apart */
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });
  /* Desktop: meet at scroll midpoint (0.5). Mobile stacked layout: meet later (~0.62)
     so both triangles are actually in frame when they align. */
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
          <span className="mv-award-shine" aria-hidden="true" />

          {/* Left wreath branch */}
          <span className="mv-award-branch" aria-hidden="true">
            <svg width="48" height="140" viewBox="0 0 48 140" fill="none">
              {[
                { cx: 30, cy: 130, rot:  55, rx: 11, ry: 4.2 },
                { cx: 20, cy: 115, rot:  40, rx: 11, ry: 4.2 },
                { cx: 12, cy: 100, rot:  24, rx: 11, ry: 4.2 },
                { cx:  8, cy:  84, rot:   8, rx: 11, ry: 4.2 },
                { cx:  8, cy:  68, rot:  -8, rx: 11, ry: 4.2 },
                { cx: 12, cy:  52, rot: -24, rx: 11, ry: 4.2 },
                { cx: 19, cy:  37, rot: -40, rx: 11, ry: 4.2 },
                { cx: 29, cy:  23, rot: -54, rx: 11, ry: 4.2 },
                { cx: 38, cy:  10, rx: 10, ry: 3.8, rot: -65 },
              ].map(({ cx, cy, rot, rx, ry }, i) => (
                <ellipse key={i} cx={cx} cy={cy} rx={rx} ry={ry}
                  transform={`rotate(${rot} ${cx} ${cy})`}
                  fill="#FFC107" opacity={0.97 - i * 0.055} />
              ))}
              <path d="M26 135 C18 112, 10 88, 9 66 C8 44, 15 24, 38 8"
                stroke="#E6A000" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.45"/>
              <path d="M14 135 Q26 142 38 135" stroke="#FFC107" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.75"/>
            </svg>
          </span>

          {/* Text in the centre of the wreath */}
          <div className="mv-award-text">
            <span className="mv-award-title">2025 IEEE Exemplary Branch Award</span>
            <span className="mv-award-sub">Recognized among Egypt's finest IEEE student branches</span>
          </div>

          {/* Right wreath branch — CSS mirror of left */}
          <span className="mv-award-branch mv-award-branch--right" aria-hidden="true">
            <svg width="48" height="140" viewBox="0 0 48 140" fill="none">
              {[
                { cx: 30, cy: 130, rot:  55, rx: 11, ry: 4.2 },
                { cx: 20, cy: 115, rot:  40, rx: 11, ry: 4.2 },
                { cx: 12, cy: 100, rot:  24, rx: 11, ry: 4.2 },
                { cx:  8, cy:  84, rot:   8, rx: 11, ry: 4.2 },
                { cx:  8, cy:  68, rot:  -8, rx: 11, ry: 4.2 },
                { cx: 12, cy:  52, rot: -24, rx: 11, ry: 4.2 },
                { cx: 19, cy:  37, rot: -40, rx: 11, ry: 4.2 },
                { cx: 29, cy:  23, rot: -54, rx: 11, ry: 4.2 },
                { cx: 38, cy:  10, rx: 10, ry: 3.8, rot: -65 },
              ].map(({ cx, cy, rot, rx, ry }, i) => (
                <ellipse key={i} cx={cx} cy={cy} rx={rx} ry={ry}
                  transform={`rotate(${rot} ${cx} ${cy})`}
                  fill="#FFC107" opacity={0.97 - i * 0.055} />
              ))}
              <path d="M26 135 C18 112, 10 88, 9 66 C8 44, 15 24, 38 8"
                stroke="#E6A000" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.45"/>
              <path d="M14 135 Q26 142 38 135" stroke="#FFC107" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.75"/>
            </svg>
          </span>
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
            {/* Desktop body — hidden on mobile via CSS */}
            <p className="mv-tri__body mv-tri__body--dark mv-tri__body--desktop">
              A thriving, connected IEEE community where members feel valued, inspired to innovate, and empowered to lead the future of technology.
            </p>
            {/* Mobile body — shorter lines near the peak, wider toward the base */}
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
