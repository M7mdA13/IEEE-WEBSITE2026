import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import './BentoSection.css';

const BentoCard = ({ title, subtitle, link, linkText, span, bgClass }) => {
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
      onMouseMove={handleMouseMove}
      className={`bento-card ${bgClass} ${span ? `span-${span}` : ''}`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ y: -4 }}
    >
      <div className="bento-content">
        <h3 className="bento-title fruit-font">{title}</h3>
        {subtitle && <p className="bento-subtitle">{subtitle}</p>}
        {link && (
          <Link to={link} className="bento-btn">
            {linkText} <i className="fas fa-arrow-right"></i>
          </Link>
        )}
      </div>
    </motion.div>
  );
};

const BentoSection = () => {
  return (
    <section className="bento-wrapper">
      <div className="bento-header">
        <h2 className="section-title">Discover the Branch</h2>
        <p className="bento-lead">Everything you need to know, neatly organized.</p>
      </div>
      
      <div className="bento-grid">
        <BentoCard 
          title="Upcoming Events" 
          subtitle="Join us at our next major tech symposium."
          link="/events"
          linkText="Explore Events"
          span="2"
          bgClass="bento-blue"
        />
        <BentoCard 
          title="Committees" 
          subtitle="Find your place."
          link="/committees"
          linkText="View All"
          span="1"
          bgClass="bento-glass"
        />
        <BentoCard 
          title="Global Membership" 
          subtitle="Unlock the power of the world's largest technical professional organization."
          link="/membership"
          linkText="Become a Member"
          span="3"
          bgClass="bento-cyan"
        />
      </div>
    </section>
  );
};

export default BentoSection;
