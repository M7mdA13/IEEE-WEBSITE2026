import { useState, useEffect, useRef, useLayoutEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './PhotoCatalogueSection.css';
import api from '../../api/public';

const DEFAULT_PHOTOS = [
  { src: '/images/group pic 1.jpg', alt: 'IEEE MUST SB event' },
  { src: '/images/group pic 2.jpg', alt: 'IEEE MUST SB team' },
  { src: '/images/group pic 3.jpg', alt: 'IEEE MUST SB activity' },
];

/* ══════════════════════════════════════
   Lightbox
══════════════════════════════════════ */
const Lightbox = ({ photos, index, onClose, onNav }) => {
  const photo = photos[index];
  useEffect(() => {
    const h = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onNav(-1);
      if (e.key === 'ArrowRight') onNav(1);
    };
    window.addEventListener('keydown', h);
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', h); document.body.style.overflow = ''; };
  }, [onClose, onNav]);

  return (
    <motion.div className="gallery-lightbox" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <button className="lightbox-close" onClick={onClose} aria-label="Close">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
      <button className="lightbox-arrow lightbox-arrow--left" onClick={(e) => { e.stopPropagation(); onNav(-1); }}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
      </button>
      <AnimatePresence mode="wait">
        <motion.img key={photo?.src} src={photo?.src} alt={photo?.alt} className="lightbox-img"
          initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.92 }}
          transition={{ duration: 0.2 }} onClick={(e) => e.stopPropagation()} draggable={false} />
      </AnimatePresence>
      <button className="lightbox-arrow lightbox-arrow--right" onClick={(e) => { e.stopPropagation(); onNav(1); }}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
      </button>
      <div className="lightbox-counter">{index + 1} / {photos.length}</div>
    </motion.div>
  );
};

/* ══════════════════════════════════════
   Wave SVG (matches reference exactly)
══════════════════════════════════════ */
const WaveSVG = ({ flip = false }) => (
  <div className={`cat-wave ${flip ? 'cat-wave--bottom' : ''}`} aria-hidden="true">
    <svg viewBox="0 0 804 50.167" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
      <path className="cat-wave-path" d="M804,0v16.671c0,0-204.974,33.496-401.995,33.496C204.974,50.167,0,16.671,0,16.671V0H804z"/>
    </svg>
  </div>
);

/* ══════════════════════════════════════
   Control Button (circle with fill-on-hover)
══════════════════════════════════════ */
const ControlBtn = ({ onClick, flipped = false, label }) => (
  <button className="cat-control" onClick={onClick} aria-label={label}>
    <span className="cat-control__fill" />
    <svg viewBox="0 0 24 18" className={`cat-control__arrow ${flipped ? 'cat-control__arrow--flip' : ''}`}>
      <path fill="currentColor" d="M23.999,8H5.481c5.009-2.91,6.349-7.311,6.416-7.548L9.976-0.102C9.9,0.156,8.03,6.213-0.073,8.024L0.146,9l-0.218,0.976C8.03,11.787,9.9,17.844,9.976,18.101l1.922-0.554C11.83,17.31,10.49,12.91,5.481,10h18.518V8z"/>
    </svg>
  </button>
);

