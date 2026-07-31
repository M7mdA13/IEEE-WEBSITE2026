import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Events.css';
import { CalendarIcon, LocationIcon } from '../../components/Icons';
import api from '../../api/public';
import { upcomingEvent, pastEvents } from '../../data/events';
import { cloudinaryUrl } from '../../utils/cloudinary';
import { normalizeUrl } from '../../utils/url';

const staticFallback = [
  { ...upcomingEvent, _id: upcomingEvent.id, status: 'upcoming' },
  ...pastEvents.map(e => ({ ...e, _id: e.id, status: 'completed' })),
];

const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const getRelativeDate = (dateStr) => {
  if (!dateStr) return null;
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = date - now;
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  if (diffDays > 1 && diffDays <= 7) return `In ${diffDays} days`;
  if (diffDays > 7 && diffDays <= 30) return `In ${Math.ceil(diffDays / 7)} weeks`;
  return null;
};

const statusConfig = {
  upcoming:  { label: 'Upcoming',  className: 'badge-upcoming'  },
  planning:  { label: 'Planning',  className: 'badge-planning'  },
  completed: { label: 'Completed', className: 'badge-completed' },
  cancelled: { label: 'Cancelled', className: 'badge-cancelled' },
};

const cardVariants = {
  hidden: { opacity: 0, y: 28 },
  show: (i) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.45, delay: i * 0.08, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};



