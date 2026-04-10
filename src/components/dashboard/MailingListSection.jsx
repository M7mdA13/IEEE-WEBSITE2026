import { useState, useEffect } from 'react'
import api from '../../api/index'

function MailingListSection() {
  const [subscribers, setSubscribers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchSubscribers = async () => {
    try {
      setLoading(true)
      const { data } = await api.get('/admin/mailing-list')
      setSubscribers(data.data)
    } catch {
      setError('Failed to load subscribers.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchSubscribers() }, [])

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this subscriber?')) return
    try {
      await api.delete(`/admin/mailing-list/${id}`)
      setSubscribers(prev => prev.filter(s => s._id !== id))
    } catch {
      setError('Failed to remove subscriber.')
    }
  }

  return (
    <section className="content-section active">
      <h1>Mailing List</h1>
      {error && <p style={{ color: 'var(--danger-color)', marginBottom: '12px' }}>{error}</p>}

      <div className="section-header">
        <h2>Subscribers ({subscribers.length})</h2>
      </div>

      {loading ? (
        <p style={{ color: 'var(--text-light)', padding: '20px' }}>Loading...</p>
      ) : subscribers.length === 0 ? (
        <p style={{ color: 'var(--text-light)', padding: '20px' }}>No subscribers yet.</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', textAlign: 'left' }}>
                <th style={{ padding: '10px 14px', color: 'var(--text-light)', fontWeight: 600 }}>#</th>
                <th style={{ padding: '10px 14px', color: 'var(--text-light)', fontWeight: 600 }}>Email</th>
                <th style={{ padding: '10px 14px', color: 'var(--text-light)', fontWeight: 600 }}>Subscribed</th>
                <th style={{ padding: '10px 14px' }}></th>
              </tr>
            </thead>
            <tbody>
              {subscribers.map((sub, i) => (
                <tr key={sub._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '10px 14px', color: 'var(--text-light)' }}>{i + 1}</td>
                  <td style={{ padding: '10px 14px' }}>{sub.email}</td>
                  <td style={{ padding: '10px 14px', color: 'var(--text-light)', whiteSpace: 'nowrap' }}>
                    {new Date(sub.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </td>
                  <td style={{ padding: '10px 14px', textAlign: 'right' }}>
                    <button
                      type="button"
                      className="action-btn mini danger"
                      onClick={() => handleDelete(sub._id)}
                      title="Remove subscriber"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}

export default MailingListSection
