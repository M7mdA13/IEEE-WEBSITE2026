import React, { useState, useEffect, useLayoutEffect, useMemo, useRef } from 'react';
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

const SPEED_PX_S = 60; // pixels per second

const PartnersSection = () => {
  const [logos, setLogos]       = useState(staticLogos);
  const [activeIdx, setActiveIdx] = useState(null);
  const [dataReady, setDataReady] = useState(false);

  // RAF state — stored in refs so the animation loop never needs re-registration
  const trackRef    = useRef(null);
  const xRef        = useRef(0);        // current translateX in pixels
  const pausedRef   = useRef(false);    // true while a finger/pointer is held
  const halfRef     = useRef(0);        // scrollWidth / 2 (width of one copy)
  const rafRef      = useRef(null);

  // (hover:hover) = real pointer device. Touch-only phones return false.
  // We never attach mouse handlers on those, eliminating the synthetic-mouseenter
  // race that caused the wrong logo to select on first tap.
  const supportsHover = useRef(
    typeof window !== 'undefined' && window.matchMedia('(hover: hover)').matches
  );

  /* ── API fetch ── */
  useEffect(() => {
    api.get('/partners')
      .then(({ data }) => {
        const imgs = (data.data || []).map(p => p.logo).filter(Boolean);
        if (imgs.length > 0) setLogos(imgs);
      })
      .catch(() => {})
      .finally(() => setDataReady(true));
  }, []);

  /* doubled array for seamless loop */
  const doubled = useMemo(() => [...logos, ...logos], [logos]);

  /* Measure the half-width after layout (= width of one copy of logos) */
  useLayoutEffect(() => {
    const measure = () => {
      if (trackRef.current) halfRef.current = trackRef.current.scrollWidth / 2;
    };
    measure();
    // Re-measure if window is resized (logo sizes may reflow)
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [logos]);

  /* RAF animation loop — never uses CSS animation-play-state (avoids iOS Safari snap) */
  useEffect(() => {
    let lastTs = null;

    const step = (ts) => {
      if (lastTs !== null && !pausedRef.current && halfRef.current > 0 && trackRef.current) {
        xRef.current -= SPEED_PX_S * (ts - lastTs) / 1000;
        // Seamless reset: once we've scrolled one full copy, jump back by exactly
        // that amount — the doubled track makes this invisible.
        if (xRef.current <= -halfRef.current) xRef.current += halfRef.current;
        trackRef.current.style.transform = `translateX(${xRef.current}px)`;
      }
      lastTs = ts;
      rafRef.current = requestAnimationFrame(step);
    };

    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  /* Interaction handlers */
  const pause  = (i) => { pausedRef.current = true;  setActiveIdx(i); };
  const resume = ()  => { pausedRef.current = false; setActiveIdx(null); };

  return (
    <section
      className="partners-section"
      style={{ opacity: dataReady ? 1 : 0, transition: 'opacity 0.4s ease' }}
    >
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
        {/* Track: RAF drives translateX directly — no CSS animation, no play-state snap */}
        <div ref={trackRef} className="partners-marquee-track">
          {doubled.map((src, i) => (
            <div
              key={i}
              className={`partner-logo-slot ${activeIdx === i ? 'partner-logo-slot--active' : ''}`}
              onMouseEnter={supportsHover.current ? () => pause(i)  : undefined}
              onMouseLeave={supportsHover.current ? resume          : undefined}
              onTouchStart={() => pause(i)}
              onTouchEnd={resume}
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
