import { useState, useEffect } from 'react'
import api from '../../api/index'

function DashboardOverview() {
  const [stats, setStats] = useState({ members: '—', events: '—', partners: '—' })
  const [recentEvents, setRecentEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [membersRes, eventsRes, partnersRes] = await Promise.all([
          api.get('/admin/excom'),
          api.get('/admin/events'),
          api.get('/admin/partners'),
        ])
        setStats({
          members: membersRes.data.data.length,
          events: eventsRes.data.data.length,
          partners: partnersRes.data.data.length,
        })
        // Show 3 most recent events
        setRecentEvents(eventsRes.data.data.slice(0, 3))
      } catch {
        // Keep dashes on error
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [])

  const statsCards = [
    { id: 'members', icon: 'fa-users', title: 'ExCom Members', value: stats.members, cardClass: 'members-card' },
    { id: 'events', icon: 'fa-calendar-alt', title: 'Total Events', value: stats.events, cardClass: 'events-card' },
    { id: 'partners', icon: 'fa-handshake', title: 'Partners', value: stats.partners, cardClass: 'partners-card' },
    { id: 'founded', icon: 'fa-flag', title: 'Founded In', value: '2011', cardClass: 'founded-card', changeClass: 'neutral' },
  ]

  const statusClass = (status) => {
    if (status === 'upcoming') return 'upcoming'
    if (status === 'completed') return 'completed'
    return 'planning'
  }

  return (
    <section className="content-section active">
      <h1>Dashboard Overview</h1>

      <div className="stats-cards">
        {statsCards.map(card => (
          <div key={card.id} className={`card ${card.cardClass}`}>
            <div className="card-icon"><i className={`fas ${card.icon}`}></i></div>
            <div className="card-info">
              <h3>{card.title}</h3>
              <h2>{loading ? '...' : card.value}</h2>
            </div>
          </div>
        ))}
      </div>

      <div className="recent-section">
        <div className="section-header">
          <h2>Recent Events</h2>
        </div>
        <div className="events-list">
          {loading ? (
            <p style={{ color: 'var(--text-light)', padding: '20px' }}>Loading...</p>
          ) : recentEvents.length > 0 ? recentEvents.map(event => {
            const d = event.date ? new Date(event.date) : null
            return (
              <div key={event._id} className="event-item">
                <div className="event-date">
                  <span className="day">{d ? d.getDate() : '—'}</span>
                  <span className="month">{d ? d.toLocaleString('en', { month: 'short' }).toUpperCase() : '—'}</span>
                </div>
                <div className="event-details">
                  <h3>{event.title}</h3>
                  <p>{event.description}</p>
                  <div className="event-meta">
                    <span><i className="fas fa-map-marker-alt"></i> {event.location || '—'}</span>
                    <span><i className="fas fa-users"></i> {event.attendanceCount ?? '—'} Expected</span>
                  </div>
                </div>
                <div className={`event-status ${statusClass(event.status)}`}>
                  <span>{event.status}</span>
                </div>
              </div>
            )
          }) : (
            <p style={{ color: 'var(--text-light)', padding: '20px' }}>No events yet.</p>
          )}
        </div>
      </div>
    </section>
  )
}

export default DashboardOverview
