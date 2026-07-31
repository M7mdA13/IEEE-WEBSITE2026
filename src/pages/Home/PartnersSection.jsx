import React, { useState, useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import api from '../../api/public';
import './PartnersSection.css';
import { cloudinaryUrl } from '../../utils/cloudinary';
import { normalizeUrl } from '../../utils/url';

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
].map(logo => ({ logo, name: '', website: '' }));

const SPEED_PX_S = 60; // pixels per second

const PartnersSection = () => {
  const [partners, setPartners] = useState(staticLogos);
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
        const list = (data.data || [])
          .filter(p => p.logo)
          .map(p => ({
            logo: p.logo,
            name: p.name || '',
            // Bare domains ("ieee.org") would otherwise navigate inside the site
            website: normalizeUrl(p.website),
          }));
        if (list.length > 0) setPartners(list);
      })
      .catch(() => {})
      .finally(() => setDataReady(true));
  }, []);

  /* doubled array for seamless loop */
  const doubled = useMemo(() => [...partners, ...partners], [partners]);

  /* Measure the half-width after layout (= width of one copy of logos) */
  useLayoutEffect(() => {
    const measure = () => {
      if (trackRef.current) halfRef.current = trackRef.current.scrollWidth / 2;
    };
    measure();
    // Re-measure if window is resized (logo sizes may reflow)
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [partners]);

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

  /* A touch on a logo is both "pause and look" and "open the partner site".
     Only a quick, stationary tap counts as a click — a long press or a drag
     leaves the visitor where they are. */
  const touchRef = useRef({ t: 0, x: 0, y: 0, moved: false });

  const handleTouchStart = (i) => (e) => {
    const touch = e.touches[0];
    touchRef.current = { t: e.timeStamp, x: touch.clientX, y: touch.clientY, moved: false };
    pause(i);
  };

  const handleTouchMove = (e) => {
    const touch = e.touches[0];
    const { x, y } = touchRef.current;
    if (Math.abs(touch.clientX - x) > 10 || Math.abs(touch.clientY - y) > 10) {
      touchRef.current.moved = true;
    }
  };

  const handleTouchEnd = (e) => {
    const { t, moved } = touchRef.current;
    touchRef.current.suppressClick = moved || (e.timeStamp - t) > 450;
    // The click (if any) lands right after touchend — clear the flag afterwards
    // so it can never leak into a later mouse click on a hybrid device.
    setTimeout(() => { touchRef.current.suppressClick = false; }, 400);
    resume();
  };

  const handleLinkClick = (e) => {
    if (touchRef.current.suppressClick) {
      touchRef.current.suppressClick = false;
      e.preventDefault();
    }
  };

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
          {doubled.map((partner, i) => {
            // Second half of the doubled array is the seamless-loop clone:
            // hide it from screen readers and keyboard tabbing.
            const isClone = i >= partners.length;
            const linked  = Boolean(partner.website);

            const slotProps = {
              className: `partner-logo-slot${activeIdx === i ? ' partner-logo-slot--active' : ''}${linked ? ' partner-logo-slot--link' : ''}`,
              onMouseEnter: supportsHover.current ? () => pause(i) : undefined,
              onMouseLeave: supportsHover.current ? resume         : undefined,
              onTouchStart: handleTouchStart(i),
              onTouchMove:  handleTouchMove,
              onTouchEnd:   handleTouchEnd,
              onContextMenu: (e) => e.preventDefault(),
            };

            const logo = (
              <img
                src={cloudinaryUrl(partner.logo, 240)}
                alt={partner.name ? `${partner.name} logo` : 'partner logo'}
                draggable={false}
              />
            );

            if (!linked) return <div key={i} {...slotProps}>{logo}</div>;

            return (
              <a
                key={i}
                {...slotProps}
                href={partner.website}
                target="_blank"
                rel="noopener noreferrer"
                title={partner.name ? `Visit ${partner.name}` : 'Visit partner website'}
                aria-label={partner.name ? `Visit ${partner.name} (opens in a new tab)` : 'Visit partner website (opens in a new tab)'}
                aria-hidden={isClone || undefined}
                tabIndex={isClone ? -1 : undefined}
                onClick={handleLinkClick}
                onFocus={() => pause(i)}
                onBlur={resume}
              >
                {logo}
                <span className="partner-logo-visit" aria-hidden="true">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                </span>
              </a>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
};

export default PartnersSection;
