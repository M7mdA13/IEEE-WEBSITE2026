import { useState, useRef } from 'react'

const initialPartners = [
  { id: 1, name: 'Google', category: 'Technology Partner', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg', website: 'https://google.com' },
  { id: 2, name: 'Microsoft', category: 'Innovation Partner', logo: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg', website: 'https://microsoft.com' },
  { id: 3, name: 'IEEE Region 8', category: 'Strategic Partner', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/21/IEEE_logo.svg', website: 'https://ieeer8.org' }
]

function PartnersSection() {
  const [partners, setPartners] = useState(initialPartners)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingPartnerId, setEditingPartnerId] = useState(null)
  const [newPartner, setNewPartner] = useState({ name: '', category: '', website: '', logo: '' })
  const fileInputRef = useRef(null)

  const handleOpenModal = () => setIsModalOpen(true)
  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingPartnerId(null)
    setNewPartner({ name: '', category: '', website: '', logo: '' })
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setNewPartner(prev => ({ ...prev, [name]: value }))
  }

  const handleLogoUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setNewPartner(prev => ({ ...prev, logo: reader.result }))
      }
      reader.readAsDataURL(file)
    }
  }

  const triggerFileUpload = () => {
    fileInputRef.current.click()
  }

  const handleEditPartner = (partner) => {
    setEditingPartnerId(partner.id)
    setNewPartner({ name: partner.name, category: partner.category, website: partner.website, logo: partner.logo })
    handleOpenModal()
  }

  const handleDeletePartner = (id) => {
    setPartners(prev => prev.filter(p => p.id !== id))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (newPartner.name && newPartner.category) {
      if (editingPartnerId) {
        setPartners(prev => prev.map(p => p.id === editingPartnerId ? { ...newPartner, id: editingPartnerId } : p))
      } else {
        setPartners(prev => [...prev, { ...newPartner, id: Date.now() }])
      }
      handleCloseModal()
    }
  }

  return (
    <section className="content-section active">
      <h1>Partners</h1>
      <div className="section-header">
        <h2>Our Partners</h2>
        <div className="section-actions">
          <button type="button" className="action-btn" onClick={handleOpenModal}>
            <i className="fas fa-plus"></i> Add Partner
          </button>
        </div>
      </div>
      
      <div className="partners-grid">
        {partners.length > 0 ? (
          partners.map(partner => (
            <div key={partner.id} className="partner-card">
              <div className="partner-logo">
                <img src={partner.logo || "/images/placeholder-logo.png"} alt={partner.name} />
              </div>
              <div className="partner-info">
                <p className="partner-type">{partner.category}</p>
                <h3>{partner.name}</h3>
                <div className="partner-contact">
                  <a href={partner.website} target="_blank" rel="noopener noreferrer">
                    <i className="fas fa-external-link-alt"></i> Website
                  </a>
                </div>
                <div className="partner-actions">
                  <button type="button" className="action-btn mini" onClick={() => handleEditPartner(partner)}>
                    <i className="fas fa-edit"></i>
                  </button>
                  <button type="button" className="action-btn mini danger" onClick={() => handleDeletePartner(partner.id)}>
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p style={{ color: 'var(--text-light)', padding: '20px' }}>No partners to display. Click "Add Partner" to add one.</p>
        )}
      </div>

      {/* Add/Edit Partner Modal */}
      {isModalOpen && (
        <div className="modal" style={{ display: 'flex' }}>
          <div className="modal-content">
            <span className="close-modal" onClick={handleCloseModal}>&times;</span>
            <div className="auth-header">
              <h2>{editingPartnerId ? 'Edit Partner' : 'Add New Partner'}</h2>
              <p>{editingPartnerId ? 'Update the details of the partner.' : 'Enter the details of the new partner below.'}</p>
            </div>
            <form className="auth-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label><i className="fas fa-building"></i> Partner Name</label>
                <input 
                  type="text" 
                  name="name" 
                  value={newPartner.name} 
                  onChange={handleInputChange} 
                  placeholder="e.g. Google" 
                  required 
                />
              </div>
              <div className="form-group">
                <label><i className="fas fa-tag"></i> Category</label>
                <input 
                  type="text" 
                  name="category" 
                  value={newPartner.category} 
                  onChange={handleInputChange} 
                  placeholder="e.g. Technology Partner" 
                  required 
                />
              </div>
              <div className="form-group">
                <label><i className="fas fa-link"></i> Website URL</label>
                <input 
                  type="url" 
                  name="website" 
                  value={newPartner.website} 
                  onChange={handleInputChange} 
                  placeholder="https://example.com" 
                />
              </div>
              <div className="form-group">
                <label><i className="fas fa-image"></i> Partner Logo</label>
                <div className="profile-upload" style={{ marginTop: '10px' }}>
                  {newPartner.logo ? (
                    <img src={newPartner.logo} alt="Logo Preview" style={{ width: '60px', height: '60px', borderRadius: '8px', objectFit: 'contain', border: '1px solid var(--border-color)', background: 'white' }} />
                  ) : (
                    <div className="logo-placeholder" style={{ width: '60px', height: '60px', borderRadius: '8px', border: '2px dashed var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--input-bg)' }}>
                      <i className="fas fa-image" style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}></i>
                    </div>
                  )}
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleLogoUpload} 
                    accept="image/*" 
                    style={{ display: 'none' }} 
                  />
                  <button type="button" className="upload-btn" onClick={triggerFileUpload}>
                    <i className="fas fa-cloud-upload-alt"></i> Upload Logo
                  </button>
                </div>
              </div>
              <button type="submit" className="auth-button" style={{ marginTop: '20px' }}>
                {editingPartnerId ? 'Update Partner' : 'Save Partner'}
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  )
}

export default PartnersSection
