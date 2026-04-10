import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
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
  const [photos, setPhotos] = useState([]);
  const [centerIndex, setCenterIndex] = useState(1);
  const [hovered, setHovered] = useState(false);
  
  const total = photos.length || DEFAULT_PHOTOS.length;
  const displayPhotos = photos.length >= 3 ? photos : DEFAULT_PHOTOS;

  const timerRef   = useRef(null);
  const touchStartX = useRef(null);

  useEffect(() => {
    const loadGallery = async () => {
      try {
        const { data } = await api.get('/gallery');
        if (data.data && data.data.length >= 3) {
          setPhotos(data.data);
        }
      } catch (err) {
        console.error('Failed to load gallery photos', err);
      }
    };
    loadGallery();
  }, []);

  /* ── Auto-rotate: pauses when hovered ── */
  useEffect(() => {
    if (hovered) return;
    const id = setInterval(() => {
      setCenterIndex(prev => (prev + 1) % total);
    }, AUTO_ROTATE_MS);
    timerRef.current = id;
    return () => clearInterval(id);
  }, [hovered, total]);

  // helper used by click/swipe to reset the timer
  const startTimer = () => {
    clearInterval(timerRef.current);
    const id = setInterval(() => {
      setCenterIndex(prev => (prev + 1) % total);
    }, AUTO_ROTATE_MS);
    timerRef.current = id;
  };

  /* ── Touch swipe ── */
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > SWIPE_THRESHOLD) {
      const direction = dx > 0 ? -1 : 1; // swipe right = previous, swipe left = next
      setCenterIndex(prev => (prev + direction + total) % total);
      startTimer(); // reset timer on manual swipe
    }
    touchStartX.current = null;
  };

  /* ── Click on side photo (desktop) ── */
  const handleClick = (photoIdx) => {
    if (photoIdx !== centerIndex) {
      setCenterIndex(photoIdx);
      startTimer();
    }
  };

  const leftIndex  = (centerIndex - 1 + total) % total;
  const rightIndex = (centerIndex + 1) % total;

  const getSlot = (photoIdx) => {
    if (photoIdx === centerIndex) return SLOTS[1];
    if (photoIdx === leftIndex)   return SLOTS[0];
    if (photoIdx === rightIndex)  return SLOTS[2];
    return SLOTS[1];
  };

  return (
    <section className="catalogue-section">
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

      {/* ── 3D fan stage (desktop) ── */}
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
        {displayPhotos.map((photo, i) => {
          const slot = getSlot(i);
          const isCenter = i === centerIndex;

          return (
            <motion.div
              key={photo._id || photo.src}
              className={`catalogue-frame ${isCenter ? 'catalogue-frame--center' : 'catalogue-frame--side'}`}
              animate={{
                rotateY: slot.rotateY,
                rotateZ: slot.rotateZ,
                x: slot.x,
                y: slot.y,
                scale: slot.scale,
                zIndex: slot.zIndex,
              }}
              transition={{ duration: 0.6, ease: EASE }}
              onClick={() => handleClick(i)}
              style={{ cursor: isCenter ? 'default' : 'pointer' }}
            >
              <img
                src={photo.src}
                alt={photo.alt}
                className="catalogue-img"
                draggable={false}
              />
              {!isCenter && <div className="catalogue-overlay" />}
            </motion.div>
          );
        })}
      </motion.div>

      {/* ── Dot indicators (mobile only) ── */}
      <div className="catalogue-dots">
        {displayPhotos.map((_, i) => (
          <button
            key={i}
            className={`catalogue-dot ${i === centerIndex ? 'catalogue-dot--active' : ''}`}
            onClick={() => { setCenterIndex(i); startTimer(); }}
            aria-label={`Go to photo ${i + 1}`}
          />
        ))}
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
