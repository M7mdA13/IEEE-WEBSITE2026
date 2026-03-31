import React, { useRef } from 'react';
import './Events.css';
import { CalendarIcon, LocationIcon } from '../../components/Icons';
import { upcomingEvent, pastEvents } from '../../data/events';

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

  return (
    <div 
      ref={cardRef} 
      className="event-card"
      onMouseMove={handleMouseMove}
    >
      <div
        className="event-card-image"
        style={event.image ? {
          backgroundImage: `url("/images/${event.image}")`,
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
              {event.date}
            </span>
            <span className="meta-item">
              <LocationIcon />
              {event.location}
            </span>
          </div>
          <div className="event-card-actions">
            {event.type === 'upcoming' ? (
              <>
                <button className="btn-primary">Register Now !</button>
                <button className="btn-primary">Agenda</button>
              </>
            ) : (
              <button className="btn-primary">Recap</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const Events = () => {
  return (
    <div className="events-page-container">
      <div className="events-page">
        <h2 className="section-title"><span>Upcoming Events</span></h2>
        <div className="events-list">
          <EventCard event={upcomingEvent} />
        </div>

        <h2 className="section-title"><span>Past Events</span></h2>
        <div className="events-list">
          {pastEvents.map((event, index) => (
            <EventCard key={index} event={event} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Events;
