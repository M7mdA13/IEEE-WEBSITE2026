import { useState, useEffect, useRef } from 'react'
import { QRCodeCanvas } from 'qrcode.react'
import api from '../../api/index'
import { normalizeUrl, isValidUrl } from '../../utils/url'

function RecruitmentSection() {
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [formLink, setFormLink] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const qrWrapRef = useRef(null)

  useEffect(() => {
    api.get('/admin/recruitment')
      .then(({ data }) => {
        setIsOpen(data.data.isOpen)
        setMessage(data.data.message || '')
        setFormLink(data.data.formLink || '')
      })
      .catch(() => setError('Failed to load recruitment status.'))
      .finally(() => setLoading(false))
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!isValidUrl(formLink)) {
      setError('Form link doesn\'t look like a valid URL.')
      return
    }
    setSaving(true)
    setSaved(false)
    setError('')
    try {
      const { data } = await api.put('/admin/recruitment', { isOpen, message, formLink: normalizeUrl(formLink) })
      setIsOpen(data.data.isOpen)
      setMessage(data.data.message || '')
      setFormLink(data.data.formLink || '')
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save.')
    } finally {
      setSaving(false)
    }
  }

  // Full-resolution PNG for posters / flyers — the canvas renders at 1024px
  // and is only scaled down on screen.
  const downloadQr = () => {
    const canvas = qrWrapRef.current?.querySelector('canvas')
    if (!canvas) return
    const a = document.createElement('a')
    a.href = canvas.toDataURL('image/png')
    a.download = 'ieee-must-recruitment-qr.png'
    a.click()
  }

  const previewLink = isValidUrl(formLink) ? normalizeUrl(formLink) : ''

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

          {/* Application form link */}
          <div className="form-group">
            <label><i className="fas fa-link" /> Application Form Link</label>
            <input
              type="text"
              inputMode="url"
              value={formLink}
              onChange={e => setFormLink(e.target.value)}
              onBlur={() => setFormLink(prev => normalizeUrl(prev) || prev)}
              placeholder="https://forms.gle/..."
              style={{ width: '100%' }}
            />
            <span className="form-hint">
              Your Google Form (or any sign-up link). While recruitment is open, the Membership page shows it as a QR code and an <strong>Apply now</strong> button.
            </span>
          </div>

          {previewLink && (
            <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '16px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '18px', flexWrap: 'wrap' }}>
              <div ref={qrWrapRef} style={{ background: '#fff', padding: '8px', borderRadius: '10px', lineHeight: 0 }}>
                <QRCodeCanvas value={previewLink} size={1024} level="M" marginSize={2} fgColor="#054377" style={{ width: '132px', height: '132px' }} />
              </div>
              <div style={{ flex: '1 1 200px', minWidth: 0 }}>
                <p style={{ fontWeight: 600, marginBottom: '4px' }}>QR preview</p>
                <p style={{ color: 'var(--text-light)', fontSize: '0.82rem', marginBottom: '12px' }}>
                  Scan it with your phone to check it opens the right form.
                </p>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <button type="button" className="action-btn" onClick={downloadQr}>
                    <i className="fas fa-download" /> Download PNG
                  </button>
                  <a href={previewLink} target="_blank" rel="noopener noreferrer" className="link-chip">
                    <i className="fas fa-external-link-alt" /> Open form
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Message */}
          <div className="form-group">
            <label><i className="fas fa-comment-alt" /> Custom Message (optional)</label>
            <textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="e.g. Applications are open until April 30th."
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--input-bg)', color: 'var(--text-color)', minHeight: '100px', resize: 'vertical' }}
            />
            <p style={{ fontSize: '0.78rem', color: 'var(--text-light)', marginTop: '6px' }}>
              Displayed on the Membership page below the open/closed heading. Leave blank to use the default message — and remember to update it when you open or close recruitment.
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
