import React, { useRef, useState, useEffect } from 'react';
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

const EventCard = ({ event }) => {
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
    <div
      ref={cardRef}
      className="event-card"
      onMouseMove={handleMouseMove}
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
                {event.registrationLink && (
                  <a href={event.registrationLink} target="_blank" rel="noopener noreferrer" className="btn-primary">Register Now !</a>
                )}
                {event.agendaLink && (
                  <a href={event.agendaLink} target="_blank" rel="noopener noreferrer" className="btn-primary">Agenda</a>
                )}
                {!event.registrationLink && !event.agendaLink && (
                  <button className="btn-primary" disabled>Coming Soon</button>
                )}
              </>
            ) : (
              event.recapLink
                ? <a href={event.recapLink} target="_blank" rel="noopener noreferrer" className="btn-primary">Recap</a>
                : <button className="btn-primary" disabled>Recap</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/events')
      .then(({ data }) => setEvents(data.data?.length > 0 ? data.data : staticFallback))
      .catch(() => setEvents(staticFallback))
      .finally(() => setLoading(false));
  }, []);

  const upcoming = events.filter(e => e.status === 'upcoming' || e.status === 'planning');
  const past = events.filter(e => e.status === 'completed' || e.status === 'cancelled');

  if (loading) {
    return (
      <div className="events-page-container">
        <div className="events-page" style={{ textAlign: 'center', padding: '80px 20px', opacity: 0.6 }}>
          Loading events...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="events-page-container">
        <div className="events-page" style={{ textAlign: 'center', padding: '80px 20px', opacity: 0.6 }}>
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="events-page-container">
      <div className="events-page">
        <h2 className="section-title"><span>Upcoming Events</span></h2>
        <div className="events-list">
          {upcoming.length > 0
            ? upcoming.map(event => <EventCard key={event._id} event={event} />)
            : <p style={{ opacity: 0.5, padding: '20px 0' }}>No upcoming events right now. Check back soon!</p>
          }
        </div>

        <h2 className="section-title"><span>Past Events</span></h2>
        <div className="events-list">
          {past.length > 0
            ? past.map(event => <EventCard key={event._id} event={event} />)
            : <p style={{ opacity: 0.5, padding: '20px 0' }}>No past events yet.</p>
          }
        </div>
      </div>
    </div>
  );
};

export default Events;
