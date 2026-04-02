import { useState, useRef } from 'react'

const initialEvents = [
  { id: 1, title: 'Arduino Workshop', date: '2026-05-15', location: 'Room 402', attendance: 45, status: 'Upcoming', description: 'Hand-on session with Arduino and basic sensors.', image: 'https://images.unsplash.com/photo-1553406830-ef2513450d76?auto=format&fit=crop&q=80&w=1000' },
  { id: 2, title: 'Soft Skills Session', date: '2026-06-10', location: 'Main Hall', attendance: 120, status: 'Upcoming', description: 'Learn public speaking and communication skills.', image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=1000' },
  { id: 3, title: 'Annual General Meeting', date: '2026-04-01', location: 'Conference Room', attendance: 30, status: 'Completed', description: 'Official IEEE MUST student branch AGM.', image: 'https://images.unsplash.com/photo-1540317580384-e5d43616b9aa?auto=format&fit=crop&q=80&w=1000' }
]

function EventsSection() {
  const [events, setEvents] = useState(initialEvents)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingEventId, setEditingEventId] = useState(null)
  const [newEvent, setNewEvent] = useState({ title: '', date: '', location: '', attendance: '', description: '', status: 'Upcoming', image: '' })
  const fileInputRef = useRef(null)

  const handleOpenModal = () => setIsModalOpen(true)
  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingEventId(null)
    setNewEvent({ title: '', date: '', location: '', attendance: '', description: '', status: 'Upcoming', image: '' })
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setNewEvent(prev => ({ ...prev, [name]: value }))
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setNewEvent(prev => ({ ...prev, image: reader.result }))
      }
      reader.readAsDataURL(file)
    }
  }

  const triggerFileUpload = () => {
    fileInputRef.current.click()
  }

  const handleEditEvent = (event) => {
    setEditingEventId(event.id)
    setNewEvent({ ...event })
    handleOpenModal()
  }

  const handleDeleteEvent = (id) => {
    setEvents(prev => prev.filter(e => e.id !== id))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (newEvent.title && newEvent.date) {
      if (editingEventId) {
        setEvents(prev => prev.map(ev => ev.id === editingEventId ? { ...newEvent, id: editingEventId } : ev))
      } else {
        setEvents(prev => [...prev, { ...newEvent, id: Date.now() }])
      }
      handleCloseModal()
    }
  }

  return (
    <section className="content-section active">
      <h1>Events Management</h1>
      <div className="section-header">
        <h2>All Events</h2>
        <div className="section-actions">
          <button type="button" className="action-btn" onClick={handleOpenModal}>
            <i className="fas fa-plus"></i> Add Event
          </button>
          <div className="filter-dropdown">
            <button className="filter-btn"><i className="fas fa-filter"></i> Filter</button>
          </div>
        </div>
      </div>

      <div className="events-grid">
        {events.length > 0 ? (
          events.map(event => (
            <div key={event.id} className="event-card">
              <div className="event-card-header" style={{ padding: '0', position: 'relative' }}>
                <img src={event.image || "/images/placeholder-event.png"} alt={event.title} style={{ width: '100%', height: '180px', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', top: '10px', right: '10px', display: 'flex', gap: '8px' }}>
                  <button type="button" className="action-btn mini" onClick={() => handleEditEvent(event)} style={{ background: 'white', color: 'var(--primary-color)' }}>
                    <i className="fas fa-edit"></i>
                  </button>
                  <button type="button" className="action-btn mini danger" onClick={() => handleDeleteEvent(event.id)}>
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              </div>
              <div className="event-card-body">
                <span className={`status-badge ${event.status.toLowerCase()}`} style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '12px', background: 'var(--sidebar-active)', color: 'var(--primary-color)', marginBottom: '10px', display: 'inline-block' }}>
                  {event.status}
                </span>
                <h3>{event.title}</h3>
                <div className="event-date">
                  <i className="fas fa-calendar-alt"></i> {event.date}
                </div>
                <div className="event-location" style={{ marginTop: '5px' }}>
                  <i className="fas fa-map-marker-alt"></i> {event.location}
                </div>
                <div className="event-description" style={{ fontSize: '0.85rem', margin: '15px 0' }}>
                  {event.description}
                </div>
              </div>
              <div className="event-card-footer">
                <div className="event-attendance">
                  <i className="fas fa-users"></i> {event.attendance} Expected
                </div>
              </div>
            </div>
          ))
        ) : (
          <p style={{ color: 'var(--text-light)', padding: '20px' }}>No events to display. Click "Add Event" to create one.</p>
        )}
      </div>

      {/* Add/Edit Event Modal */}
      {isModalOpen && (
        <div className="modal" style={{ display: 'flex' }}>
          <div className="modal-content" style={{ maxWidth: '600px' }}>
            <span className="close-modal" onClick={handleCloseModal}>&times;</span>
            <div className="auth-header">
              <h2>{editingEventId ? 'Edit Event' : 'Add New Event'}</h2>
              <p>{editingEventId ? 'Update the details for this event.' : 'Enter the event details below.'}</p>
            </div>
            <form className="auth-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label><i className="fas fa-heading"></i> Event Title</label>
                <input
                  type="text"
                  name="title"
                  value={newEvent.title}
                  onChange={handleInputChange}
                  placeholder="e.g Arduino Workshop"
                  required
                />
              </div>
              <div className="form-row" style={{ display: 'flex', gap: '15px' }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label><i className="fas fa-calendar-day"></i> Date</label>
                  <input
                    type="date"
                    name="date"
                    value={newEvent.date}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label><i className="fas fa-map-marker-alt"></i> Location</label>
                  <input
                    type="text"
                    name="location"
                    value={newEvent.location}
                    onChange={handleInputChange}
                    placeholder="e.g. Room 402"
                    required
                  />
                </div>
              </div>
              <div className="form-row" style={{ display: 'flex', gap: '15px' }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label><i className="fas fa-users"></i> Expected Attendance</label>
                  <input
                    type="number"
                    name="attendance"
                    value={newEvent.attendance}
                    onChange={handleInputChange}
                    placeholder="e.g. 50"
                  />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label><i className="fas fa-info-circle"></i> Status</label>
                  <select name="status" value={newEvent.status} onChange={handleInputChange}>
                    <option value="Upcoming">Upcoming</option>
                    <option value="Ongoing">Ongoing</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label><i className="fas fa-align-left"></i> Description</label>
                <textarea
                  name="description"
                  value={newEvent.description}
                  onChange={handleInputChange}
                  placeholder="Enter event description..."
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--input-bg)', color: 'var(--text-color)', minHeight: '100px' }}
                ></textarea>
              </div>
              <div className="form-group">
                <label><i className="fas fa-image"></i> Event Poster</label>
                <div className="profile-upload" style={{ marginTop: '10px' }}>
                  {newEvent.image ? (
                    <img src={newEvent.image} alt="Poster Preview" style={{ width: '100px', height: '60px', borderRadius: '8px', objectFit: 'cover', border: '1px solid var(--border-color)' }} />
                  ) : (
                    <div className="logo-placeholder" style={{ width: '100px', height: '60px', borderRadius: '8px', border: '2px dashed var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--input-bg)' }}>
                      <i className="fas fa-image" style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}></i>
                    </div>
                  )}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    style={{ display: 'none' }}
                  />
                  <button type="button" className="upload-btn" onClick={triggerFileUpload}>
                    <i className="fas fa-cloud-upload-alt"></i> Upload Poster
                  </button>
                </div>
              </div>
              <button type="submit" className="auth-button" style={{ marginTop: '20px' }}>
                {editingEventId ? 'Update Event' : 'Create Event'}
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  )
}

export default EventsSection