/* ── Featured Hero Card (next upcoming event) ── */
const FeaturedEventCard = ({ event }) => {
  const cardRef = useRef(null);
  const relDate = getRelativeDate(event.date);
  const registerLink = normalizeUrl(event.registrationLink);
  const agendaLink   = normalizeUrl(event.agendaLink);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    cardRef.current.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
    cardRef.current.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
  };

  return (
    <motion.div
      ref={cardRef}
      className="featured-event"
      onMouseMove={handleMouseMove}
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <div className="featured-event-glow" />
      <div className="featured-event-image" style={event.image ? {
        backgroundImage: `url("${cloudinaryUrl(event.image, 1200)}")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      } : {}}>
        {relDate && <span className="featured-countdown">{relDate}</span>}
      </div>
      <div className="featured-event-content">
        <div className="featured-badge-row">
          <span className={`event-badge ${statusConfig[event.status]?.className || 'badge-upcoming'}`}>
            {statusConfig[event.status]?.label || 'Upcoming'}
          </span>
          {event.status === 'upcoming' && <span className="featured-live-dot" />}
        </div>
        <h2 className="featured-event-title">{event.title}</h2>
        <p className="featured-event-desc">{event.description}</p>
        <div className="featured-event-meta">
          <span className="meta-item">
            <CalendarIcon width="14" height="14" />
            {formatDate(event.date)}
          </span>
          {event.location && (
            <span className="meta-item">
              <LocationIcon width="14" height="14" />
              {event.location}
            </span>
          )}
        </div>
        <div className="featured-event-actions">
          {registerLink && (
            <a href={registerLink} target="_blank" rel="noopener noreferrer" className="btn-primary btn-lg">
              Register Now
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </a>
          )}
          {agendaLink && (
            <a href={agendaLink} target="_blank" rel="noopener noreferrer" className="btn-outline">View Agenda</a>
          )}
          {!registerLink && !agendaLink && (
            <button className="btn-primary btn-lg" disabled>Details Coming Soon</button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

/* ── Standard Event Card ── */
const EventCard = ({ event, index }) => {
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    cardRef.current.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
    cardRef.current.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
  };

  const [expanded, setExpanded] = useState(false);
  const isUpcoming = event.status === 'upcoming' || event.status === 'planning';
  const isPast = event.status === 'completed';
  const badge = statusConfig[event.status];
  const registerLink = normalizeUrl(event.registrationLink);
  const agendaLink   = normalizeUrl(event.agendaLink);
  const recapLink    = normalizeUrl(event.recapLink);

  return (
    <motion.div
      ref={cardRef}
      className="event-card"
      onMouseMove={handleMouseMove}
      custom={index}
      variants={cardVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-40px' }}
    >
      <div
        className="event-card-image"
        style={event.image ? {
          backgroundImage: `url("${cloudinaryUrl(event.image, 800)}")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        } : {}}
      />
      <div className="event-card-content">
        {badge && (
          <span className={`event-badge event-badge-card ${badge.className}`}>{badge.label}</span>
        )}
        <h3 className="event-card-title">{event.title}</h3>
        <p className={`event-card-desc ${expanded ? 'event-card-desc--expanded' : ''}`}>
          {event.description}
        </p>
        {event.description?.length > 120 && (
          <button className="event-read-more" onClick={() => setExpanded(e => !e)}>
            {expanded ? 'Read less ↑' : 'Read more ↓'}
          </button>
        )}
        <div className="event-card-bottom">
          <div className="event-card-meta">
            <span className="meta-item">
              <CalendarIcon width="14" height="14" />
              {formatDate(event.date)}
            </span>
            {event.location && (
              <span className="meta-item">
                <LocationIcon width="14" height="14" />
                {event.location}
              </span>
            )}
            {isPast && event.attendanceCount > 0 && (
              <span className="meta-item attendance-count">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                {event.attendanceCount} attended
              </span>
            )}
          </div>
          <div className="event-card-actions">
            {isUpcoming ? (
              <>
                {registerLink && (
                  <a href={registerLink} target="_blank" rel="noopener noreferrer" className="btn-primary">Register Now !</a>
                )}
                {agendaLink && (
                  <a href={agendaLink} target="_blank" rel="noopener noreferrer" className="btn-primary">Agenda</a>
                )}
                {!registerLink && !agendaLink && (
                  <button className="btn-primary" disabled>Coming Soon</button>
                )}
              </>
            ) : isPast && recapLink ? (
              <a href={recapLink} target="_blank" rel="noopener noreferrer" className="btn-outline btn-sm">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                View Recap
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

/* ── Empty State ── */
const EmptyState = ({ type }) => (
  <motion.div
    className="events-empty"
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.4 }}
  >
    <div className="events-empty-icon">
      {type === 'upcoming' ? (
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/><path d="M8 18h.01"/><path d="M12 18h.01"/></svg>
      ) : (
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
      )}
    </div>
    <p className="events-empty-text">
      {type === 'upcoming'
        ? 'No upcoming events right now — stay tuned!'
        : 'No past events yet.'}
    </p>
  </motion.div>
);

const Events = () => {
  const [events, setEvents] = useState([]);
  const [dataReady, setDataReady] = useState(false);
  const [mobileTab, setMobileTab] = useState('upcoming');
  const dirRef = useRef(1);

  const switchTab = useCallback((tab) => {
    if (tab === mobileTab) return;
    dirRef.current = tab === 'past' ? 1 : -1;
    setMobileTab(tab);
  }, [mobileTab]);

  useEffect(() => {
    api.get('/events')
      .then(({ data }) => { setEvents(data.data?.length > 0 ? data.data : staticFallback); })
      .catch(() => { setEvents(staticFallback); })
      .finally(() => setDataReady(true));
  }, []);

  const upcoming = events.filter(e => e.status === 'upcoming' || e.status === 'planning');
  const past = events.filter(e => e.status === 'completed' || e.status === 'cancelled');

  // First upcoming event is the featured one
  const featured = upcoming[0];
  const restUpcoming = upcoming.slice(1);

  return (
    <div className="events-page-container">
      {/* ── Hero Header ── */}
      <motion.div
        className="events-hero"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <motion.h1
          className="events-hero-title"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Events
        </motion.h1>
        <motion.p
          className="events-hero-subtitle"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Workshops, talks, competitions & more — where learning meets community.
        </motion.p>
        <motion.div
          className="events-stats-row"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="events-stat">
            <span className="events-stat-num">{upcoming.length}</span>
            <span className="events-stat-label">Upcoming</span>
          </div>
          <div className="events-stat-divider" />
          <div className="events-stat">
            <span className="events-stat-num">{past.length}</span>
            <span className="events-stat-label">Completed</span>
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        className="events-page"
        initial={{ opacity: 0 }}
        animate={{ opacity: dataReady ? 1 : 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >

        {/* ── Desktop layout ── */}
        <div className="events-desktop">
          {featured && (
                <section className="events-section">
                  <h2 className="section-title"><span>Next Up</span></h2>
                  <FeaturedEventCard event={featured} />
                </section>
              )}

              {restUpcoming.length > 0 && (
                <section className="events-section">
                  <h2 className="section-title"><span>More Upcoming</span></h2>
                  <div className="events-list">
                    {restUpcoming.map((event, i) => <EventCard key={event._id} event={event} index={i} />)}
                  </div>
                </section>
              )}

              {!featured && restUpcoming.length === 0 && (
                <section className="events-section">
                  <h2 className="section-title"><span>Upcoming Events</span></h2>
                  <EmptyState type="upcoming" />
                </section>
              )}

              <section className="events-section">
                <h2 className="section-title"><span>Past Events</span></h2>
                {past.length > 0 ? (
                  <div className="events-list">
                    {past.map((event, i) => <EventCard key={event._id} event={event} index={i} />)}
                  </div>
                ) : (
                  <EmptyState type="past" />
                )}
          </section>
        </div>

        {/* ── Mobile layout: tab switcher ── */}
        <div className="events-mobile">
          <div className="events-toggle-wrap">
            <div className="events-toggle-pill">
              <button className="events-tab-btn" onClick={() => switchTab('upcoming')}>
                {mobileTab === 'upcoming' && (
                  <motion.span
                    layoutId="events-tab-indicator"
                    className="events-tab-indicator"
                    transition={{ type: 'spring', stiffness: 420, damping: 36 }}
                  />
                )}
                <span className="events-tab-label">
                  Upcoming
                  {upcoming.length > 0 && <span className="events-tab-count">{upcoming.length}</span>}
                </span>
              </button>
              <button className="events-tab-btn" onClick={() => switchTab('past')}>
                {mobileTab === 'past' && (
                  <motion.span
                    layoutId="events-tab-indicator"
                    className="events-tab-indicator"
                    transition={{ type: 'spring', stiffness: 420, damping: 36 }}
                  />
                )}
                <span className="events-tab-label">
                  Past
                  {past.length > 0 && <span className="events-tab-count">{past.length}</span>}
                </span>
              </button>
            </div>
          </div>

          <div className="events-mobile-panel">
            <AnimatePresence mode="wait" custom={dirRef.current}>
                <motion.div
                  key={mobileTab}
                  className="events-list"
                  custom={dirRef.current}
                  initial={(d) => ({ opacity: 0, x: d * 56 })}
                  animate={{ opacity: 1, x: 0, transition: { duration: 0.32, ease: [0.25, 0.46, 0.45, 0.94] } }}
                  exit={(d) => ({ opacity: 0, x: d * -56, transition: { duration: 0.22, ease: [0.25, 0.46, 0.45, 0.94] } })}
                >
                  {mobileTab === 'upcoming' ? (
                    upcoming.length > 0
                      ? upcoming.map((event, i) => <EventCard key={event._id} event={event} index={i} />)
                      : <EmptyState type="upcoming" />
                  ) : (
                    past.length > 0
                      ? past.map((event, i) => <EventCard key={event._id} event={event} index={i} />)
                      : <EmptyState type="past" />
                  )}
                </motion.div>
            </AnimatePresence>
          </div>

        </div>

      </motion.div>
    </div>
  );
};

export default Events;
