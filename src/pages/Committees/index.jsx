import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getTechnical, getNonTechnical } from '../../data/committees';
import './Committees.css';

/* ── Animation variants ── */
const containerVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
  exit: {
    transition: { staggerChildren: 0.04, staggerDirection: -1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.97 },
  show: {
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.38, ease: [0.25, 0.46, 0.45, 0.94] },
  },
  exit: {
    opacity: 0, y: -14, scale: 0.97,
    transition: { duration: 0.18, ease: 'easeIn' },
  },
};

const headerItemVariants = {
  hidden: { opacity: 0, y: 22 },
  show: (i) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.48, ease: 'easeOut' },
  }),
};

/* ── Card ── */
const CommitteeCard = ({ committee }) => {
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    cardRef.current.style.setProperty('--mouse-x', `${x}px`);
    cardRef.current.style.setProperty('--mouse-y', `${y}px`);
  };

  return (
    <motion.div
      ref={cardRef}
      className="cmt-card"
      onMouseMove={handleMouseMove}
      variants={cardVariants}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
    >
    <div className="cmt-card-body">
      <h3 className="cmt-card-title">{committee.name}</h3>
      <p className="cmt-card-desc">{committee.shortDesc}</p>
      <Link to={`/committees/${committee.slug}`} className="cmt-learn-btn">
        Learn more &rarr;
      </Link>
    </div>
    <div className="cmt-card-icon">
      {committee.image ? (
        <img src={committee.image} alt={committee.name} />
      ) : (
        <i className={`fas ${committee.icon}`}></i>
      )}
    </div>
  </motion.div>
  );
};

/* ── Page ── */
const Committees = () => {
  const [activeTab, setActiveTab] = useState('technical');
  const list = activeTab === 'technical' ? getTechnical() : getNonTechnical();

  const switchTab = (tab) => {
    if (tab === activeTab) return;
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="committees-page">
      <div className="committees-container">

        {/* Header — staggered entrance */}
        <motion.h1
          className="committees-heading"
          custom={0}
          variants={headerItemVariants}
          initial="hidden"
          animate="show"
        >
          Explore our committees
        </motion.h1>

        <motion.p
          className="committees-intro"
          custom={1}
          variants={headerItemVariants}
          initial="hidden"
          animate="show"
        >
          The IEEE MUST Student Branch is divided into Technical and Non-Technical committees, offering opportunities for
          everyone with different interests and skills.
        </motion.p>

        <motion.ul
          className="committees-bullets"
          custom={2}
          variants={headerItemVariants}
          initial="hidden"
          animate="show"
        >
          <li>Technical Committees focus on technology, innovation, and developing practical engineering skills through workshops, projects, and technical activities.</li>
          <li>Non-Technical Committees focus on organization, creativity, communication, and teamwork, ensuring successful events, strong community engagement, and smooth branch operations.</li>
        </motion.ul>

        <motion.p
          className="committees-tagline"
          custom={3}
          variants={headerItemVariants}
          initial="hidden"
          animate="show"
        >
          With diverse roles and multiple fields to explore, every member can find a place to learn, contribute, and grow.
        </motion.p>

        {/* Tab switcher with sliding indicator */}
        <motion.div
          className="committees-toggle"
          custom={4}
          variants={headerItemVariants}
          initial="hidden"
          animate="show"
        >
          <div className="committees-toggle-pill">
            <button
              className="tab-btn"
              onClick={() => switchTab('technical')}
            >
              {activeTab === 'technical' && (
                <motion.span
                  layoutId="tab-indicator"
                  className="tab-indicator"
                  transition={{ type: 'spring', stiffness: 420, damping: 36 }}
                />
              )}
              <span className="tab-label">Technical</span>
            </button>
            <button
              className="tab-btn"
              onClick={() => switchTab('non-technical')}
            >
              {activeTab === 'non-technical' && (
                <motion.span
                  layoutId="tab-indicator"
                  className="tab-indicator"
                  transition={{ type: 'spring', stiffness: 420, damping: 36 }}
                />
              )}
              <span className="tab-label">Non Technical</span>
            </button>
          </div>
        </motion.div>

        {/* Animated card grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            className="committees-grid"
            variants={containerVariants}
            initial="hidden"
            animate="show"
            exit="exit"
          >
            {list.map((committee) => (
              <CommitteeCard key={committee.slug} committee={committee} />
            ))}
          </motion.div>
        </AnimatePresence>

      </div>
    </div>
  );
};

export default Committees;
