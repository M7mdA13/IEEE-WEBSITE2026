import React from 'react';
import { motion } from 'framer-motion';
import './IEEELinksSection.css';

const links = [
  {
    title: 'IEEE.org',
    desc: "Explore IEEE's global initiatives, standards, and impact on technology worldwide.",
    url: 'https://www.ieee.org',
    icon: 'fa-globe',
    color: '#1565c0',
  },
  {
    title: 'Membership & Benefits',
    desc: 'Join a community that fosters innovation, leadership, and lifelong professional growth.',
    url: 'https://www.ieee.org/membership',
    icon: 'fa-id-card',
    color: '#00695c',
  },
  {
    title: 'IEEE Xplore',
    desc: 'Access cutting-edge research, journals, and publications from around the globe.',
    url: 'https://ieeexplore.ieee.org',
    icon: 'fa-book-open',
    color: '#283593',
  },
  {
    title: 'IEEE Standards',
    desc: 'Discover the global technological benchmarks that shape entire industries.',
    url: 'https://standards.ieee.org',
    icon: 'fa-certificate',
    color: '#006064',
  },
  {
    title: 'IEEE Spectrum',
    desc: 'Stay updated with the latest tech trends, innovations, and expert engineering analysis.',
    url: 'https://spectrum.ieee.org',
    icon: 'fa-newspaper',
    color: '#0d47a1',
  },
];

const IEEELinksSection = () => (
  <section className="ieee-section">
    <div className="ieee-inner">

      {/* Left — featured panel */}
      <motion.div
        className="ieee-feature"
        initial={{ opacity: 0, x: -40 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.65, ease: 'easeOut' }}
      >
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/2/21/IEEE_logo.svg"
          alt="IEEE"
          className="ieee-feature-logo"
          loading="lazy"
        />
        <h2 className="ieee-feature-title">
          <span>I</span>nstitute of <span>E</span>lectrical and{' '}
          <span>E</span>lectronics <span>E</span>ngineering
        </h2>
        <p className="ieee-feature-desc">
          The world's largest technical professional organization, uniting over 400,000
          members globally to advance technology for the benefit of humanity.
        </p>
        <div className="ieee-feature-badges">
          <span className="ieee-badge">Est. 1884</span>
          <span className="ieee-badge">400K+ Members</span>
          <span className="ieee-badge">160+ Countries</span>
        </div>
      </motion.div>

      {/* Right — colorful tile cards */}
      <div className="ieee-tiles-grid">
        {links.map((link, i) => (
          <motion.a
            key={link.title}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`ieee-tile${i === 4 ? ' ieee-tile--wide' : ''}`}
            style={{ '--tile-color': link.color }}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.42, delay: i * 0.07, ease: 'easeOut' }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
          >
            {/* Top row: title + icon */}
            <div className="ieee-tile-top">
              <h3 className="ieee-tile-title">{link.title}</h3>
              <div className="ieee-tile-icon">
                <i className={`fas ${link.icon}`} />
              </div>
            </div>

            {/* Description */}
            <p className="ieee-tile-desc">{link.desc}</p>

            {/* Arrow */}
            <span className="ieee-tile-arrow"><i className="fas fa-arrow-up-right" /></span>

            {/* Decorative circle in background */}
            <div className="ieee-tile-decor" aria-hidden="true" />
          </motion.a>
        ))}
      </div>

    </div>
  </section>
);

export default IEEELinksSection;
