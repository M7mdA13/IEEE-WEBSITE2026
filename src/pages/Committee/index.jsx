import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../../api/public';
import { getCommitteeBySlug } from '../../data/committees';
import { cloudinaryUrl } from '../../utils/cloudinary';
import './Committee.css';

const Stars = ({ count }) => (
  <div className="member-stars">
    {Array.from({ length: 5 }, (_, i) => (
      <i key={i} className={`fa-star ${i < count ? 'fas' : 'far'}`}></i>
    ))}
  </div>
);

const SocialLinks = ({ github, linkedin, email }) => (
  <div className="social-links">
    {github && github !== '#' && (
      <motion.a href={github} aria-label="GitHub" target="_blank" rel="noopener noreferrer" whileHover={{ scale: 1.1, y: -2 }}>
        <i className="fab fa-github"></i>
      </motion.a>
    )}
    {linkedin && linkedin !== '#' && (
      <motion.a href={linkedin} aria-label="LinkedIn" target="_blank" rel="noopener noreferrer" whileHover={{ scale: 1.1, y: -2 }}>
        <i className="fab fa-linkedin"></i>
      </motion.a>
    )}
    {email && email !== '#' && (
      <motion.a href={`mailto:${email}`} aria-label="Email" whileHover={{ scale: 1.1, y: -2 }}>
        <i className="fas fa-envelope"></i>
      </motion.a>
    )}
  </div>
);

const Committee = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const getStatic = (s) => {
    const staticCmt = getCommitteeBySlug(s);
    if (!staticCmt) return null;
    return {
      committee: staticCmt,
      board: (staticCmt.board || []).map((m, i) => ({ _id: `sb-${i}`, ...m })),
    };
  };

  const initial = getStatic(slug);
  const [committee, setCommittee] = useState(initial?.committee || null);
  const [board, setBoard] = useState(initial?.board || []);
  const [notFound, setNotFound] = useState(!initial);
  const [dataReady, setDataReady] = useState(false);

  useEffect(() => {
    api.get(`/committees/${slug}`)
      .then(async (cmtRes) => {
        const apiCmt = cmtRes.data.data;
        if (!apiCmt) return;
        const membersRes = await api.get(`/members?committee=${slug}`);
        setCommittee(apiCmt);
        const members = membersRes.data.data || [];
        setBoard(members.filter(m => m.roleType === 'head' || m.roleType === 'vice_head'));
      })
      .catch(() => {})
      .finally(() => setDataReady(true));
  }, [slug]);

  if (notFound || !committee) {
    return (
      <div className="committee-not-found">
        <h2>Committee not found.</h2>
        <Link to="/committees"><i className="fas fa-arrow-left" /> Back to Committees</Link>
      </div>
    );
  }

  const categoryLabel = committee.category === 'technical' ? 'Technical' : 'Non Technical';

  return (
    <div className="committee-page" style={{ opacity: dataReady ? 1 : 0, transition: 'opacity 0.35s ease' }}>

      {/* ── Hero ── */}
      <div className="committee-hero">
        <div className="committee-hero-inner">

          <button className="back-btn" onClick={() => navigate(-1)}>
            <i className="fas fa-arrow-left"></i>
            Back to committees
          </button>

          <div className="hero-info-row">
            <motion.div layoutId={`cmt-icon-${slug}`} className="hero-logo-wrap">
              {committee.image ? (
                <img src={cloudinaryUrl(committee.image, 400)} alt={committee.name} className="hero-logo-img" />
              ) : (
                <div className="hero-logo-icon">
                  <i className={`fas ${committee.icon}`}></i>
                </div>
              )}
            </motion.div>
            <div className="hero-text-wrap">
              <span className="hero-category">{categoryLabel}</span>
              <h1 className="hero-name">{committee.name}</h1>
              {committee.tagline && (
                <p className="hero-tagline">{committee.tagline}</p>
              )}
            </div>
          </div>

          <p className="hero-desc">{committee.shortDesc}</p>
        </div>
        <div className="hero-divider"></div>
      </div>

      {/* ── Content ── */}
      <div className="committee-content">
        <div className="committee-content-inner">

          {/* Committee Goals */}
          {committee.goals && committee.goals.length > 0 && (
            <motion.section 
              className="cmt-section"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <h2 className="cmt-section-title">Committee Goals</h2>
              <div className="cmt-goals-grid">
                {committee.goals.map((goal, i) => (
                  <motion.div 
                    key={i} 
                    className="cmt-goal-item"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.5 }}
                  >
                    <h3 className="cmt-goal-title">{goal.title}</h3>
                    <p className="cmt-goal-desc">{goal.desc}</p>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}

          {/* Key Activities */}
          {committee.activities && committee.activities.length > 0 && (
            <motion.section
              className="cmt-section"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="cmt-section-title">Key Activities</h2>
              <div className="cmt-activities-grid">
                {committee.activities.map((activity, i) => (
                  <motion.div
                    key={i}
                    className="cmt-activity-card"
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.5, type: 'spring' }}
                  >
                    <h4 className="cmt-activity-title">{activity.title}</h4>
                    <p className="cmt-activity-desc">{activity.desc}</p>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}

          {/* Committee's Board */}
          {board.length > 0 && (
            <motion.section
              className="cmt-section"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="cmt-section-title">Committee's Board</h2>
              <div className="cmt-board-list">
                {board.map((member, i) => (
                  <motion.div
                    key={member._id}
                    className="cmt-board-card"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.15, duration: 0.5 }}
                  >
                    <div className="cmt-board-info">
                      <h3 className="cmt-board-name">{member.name}</h3>
                      <div className="cmt-board-role-row">
                        <span className={`cmt-board-badge cmt-board-badge--${member.roleType}`}>
                          {member.roleType === 'head' ? 'Head' : 'Vice Head'}
                        </span>
                      </div>
                      {member.bio && <p className="cmt-board-bio">{member.bio}</p>}
                      <SocialLinks github={member.github} linkedin={member.linkedin} email={member.email} />
                    </div>
                    <div className="cmt-board-photo-wrap">
                      {member.photo ? (
                        <img src={cloudinaryUrl(member.photo, 400)} alt={member.name} className="cmt-board-photo-img" />
                      ) : (
                        <div className="cmt-board-photo-placeholder">
                          <i className="fas fa-user"></i>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}


        </div>
      </div>
    </div>
  );
};

export default Committee;
