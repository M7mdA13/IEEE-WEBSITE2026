import { useState, useEffect } from 'react'
import api from '../../api/index'

function RecruitmentSection() {
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get('/admin/recruitment')
      .then(({ data }) => {
        setIsOpen(data.data.isOpen)
        setMessage(data.data.message || '')
      })
      .catch(() => setError('Failed to load recruitment status.'))
      .finally(() => setLoading(false))
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setSaved(false)
    setError('')
    try {
      const { data } = await api.put('/admin/recruitment', { isOpen, message })
      setIsOpen(data.data.isOpen)
      setMessage(data.data.message || '')
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="content-section active">
      <h1>Recruitment</h1>

      {loading ? (
        <p style={{ color: 'var(--text-light)', padding: '20px' }}>Loading...</p>
      ) : (
        <form onSubmit={handleSubmit} style={{ maxWidth: '560px' }}>
          {error && (
            <div style={{ background: 'var(--danger-color)', color: '#fff', padding: '10px 14px', borderRadius: '8px', marginBottom: '16px', fontSize: '0.9rem' }}>
              {error}
            </div>
          )}
          {saved && (
            <div style={{ background: 'var(--success-color)', color: '#fff', padding: '10px 14px', borderRadius: '8px', marginBottom: '16px', fontSize: '0.9rem' }}>
              Saved successfully.
            </div>
          )}

          {/* Toggle */}
          <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '20px 24px', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
            <div>
              <p style={{ fontWeight: 600, fontSize: '1rem', marginBottom: '4px' }}>Recruitment Status</p>
              <p style={{ color: 'var(--text-light)', fontSize: '0.85rem' }}>
                Controls whether the Membership page shows recruitment as open or closed.
              </p>
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', flexShrink: 0 }}>
              <input
                type="checkbox"
                checked={isOpen}
                onChange={e => setIsOpen(e.target.checked)}
                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
              />
              <span style={{ fontWeight: 700, color: isOpen ? 'var(--success-color)' : 'var(--danger-color)', fontSize: '0.95rem' }}>
                {isOpen ? 'Open' : 'Closed'}
              </span>
            </label>
          </div>

          {/* Message */}
          <div className="form-group">
            <label><i className="fas fa-comment-alt" /> Custom Message (optional)</label>
            <textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="e.g. Applications are open until April 30th. Apply via our Instagram bio link."
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--input-bg)', color: 'var(--text-color)', minHeight: '100px', resize: 'vertical' }}
            />
            <p style={{ fontSize: '0.78rem', color: 'var(--text-light)', marginTop: '6px' }}>
              Displayed on the Membership page below the open/closed heading. Leave blank to use the default message.
            </p>
          </div>

          <button type="submit" className="auth-button" style={{ marginTop: '8px' }} disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      )}
    </section>
  )
}

export default RecruitmentSection
