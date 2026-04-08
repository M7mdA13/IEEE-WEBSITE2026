import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './PartnersSection.css';

const logos = [
  '/images/partner 1.png',
  '/images/partner 2.png',
  '/images/partner 3.png',
  '/images/partner 4.png',
  '/images/partner 5.webp',
  '/images/partner 6.png',
  '/images/partner 7.png',
  '/images/partner 8.png',
  '/images/partner 9.png',
  '/images/logo1.png',
  '/images/logo2.png',
  '/images/logo3.png',
  '/images/logo4.png',
  '/images/logo5.png',
];

const PartnersSection = () => {
  /* Track which logo slot is hovered so we can pause the marquee */
  const [pausedIdx, setPausedIdx] = useState(null);
  const isPaused = pausedIdx !== null;

  return (
    <section className="partners-section">
      <motion.div
        className="partners-header"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.55, ease: 'easeOut' }}
      >
        <h2 className="partners-title">Our Partners</h2>
        <p className="partners-subtitle">
          Organizations that share our commitment to advancing technology and education.
        </p>
      </motion.div>

      <motion.div
        className="partners-marquee-wrapper"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div
          className="partners-marquee-track"
          style={{ animationPlayState: isPaused ? 'paused' : 'running' }}
        >
          {[...logos, ...logos].map((src, i) => {
            const isHovered = pausedIdx === i;
            return (
              <div
                key={i}
                className={`partner-logo-slot ${isHovered ? 'partner-logo-slot--active' : ''}`}
                onMouseEnter={() => setPausedIdx(i)}
                onMouseLeave={() => setPausedIdx(null)}
              >
                <img src={src} alt="partner logo" draggable={false} />
              </div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
};

export default PartnersSection;
