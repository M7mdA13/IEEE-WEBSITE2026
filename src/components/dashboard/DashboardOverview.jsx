const statsCards = [
  { id: 'members', icon: 'fa-users', title: 'Total Members', value: '250', change: '+12%', changeText: 'from last month', cardClass: 'members-card' },
  { id: 'events', icon: 'fa-calendar-alt', title: 'Events Held', value: '45', change: '+5', changeText: 'this year', cardClass: 'events-card' },
  { id: 'partners', icon: 'fa-handshake', title: 'Partners', value: '18', change: '+3', changeText: 'new partners', cardClass: 'partners-card' },
  { id: 'founded', icon: 'fa-flag', title: 'Founded In', value: '2011', change: '12 years', changeText: 'of excellence', cardClass: 'founded-card', changeClass: 'neutral' }
]

const recentEvents = [
  { id: 1, day: '15', month: 'OCT', title: 'IEEE Day Celebration', description: 'A global event celebrating IEEE members and their contributions.', location: 'MUST Campus', attendees: '120 Attendees', status: 'Completed', statusClass: 'completed' },
  { id: 2, day: '22', month: 'NOV', title: 'Technical Workshop: AI Fundamentals', description: 'Introduction to artificial intelligence and machine learning concepts.', location: 'Engineering Building', attendees: '85 Attendees', status: 'Upcoming', statusClass: 'upcoming' },
  { id: 3, day: '05', month: 'DEC', title: 'End of Year Ceremony', description: 'Celebrating achievements and recognizing outstanding members.', location: 'Main Auditorium', attendees: '200 Expected', status: 'Planning', statusClass: 'planning' }
]

function DashboardOverview() {
  return (
    <section className="content-section active">
      <h1>Dashboard Overview</h1>
      
      {/* Stats Cards */}
      <div className="stats-cards">
        {statsCards.map(card => (
          <div key={card.id} className={`card ${card.cardClass}`}>
            <div className="card-icon">
              <i className={`fas ${card.icon}`}></i>
            </div>
            <div className="card-info">
              <h3>{card.title}</h3>
              <h2>{card.value}</h2>
              <p>
                <span className={card.changeClass || 'positive'}>{card.change}</span> {card.changeText}
              </p>
            </div>
          </div>
        ))}
      </div>
      
      {/* Recent Events Section */}
      <div className="recent-section">
        <div className="section-header">
          <h2>Recent Events</h2>
          <a href="#" className="view-all">View All</a>
        </div>
        <div className="events-list">
          {recentEvents.map(event => (
            <div key={event.id} className="event-item">
              <div className="event-date">
                <span className="day">{event.day}</span>
                <span className="month">{event.month}</span>
              </div>
              <div className="event-details">
                <h3>{event.title}</h3>
                <p>{event.description}</p>
                <div className="event-meta">
                  <span><i className="fas fa-map-marker-alt"></i> {event.location}</span>
                  <span><i className="fas fa-users"></i> {event.attendees}</span>
                </div>
              </div>
              <div className={`event-status ${event.statusClass}`}>
                <span>{event.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default DashboardOverview