/* ══════════════════════════════════════
   Main Component
══════════════════════════════════════ */
const PhotoCatalogueSection = () => {
  const [photos, setPhotos]       = useState(DEFAULT_PHOTOS);
  const [dataReady, setDataReady] = useState(false);
  const [lightboxIdx, setLightboxIdx] = useState(null);

  /*
   * internalIdx tracks position inside the TRIPLED array:
   *   [clone-set-A (0..N-1)] [original (N..2N-1)] [clone-set-B (2N..3N-1)]
   * We start at N (first original). After each navigation, if index drifts
   * outside [N, 2N-1], onAnimationComplete silently resets it (loop trick).
   */
  const [internalIdx, setInternalIdx] = useState(0); // will be set once photos load
  const [slideWidthPx, setSlideWidthPx] = useState(0);
  const [perView, setPerView]       = useState(3);   // 3 on desktop, 1 on mobile
  const isAnimating    = useRef(false);
  const internalIdxRef = useRef(0);   // mirrors internalIdx for sync reads
  const skipNextAnim   = useRef(false); // true during the invisible clone-reset jump
  const dragStartX  = useRef(null);
  const dragDelta   = useRef(0);
  const wrapRef     = useRef(null);

  const total = photos.length;

  /* Triple the photos for infinite loop */
  const allSlides = useMemo(() => [...photos, ...photos, ...photos], [photos]);

  /* Initial internal index = start of middle clone set */
  useEffect(() => {
    setInternalIdx(total);
    internalIdxRef.current = total;
  }, [total]);

  /* Measure slide width */
  useLayoutEffect(() => {
    const measure = () => {
      if (!wrapRef.current) return;
      const pv = window.innerWidth <= 767 ? 1 : 3;
      setPerView(pv);
      setSlideWidthPx(wrapRef.current.offsetWidth / pv);
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  /* Fetch photos from API */
  useEffect(() => {
    api.get('/gallery')
      .then(({ data }) => {
        if (data.data && data.data.length >= 3) {
          setPhotos(data.data);
        }
      })
      .catch(() => {})
      .finally(() => setDataReady(true));
  }, []);

  /* Navigate — no isAnimating guard so arrow buttons always respond.
     Framer Motion interrupts the in-flight animation cleanly. */
  const navigate = useCallback((dir) => {
    setInternalIdx(p => {
      const next = p + dir;
      internalIdxRef.current = next;
      return next;
    });
  }, []);

  /* After animation: if we've drifted into a clone set, silently reset to the
     middle set. We use skipNextAnim so Framer Motion jumps with duration:0
     (invisible), then re-enables normal transitions. */
  const onAnimationComplete = useCallback(() => {
    const p = internalIdxRef.current;
    if (p < total || p >= total * 2) {
      const resetTo = p < total ? p + total : p - total;
      skipNextAnim.current = true;  // next render → duration: 0
      internalIdxRef.current = resetTo;
      setInternalIdx(resetTo);
      // isAnimating stays true until the instant-jump's onAnimationComplete fires
    } else {
      isAnimating.current = false;
    }
  }, [total]);

  const onAnimationStart = useCallback(() => {
    isAnimating.current = true;
    // ref is already current — it was updated by navigate/goTo before this fires
  }, []);

  /* Touch / drag */
  const handlePointerDown = (e) => {
    if (e.button !== 0) return;
    dragStartX.current = e.clientX;
    dragDelta.current = 0;
  };
  const handlePointerMove = (e) => {
    if (dragStartX.current === null) return;
    dragDelta.current = e.clientX - dragStartX.current;
  };
  const handlePointerUp = () => {
    if (dragStartX.current === null) return;
    if (Math.abs(dragDelta.current) > 60) navigate(dragDelta.current < 0 ? 1 : -1);
    dragStartX.current = null;
    dragDelta.current = 0;
  };

  const handleTouchStart = (e) => {
    dragStartX.current = e.touches[0].clientX;
    dragDelta.current = 0;
  };
  const handleTouchMove = (e) => {
    dragDelta.current = e.touches[0].clientX - dragStartX.current;
  };
  const handleTouchEnd = () => {
    if (Math.abs(dragDelta.current) > 50) navigate(dragDelta.current < 0 ? 1 : -1);
    dragStartX.current = null;
    dragDelta.current = 0;
  };

  /* Lightbox */
  const openLightbox = (idx) => { if (Math.abs(dragDelta.current) <= 10) setLightboxIdx(idx); };
  const closeLightbox = useCallback(() => setLightboxIdx(null), []);
  const navigateLightbox = useCallback((dir) => setLightboxIdx(p => (p + dir + total) % total), [total]);

  /*
   * translateX math:
   * - Each slide is slideWidthPx wide
   * - To CENTER slide at index `internalIdx` in the viewport:
   *   left edge of slide = internalIdx * slideWidthPx (from track start)
   *   we want it at (perView===1 ? 0 : slideWidthPx) from viewport left
   *   => trackX = -(internalIdx * slideWidthPx) + (perView===3 ? slideWidthPx : 0)
   */
  const centerOffset = perView === 3 ? slideWidthPx : 0;
  const trackX = slideWidthPx ? -(internalIdx * slideWidthPx) + centerOffset : 0;

  /* Active photo index in original array */
  const activeOriginalIdx = ((internalIdx % total) + total) % total;

  /* Dot navigation — jump to a specific original slide */
  const goTo = (origIdx) => {
    const targetInternal = total + origIdx;
    internalIdxRef.current = targetInternal;
    setInternalIdx(targetInternal);
  };

  return (
    <section className="cat-section" style={{ opacity: dataReady ? 1 : 0, transition: 'opacity 0.4s ease' }}>

      {/* ── Header ── */}
      <motion.div className="cat-header"
        initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.55, ease: 'easeOut' }}
      >
        <h2 className="cat-title">Life at IEEE MUST SB</h2>
        <p className="cat-subtitle">Moments captured across events, workshops, and everything in between.</p>
      </motion.div>

      {/* ── Slider Band ── */}
      <div className="cat-band">
        <WaveSVG />

        {/* Track wrapper — overflow VISIBLE so side slides bleed out */}
        <div
          ref={wrapRef}
          className="cat-track-wrap"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <motion.div
            className="cat-track"
            animate={{ x: trackX }}
            transition={skipNextAnim.current
              ? { duration: 0 }
              : { duration: 0.55, ease: [0.32, 0.72, 0, 1] }}
            onAnimationStart={onAnimationStart}
            onAnimationComplete={() => {
              if (skipNextAnim.current) {
                // Instant-reset just completed — re-enable normal transitions
                skipNextAnim.current = false;
                isAnimating.current = false;
              } else {
                onAnimationComplete();
              }
            }}
          >
            {allSlides.map((photo, i) => {
              const isActive = i === internalIdx;
              const origIdx  = i % total;
              return (
                <div
                  key={`${origIdx}-${Math.floor(i / total)}`}
                  className={`cat-slide ${isActive ? 'cat-slide--active' : ''}`}
                  style={{ width: slideWidthPx ? `${slideWidthPx}px` : `${100 / perView}%` }}
                  onClick={() => isActive ? openLightbox(origIdx) : navigate(i > internalIdx ? 1 : -1)}
                >
                  <img src={photo.src} alt={photo.alt} className="cat-slide-img" draggable={false} />
                  {!isActive && <div className="cat-slide-dim" />}
                </div>
              );
            })}
          </motion.div>
        </div>

        <WaveSVG flip />

        {/* Circle arrow controls */}
        <div className="cat-controls">
          <ControlBtn onClick={() => navigate(-1)} label="Previous photo" />
          <ControlBtn onClick={() => navigate(1)} flipped label="Next photo" />
        </div>
      </div>

      {/* ── Dot indicators ── */}
      <div className="cat-dots">
        {photos.map((_, i) => (
          <button
            key={i}
            className={`cat-dot ${i === activeOriginalIdx ? 'cat-dot--active' : ''}`}
            onClick={() => goTo(i)}
            aria-label={`Photo ${i + 1}`}
          />
        ))}
      </div>

      {/* ── Lightbox ── */}
      <AnimatePresence>
        {lightboxIdx !== null && (
          <Lightbox photos={photos} index={lightboxIdx} onClose={closeLightbox} onNav={navigateLightbox} />
        )}
      </AnimatePresence>
    </section>
  );
};

export default PhotoCatalogueSection;
