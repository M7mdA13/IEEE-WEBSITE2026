import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import api from '../../api/public';
import './ExComSection.css';

const staticExCom = [
  { _id: 's1', name: 'Mennatallah Mostafa', role: 'Webmaster',   photo: '/images/Mennatallah copy.png', github: '#', linkedin: '#', email: '#' },
  { _id: 's2', name: 'Mostafa Samir',       role: 'Treasurer',   photo: '/images/moustafa copy.png',    github: '#', linkedin: '#', email: '#' },
  { _id: 's3', name: 'Karima Ayman',        role: 'Secretary',   photo: '/images/karima copy.png',      github: '#', linkedin: '#', email: '#' },
  { _id: 's4', name: 'Mahmoud Alsonbaty',   role: 'Chairman',    photo: '/images/alsonbaty copy.png',   github: '#', linkedin: '#', email: '#' },
  { _id: 's5', name: 'Shahd Abdelaziz',     role: 'Vice Chair',  photo: '/images/shahd copy.png',       github: '#', linkedin: '#', email: '#' },
];

/* Magnetic icon: slightly follows cursor within its bounding box */
const MagneticIcon = ({ href, icon }) => {
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

  return (
    <motion.div
      className={`excom-stagger-row ${isLeft ? 'align-to-left' : 'align-to-right'}`}
      initial={{ opacity: 0, x: isLeft ? -100 : 100 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-20px' }}
      transition={{ duration: 0.7, ease: 'easeOut', delay: index * 0.12 }}
    >
      <div className="excom-pill-wrapper">
        <div className="excom-person-frame">
          <img src={member.photo} alt={member.name} className="excom-person-img" />
        </div>

        <SpotlightPill isLeft={isLeft}>
          <div className="excom-info-content">
            <h3 className="excom-name-bold">{member.name}</h3>
            <p className="excom-role-subtitle">{member.role}</p>
            <div className="excom-social-strip">
              <MagneticIcon href={member.github}  icon="fab fa-github" />
              <MagneticIcon href={member.linkedin} icon="fab fa-linkedin-in" />
              <MagneticIcon href={member.email ? `mailto:${member.email}` : null} icon="fas fa-envelope" />
            </div>
          </div>
        </SpotlightPill>
      </div>
    </motion.div>
  );
};

const ExComSection = () => {
  const [members, setMembers] = useState(staticExCom);

  useEffect(() => {
    api.get('/excom')
      .then(({ data }) => { if (data.data?.length > 0) setMembers(data.data); })
      .catch(() => {});
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

      <div className="excom-center-constraint">
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
