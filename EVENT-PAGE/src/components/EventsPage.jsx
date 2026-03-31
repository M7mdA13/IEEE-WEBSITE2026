import React from 'react';
import '../EventsPage.css';
import { CalendarIcon, LocationIcon } from './Icons';

const EventCard = ({ event }) => {
  return (
    <div className="event-card">
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

const EventsPage = () => {
  const upcomingEvent = {
    title: "Event Title",
    description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
    date: "Nov 12, 2025",
    location: "Location",
    type: "upcoming",
    image: "group pic 1.jpg"
  };

  const groupImages = [
    "group pic 1.jpg",
    "group pic 2.jpg",
    "group pic 3.jpg"
  ];

  const pastEvents = Array(4).fill(null).map((_, index) => ({
    title: "Event Title",
    description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
    date: "Nov 12, 2025",
    location: "Location",
    type: "past",
    image: groupImages[index % groupImages.length]
  }));

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

export default EventsPage;
