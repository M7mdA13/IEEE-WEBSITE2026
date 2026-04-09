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
  const missionX = useTransform(scrollYProgress, [0, 1], [-80, 80]);
  const visionX  = useTransform(scrollYProgress, [0, 1], [80, -80]);

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
      </motion.div>

      <div className="mv-wrapper">

        <motion.div
          className="mv-tri mv-tri--mission"
          style={{ x: missionX }}
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.75, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <svg viewBox="0 0 200 174" preserveAspectRatio="none" className="mv-tri__svg">
            <path d={MISSION_PATH} className="mv-tri__fill--mission" />
          </svg>

          <div className="mv-tri__content mv-tri__content--mission">
            <h2 className="mv-tri__heading mv-tri__heading--light">Our Mission</h2>
            <p className="mv-tri__body mv-tri__body--light">
              We exist to advance technology for the benefit of humanity. That means giving students access to real knowledge, real networks, and real opportunities — through technical workshops, mentorship programs, and a culture of continuous learning across every discipline.
            </p>
          </div>

          <img src="/images/7fd33e2444354311f749a713ec1cfeddc607bd3f.png" alt="Target" className="mv-tri__icon mv-tri__icon--mission" />
        </motion.div>

        <motion.div
          className="mv-tri mv-tri--vision"
          style={{ x: visionX }}
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.75, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.15 }}
        >
          <svg viewBox="0 0 200 174" preserveAspectRatio="none" className="mv-tri__svg">
            <path d={VISION_PATH} className="mv-tri__fill--vision" vectorEffect="non-scaling-stroke" />
          </svg>

          <img src="/images/Icon.png" alt="Eye" className="mv-tri__icon mv-tri__icon--vision" />

          <div className="mv-tri__content mv-tri__content--vision">
            <h2 className="mv-tri__heading mv-tri__heading--dark">Our Vision</h2>
            <p className="mv-tri__body mv-tri__body--dark">
              Lorem ipsum dolor sit amet, consectetur
              adipiscing elit. Duis volutpat eu libero cursus
              sollicitudin. Proin at magna eu enim tempor
              vestibulum eget ac nunc. Morbi a finibus enim.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default MissionVisionSection;
