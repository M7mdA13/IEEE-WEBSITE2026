import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './PhotoCatalogueSection.css';

import api from '../../api/public';

const DEFAULT_PHOTOS = [
  { src: '/images/group pic 1.jpg', alt: 'IEEE MUST SB event'    },
  { src: '/images/group pic 2.jpg', alt: 'IEEE MUST SB team'     },
  { src: '/images/group pic 3.jpg', alt: 'IEEE MUST SB activity' },
];

const SLOTS = [
  { rotateY:  22, rotateZ: -4, x: -240, y: 60, scale: 0.82, zIndex: 1 },
  { rotateY:   0, rotateZ:  0, x:    0, y:  0, scale: 1.00, zIndex: 3 },
  { rotateY: -22, rotateZ:  4, x:  240, y: 60, scale: 0.82, zIndex: 1 },
];

const EASE = [0.25, 0.46, 0.45, 0.94];
const AUTO_ROTATE_MS = 5000;
const SWIPE_THRESHOLD = 40;

const PhotoCatalogueSection = () => {
  const [photos, setPhotos] = useState(DEFAULT_PHOTOS);
  const [centerIndex, setCenterIndex] = useState(1);
  const [hovered, setHovered] = useState(false);
  const [dataReady, setDataReady] = useState(false);

  const total = photos.length;
  const timerRef    = useRef(null);
  const touchStartX = useRef(null);

  useEffect(() => {
    api.get('/gallery')
      .then(({ data }) => {
        if (data.data && data.data.length >= 3) {
          setPhotos(data.data);
          setCenterIndex(1);
        }
      })
      .catch(() => {})
      .finally(() => setDataReady(true));
  }, []);

  /* ── Auto-rotate ── */
  useEffect(() => {
    if (hovered) return;
    const id = setInterval(() => setCenterIndex(prev => (prev + 1) % total), AUTO_ROTATE_MS);
    timerRef.current = id;
    return () => clearInterval(id);
  }, [hovered, total]);

  const resetTimer = () => {
    clearInterval(timerRef.current);
    const id = setInterval(() => setCenterIndex(prev => (prev + 1) % total), AUTO_ROTATE_MS);
    timerRef.current = id;
  };

  /* ── Touch swipe ── */
  const handleTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > SWIPE_THRESHOLD) {
      const dir = dx > 0 ? -1 : 1;
      setCenterIndex(prev => (prev + dir + total) % total);
      resetTimer();
    }
    touchStartX.current = null;
  };

  const leftIndex  = (centerIndex - 1 + total) % total;
  const rightIndex = (centerIndex + 1) % total;

  // 3 stable slots — never remount, only their content cross-fades
  const slots = [
    { key: 'left',   photoIdx: leftIndex,   config: SLOTS[0], isCenter: false },
    { key: 'center', photoIdx: centerIndex, config: SLOTS[1], isCenter: true  },
    { key: 'right',  photoIdx: rightIndex,  config: SLOTS[2], isCenter: false },
  ];

  const navigate = (dir) => {
    setCenterIndex(prev => (prev + dir + total) % total);
    resetTimer();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft')  { navigate(-1); }
    if (e.key === 'ArrowRight') { navigate(1);  }
  };

  return (
    <section className="catalogue-section" onKeyDown={handleKeyDown} tabIndex={-1} style={{ opacity: dataReady ? 1 : 0, transition: 'opacity 0.4s ease' }}>
      <motion.div
        className="catalogue-header"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.55, ease: 'easeOut' }}
      >
        <h2 className="catalogue-title">Life at IEEE MUST SB</h2>
        <p className="catalogue-subtitle">
          Moments captured across events, workshops, and everything in between.
        </p>
      </motion.div>

      {/* ── 3D fan stage ── */}
      <motion.div
        className="catalogue-stage"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.9, delay: 0.1 }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {slots.map(({ key, photoIdx, config, isCenter }) => {
          const photo = photos[photoIdx];
          return (
            <motion.div
              key={key}
              className={`catalogue-frame ${isCenter ? 'catalogue-frame--center' : 'catalogue-frame--side'}`}
              animate={{ rotateY: config.rotateY, rotateZ: config.rotateZ, x: config.x, y: config.y, scale: config.scale, zIndex: config.zIndex }}
              transition={{ duration: 0.6, ease: EASE }}
              onClick={() => { if (!isCenter) { setCenterIndex(photoIdx); resetTimer(); } }}
              style={{ cursor: isCenter ? 'default' : 'pointer' }}
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={photo?.src}
                  src={photo?.src}
                  alt={photo?.alt}
                  className="catalogue-img"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  draggable={false}
                />
              </AnimatePresence>
              {!isCenter && <div className="catalogue-overlay" />}
            </motion.div>
          );
        })}
      </motion.div>

      {/* ── Controls ── */}
      <div className="catalogue-controls">
        <button className="catalogue-arrow" onClick={() => navigate(-1)} aria-label="Previous">
          <i className="fas fa-chevron-left" />
        </button>

        <div className="catalogue-dots">
          {photos.map((_, i) => (
            <button
              key={i}
              className={`catalogue-dot ${i === centerIndex ? 'catalogue-dot--active' : ''}`}
              onClick={() => { setCenterIndex(i); resetTimer(); }}
              aria-label={`Go to photo ${i + 1}`}
            />
          ))}
        </div>

        <button className="catalogue-arrow" onClick={() => navigate(1)} aria-label="Next">
          <i className="fas fa-chevron-right" />
        </button>
      </div>

      <motion.p
        className="catalogue-hint"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.7 }}
      >
        Click a photo to bring it to the front · Auto-advances every 5s
      </motion.p>
    </section>
  );
};

export default PhotoCatalogueSection;
