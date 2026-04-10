import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Events.css';
import { CalendarIcon, LocationIcon } from '../../components/Icons';
import api from '../../api/public';
import { upcomingEvent, pastEvents } from '../../data/events';

const staticFallback = [
  { ...upcomingEvent, _id: upcomingEvent.id, status: 'upcoming' },
  ...pastEvents.map(e => ({ ...e, _id: e.id, status: 'completed' })),
];

const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const cardVariants = {
  hidden: { opacity: 0, y: 28 },
  show: (i) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.45, delay: i * 0.08, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

// direction: 1 = slide left (upcoming→past), -1 = slide right (past→upcoming)
const listVariants = {
  enter:  (d) => ({ opacity: 0, x: d * 56 }),
  center: { opacity: 1, x: 0,   transition: { duration: 0.32, ease: [0.25, 0.46, 0.45, 0.94] } },
  exit:   (d) => ({ opacity: 0, x: d * -56, transition: { duration: 0.22, ease: [0.25, 0.46, 0.45, 0.94] } }),
};

const EventCard = ({ event, index }) => {
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    cardRef.current.style.setProperty('--mouse-x', `${x}px`);
    cardRef.current.style.setProperty('--mouse-y', `${y}px`);
  };

  const isUpcoming = event.status === 'upcoming' || event.status === 'planning';

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
          backgroundImage: `url("${event.image}")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        } : {}}
      ></div>
      <div className="event-card-content">
        <h3 className="event-card-title">{event.title}</h3>
        <p className="event-card-desc">{event.description}</p>
        <div className="event-card-bottom">
          <div className="event-card-meta">
            <span className="meta-item">
              <CalendarIcon />
              {formatDate(event.date)}
            </span>
            {event.location && (
              <span className="meta-item">
                <LocationIcon />
                {event.location}
              </span>
            )}
          </div>
          <div className="event-card-actions">
            {isUpcoming ? (
              <>
                {event.registrationLink && event.registrationLink !== '#' && (
                  <a href={event.registrationLink} target="_blank" rel="noopener noreferrer" className="btn-primary">Register Now !</a>
                )}
                {event.agendaLink && event.agendaLink !== '#' && (
                  <a href={event.agendaLink} target="_blank" rel="noopener noreferrer" className="btn-primary">Agenda</a>
                )}
                {(!event.registrationLink || event.registrationLink === '#') && (!event.agendaLink || event.agendaLink === '#') && (
                  <button className="btn-primary" disabled>Coming Soon</button>
                )}
              </>
            ) : null}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const Events = () => {
  const [events, setEvents] = useState(staticFallback);
  const [mobileTab, setMobileTab] = useState('upcoming');
  const [dataReady, setDataReady] = useState(false);
  const dirRef = useRef(1); // 1 = left (upcoming→past), -1 = right (past→upcoming)

  const switchTab = useCallback((tab) => {
    if (tab === mobileTab) return;
    dirRef.current = tab === 'past' ? 1 : -1;
    setMobileTab(tab);
  }, [mobileTab]);

  // Touch swipe
  const touchStartX = useRef(null);
  const handleTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) < 40) return;
    switchTab(dx < 0 ? 'past' : 'upcoming');
    touchStartX.current = null;
  };

  useEffect(() => {
    api.get('/events')
      .then(({ data }) => { if (data.data?.length > 0) setEvents(data.data); })
      .catch(() => {})
      .finally(() => setDataReady(true));
  }, []);

  const upcoming = events.filter(e => e.status === 'upcoming' || e.status === 'planning');
  const past = events.filter(e => e.status === 'completed' || e.status === 'cancelled');

  return (
    <div
      className="events-page-container"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      style={{ opacity: dataReady ? 1 : 0, transition: 'opacity 0.35s ease' }}
    >
      <div className="events-page">

        {/* ── Desktop layout ── */}
        <div className="events-desktop">
          <h2 className="section-title"><span>Upcoming Events</span></h2>
          <div className="events-list">
            {upcoming.length > 0
              ? upcoming.map((event, i) => <EventCard key={event._id} event={event} index={i} />)
              : <p style={{ opacity: 0.5, padding: '20px 0' }}>No upcoming events right now. Check back soon!</p>
            }
          </div>

          <h2 className="section-title"><span>Past Events</span></h2>
          <div className="events-list">
            {past.length > 0
              ? past.map((event, i) => <EventCard key={event._id} event={event} index={i} />)
              : <p style={{ opacity: 0.5, padding: '20px 0' }}>No past events yet.</p>
            }
          </div>
        </div>

        {/* ── Mobile layout: tab switcher ── */}
        <div className="events-mobile">
          <div className="events-mobile-tabs">
            <button
              className={`events-mobile-tab ${mobileTab === 'upcoming' ? 'active' : ''}`}
              onClick={() => switchTab('upcoming')}
            >
              Upcoming
              {upcoming.length > 0 && (
                <span className="events-tab-badge">{upcoming.length}</span>
              )}
            </button>
            <button
              className={`events-mobile-tab ${mobileTab === 'past' ? 'active' : ''}`}
              onClick={() => switchTab('past')}
            >
              Past
              {past.length > 0 && (
                <span className="events-tab-badge">{past.length}</span>
              )}
            </button>
          </div>

          <div className="events-mobile-panel">
          <AnimatePresence mode="wait" custom={dirRef.current}>
            <motion.div
              key={mobileTab}
              className="events-list"
              custom={dirRef.current}
              variants={listVariants}
              initial="enter"
              animate="center"
              exit="exit"
            >
              {mobileTab === 'upcoming' ? (
                upcoming.length > 0
                  ? upcoming.map((event, i) => <EventCard key={event._id} event={event} index={i} />)
                  : <p style={{ opacity: 0.5, padding: '20px 0' }}>No upcoming events right now. Check back soon!</p>
              ) : (
                past.length > 0
                  ? past.map((event, i) => <EventCard key={event._id} event={event} index={i} />)
                  : <p style={{ opacity: 0.5, padding: '20px 0' }}>No past events yet.</p>
              )}
            </motion.div>
          </AnimatePresence>
          </div>

          <p className="events-swipe-hint">Swipe to switch</p>
        </div>

      </div>
    </div>
  );
};

export default Events;
