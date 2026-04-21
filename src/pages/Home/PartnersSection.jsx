import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import api from '../../api/public';
import './PartnersSection.css';
import { cloudinaryUrl } from '../../utils/cloudinary';

const staticLogos = [
  '/images/partner 1.webp',
  '/images/partner 2.png',
  '/images/partner 3.png',
  '/images/partner 4.png',
  '/images/partner 5.webp',
  '/images/partner 6.png',
  '/images/partner 7.webp',
  '/images/partner 8.webp',
  '/images/partner 9.png',
  '/images/logo1.png',
  '/images/logo2.png',
  '/images/logo3.png',
  '/images/logo4.png',
  '/images/logo5.png',
];

const PartnersSection = () => {
  const [logos, setLogos] = useState(staticLogos);
  const [activeIdx, setActiveIdx] = useState(null);
  const [dataReady, setDataReady] = useState(false);
  // Suppress synthetic mouse events mobile browsers fire after a tap (to prevent
  // the rapid null→idx→null toggle that causes the marquee to flicker/jump).
  const lastTouchRef = useRef(0);

  useEffect(() => {
    api.get('/partners')
      .then(({ data }) => {
        const imgs = (data.data || []).map(p => p.logo).filter(Boolean);
        if (imgs.length > 0) {
          setActiveIdx(null);
          setLogos(imgs);
        }
      })
      .catch(() => {})
      .finally(() => setDataReady(true));
  }, []);

  const doubled = useMemo(() => [...logos, ...logos], [logos]);

  const handleMouseEnter = (i) => {
    if (Date.now() - lastTouchRef.current < 500) return;
    setActiveIdx(i);
  };
  const handleMouseLeave = () => {
    if (Date.now() - lastTouchRef.current < 500) return;
    setActiveIdx(null);
  };
  const handleTouchStart = (i) => {
    lastTouchRef.current = Date.now();
    setActiveIdx(i);
  };
  const handleTouchEnd = () => {
    setActiveIdx(null);
  };

  return (
    <section className="partners-section" style={{ opacity: dataReady ? 1 : 0, transition: 'opacity 0.4s ease' }}>
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
          style={{ animationPlayState: activeIdx !== null ? 'paused' : 'running' }}
        >
          {doubled.map((src, i) => (
            <div
              key={i}
              className={`partner-logo-slot ${activeIdx === i ? 'partner-logo-slot--active' : ''}`}
              onMouseEnter={() => handleMouseEnter(i)}
              onMouseLeave={handleMouseLeave}
              onTouchStart={() => handleTouchStart(i)}
              onTouchEnd={handleTouchEnd}
              onContextMenu={(e) => e.preventDefault()}
            >
              <img src={cloudinaryUrl(src, 240)} alt="partner logo" draggable={false} />
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default PartnersSection;
