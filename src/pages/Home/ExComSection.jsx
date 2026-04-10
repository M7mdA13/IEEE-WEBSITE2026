import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../api/public';
import './ExComSection.css';

const staticExCom = [
  { _id: 's1', name: 'Mennatallah Mostafa', role: 'Webmaster',  photo: '/images/Mennatallah copy.png' },
  { _id: 's2', name: 'Mostafa Samir',       role: 'Treasurer',  photo: '/images/moustafa copy.png' },
  { _id: 's3', name: 'Karima Ayman',        role: 'Secretary',  photo: '/images/karima copy.png' },
  { _id: 's4', name: 'Mahmoud Alsonbaty',   role: 'Chairman',   photo: '/images/alsonbaty copy.png' },
  { _id: 's5', name: 'Shahd Abdelaziz',     role: 'Vice Chair', photo: '/images/shahd copy.png' },
];

/* Magnetic icon: slightly follows cursor within its bounding box */
const MagneticIcon = ({ href, icon, ariaLabel }) => {
  const ref = useRef(null);

  const handleMouseMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const dx = (e.clientX - (rect.left + rect.width  / 2)) * 0.38;
    const dy = (e.clientY - (rect.top  + rect.height / 2)) * 0.38;
    el.style.transform = `translate(${dx}px, ${dy}px)`;
  };

  const handleMouseLeave = () => {
    if (ref.current) ref.current.style.transform = 'translate(0, 0)';
  };

  return (
    <a
      href={href || '#'}
      target="_blank"
      rel="noopener noreferrer"
      className="excom-link-icon"
      aria-label={ariaLabel}
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <i className={icon} />
    </a>
  );
};

/* Pill with cursor-following spotlight radial gradient */
const SpotlightPill = ({ isLeft, children }) => {
  const ref = useRef(null);

  const handleMouseMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${e.clientX - rect.left}px`);
    el.style.setProperty('--my', `${e.clientY - rect.top}px`);
  };

  return (
    <div
      className={`excom-heavy-pill ${isLeft ? 'pill-grow-right' : 'pill-grow-left'}`}
      ref={ref}
      onMouseMove={handleMouseMove}
    >
      {children}
    </div>
  );
};

const ExComCard = ({ member, index }) => {
  const isLeft = index % 2 === 0;
  const [bioOpen, setBioOpen] = useState(false);

  return (
    <div className="excom-item-wrapper">
      <motion.div
        className={`excom-stagger-row ${isLeft ? 'align-to-left' : 'align-to-right'}`}
        initial={{ opacity: 0, x: isLeft ? -80 : 80, scale: 0.96 }}
        whileInView={{ opacity: 1, x: 0, scale: 1 }}
        viewport={{ once: true, margin: '-20px' }}
        transition={{ type: 'spring', stiffness: 220, damping: 28, delay: index * 0.10 }}
      >
        <div
          className={`excom-pill-wrapper ${member.bio ? 'excom-pill-wrapper--has-bio' : ''}`}
          onClick={member.bio ? () => setBioOpen(v => !v) : undefined}
          role={member.bio ? 'button' : undefined}
          tabIndex={member.bio ? 0 : undefined}
          onKeyDown={member.bio ? (e) => { if (e.key === 'Enter' || e.key === ' ') setBioOpen(v => !v); } : undefined}
          aria-expanded={member.bio ? bioOpen : undefined}
        >
          <div className="excom-person-frame">
            <img src={member.photo} alt={member.name} className="excom-person-img" />
          </div>

          <SpotlightPill isLeft={isLeft}>
            <div className="excom-info-content">
              <h3 className="excom-name-bold">{member.name}</h3>
              <p className="excom-role-subtitle">{member.role}</p>
              <div className="excom-social-strip">
                {member.github   && <MagneticIcon href={member.github}            icon="fab fa-github"      ariaLabel={`${member.name}'s GitHub`} />}
                {member.linkedin && <MagneticIcon href={member.linkedin}          icon="fab fa-linkedin-in" ariaLabel={`${member.name}'s LinkedIn`} />}
                {member.email    && <MagneticIcon href={`mailto:${member.email}`} icon="fas fa-envelope"    ariaLabel={`Email ${member.name}`} />}
              </div>
            </div>
          </SpotlightPill>
        </div>
      </motion.div>

      {member.bio && !bioOpen && (
        <p className={`excom-bio-hint ${isLeft ? 'excom-bio-hint--left' : 'excom-bio-hint--right'}`}>
          tap to know more
        </p>
      )}

      <AnimatePresence>
        {bioOpen && member.bio && (
          <motion.div
            className={`excom-bio-panel ${isLeft ? 'excom-bio-panel--left' : 'excom-bio-panel--right'}`}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <p className="excom-bio-text">{member.bio}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ExComSection = () => {
  const [members, setMembers] = useState(staticExCom);
  const [dataReady, setDataReady] = useState(false);

  useEffect(() => {
    api.get('/excom')
      .then(({ data }) => { if (data.data?.length > 0) setMembers(data.data); })
      .catch(() => {})
      .finally(() => setDataReady(true));
  }, []);

  return (
    <section className="excom-full-section">
      <div className="excom-title-wrap">
        <h2 className="excom-main-title">Executive Officers</h2>
        <motion.div
          className="excom-title-underline"
          initial={{ width: 0 }}
          whileInView={{ width: '80px' }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, delay: 0.25, ease: 'easeOut' }}
        />
      </div>

      <div
        className="excom-center-constraint"
        style={{ opacity: dataReady ? 1 : 0, transition: 'opacity 0.4s ease' }}
      >
        <div className="excom-vertical-stack">
          {members.map((member, i) => (
            <ExComCard key={member._id} member={member} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExComSection;
