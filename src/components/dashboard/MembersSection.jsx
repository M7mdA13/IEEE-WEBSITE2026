import { useState, useRef } from 'react'

const initialMembers = [
  { id: 1, name: 'Ahmed Ali', role: 'Chairperson', department: 'CIS', email: 'ahmed.ali@ieee.org', avatar: 'https://i.pravatar.cc/150?u=ahmed' },
  { id: 2, name: 'Sara Mohamed', role: 'Vice Chairperson', department: 'RAS', email: 'sara.m@ieee.org', avatar: 'https://i.pravatar.cc/150?u=sara' },
  { id: 3, name: 'Omar Hassan', role: 'Treasurer', department: 'PES', email: 'omar.h@ieee.org', avatar: 'https://i.pravatar.cc/150?u=omar' },
  { id: 4, name: 'Laila Mahmoud', role: 'Secretary', department: 'WIE', email: 'laila.m@ieee.org', avatar: 'https://i.pravatar.cc/150?u=laila' }
]

function MembersSection() {
  const [members, setMembers] = useState(initialMembers)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingMemberId, setEditingMemberId] = useState(null)
  const [newMember, setNewMember] = useState({ name: '', role: '', department: '', email: '', avatar: '' })
  const fileInputRef = useRef(null)

  const handleOpenModal = () => setIsModalOpen(true)
  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingMemberId(null)
    setNewMember({ name: '', role: '', department: '', email: '', avatar: '' })
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setNewMember(prev => ({ ...prev, [name]: value }))
  }

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setNewMember(prev => ({ ...prev, avatar: reader.result }))
      }
      reader.readAsDataURL(file)
    }
  }

  const triggerFileUpload = () => {
    fileInputRef.current.click()
  }

  const handleEditMember = (member) => {
    setEditingMemberId(member.id)
    setNewMember({ ...member })
    handleOpenModal()
  }

  const handleDeleteMember = (id) => {
    setMembers(prev => prev.filter(m => m.id !== id))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (newMember.name && newMember.role) {
      if (editingMemberId) {
        setMembers(prev => prev.map(m => m.id === editingMemberId ? { ...newMember, id: editingMemberId } : m))
      } else {
        setMembers(prev => [...prev, { ...newMember, id: Date.now() }])
      }
      handleCloseModal()
    }
  }

  return (
    <section className="content-section active">
      <h1>Members Management</h1>
      <div className="section-header">
        <h2>All Members</h2>
        <div className="section-actions">
          <button type="button" className="action-btn" onClick={handleOpenModal}>
            <i className="fas fa-plus"></i> Add Member
          </button>
          <select className="filter-select">
            <option value="all">All Members</option>
            <option value="students">Students</option>
            <option value="faculty">Faculty</option>
            <option value="professionals">Professionals</option>
          </select>
        </div>
      </div>
      
      <div className="members-grid">
        {members.length > 0 ? (
          members.map(member => (
            <div key={member.id} className="member-card">
              <div className="member-avatar">
                <img src={member.avatar || "/images/placeholder-avatar.png"} alt={member.name} />
              </div>
              <div className="member-info">
                <h3>{member.name}</h3>
                <p className="member-role">{member.role}</p>
                <p className="member-dept">{member.department} Chapter</p>
                <div className="member-contact" style={{ marginTop: '10px' }}>
                  <a href={`mailto:${member.email}`} title={member.email}>
                    <i className="fas fa-envelope"></i>
                  </a>
                  <a href="#"><i className="fab fa-linkedin"></i></a>
                  <a href="#"><i className="fab fa-github"></i></a>
                </div>
              </div>
              <div className="member-actions">
                <button type="button" onClick={() => handleEditMember(member)} title="Edit">
                  <i className="fas fa-edit"></i>
                </button>
                <button type="button" onClick={() => handleDeleteMember(member.id)} title="Delete" style={{ color: 'var(--danger-color)' }}>
                  <i className="fas fa-trash"></i>
                </button>
              </div>
            </div>
          ))
        ) : (
          <p style={{ color: 'var(--text-light)', padding: '20px' }}>No members to display. Click "Add Member" to add one.</p>
        )}
      </div>

      {/* Add/Edit Member Modal */}
      {isModalOpen && (
        <div className="modal" style={{ display: 'flex' }}>
          <div className="modal-content">
            <span className="close-modal" onClick={handleCloseModal}>&times;</span>
            <div className="auth-header">
              <h2>{editingMemberId ? 'Edit Member' : 'Add New Member'}</h2>
              <p>{editingMemberId ? 'Update the details for this member.' : 'Enter the member details below.'}</p>
            </div>
            <form className="auth-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label><i className="fas fa-user"></i> Full Name</label>
                <input 
                  type="text" 
                  name="name" 
                  value={newMember.name} 
                  onChange={handleInputChange} 
                  placeholder="e.g. Ahmed Ali" 
                  required 
                />
              </div>
              <div className="form-row" style={{ display: 'flex', gap: '15px' }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label><i className="fas fa-user-tag"></i> Role</label>
                  <input 
                    type="text" 
                    name="role" 
                    value={newMember.role} 
                    onChange={handleInputChange} 
                    placeholder="e.g. Chairperson" 
                    required 
                  />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label><i className="fas fa-users"></i> Department</label>
                  <select name="department" value={newMember.department} onChange={handleInputChange}>
                    <option value="">Select Chapter</option>
                    <option value="CIS">CIS</option>
                    <option value="RAS">RAS</option>
                    <option value="PES">PES</option>
                    <option value="WIE">WIE</option>
                    <option value="EMBS">EMBS</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label><i className="fas fa-envelope"></i> Email Address</label>
                <input 
                  type="email" 
                  name="email" 
                  value={newMember.email} 
                  onChange={handleInputChange} 
                  placeholder="name@ieee.org" 
                />
              </div>
              <div className="form-group">
                <label><i className="fas fa-camera"></i> Member Avatar</label>
                <div className="profile-upload" style={{ marginTop: '10px' }}>
                  {newMember.avatar ? (
                    <img src={newMember.avatar} alt="Avatar Preview" style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--primary-color)' }} />
                  ) : (
                    <div className="logo-placeholder" style={{ width: '60px', height: '60px', borderRadius: '50%', border: '2px dashed var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--input-bg)' }}>
                      <i className="fas fa-user" style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}></i>
                    </div>
                  )}
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleAvatarUpload} 
                    accept="image/*" 
                    style={{ display: 'none' }} 
                  />
                  <button type="button" className="upload-btn" onClick={triggerFileUpload}>
                    <i className="fas fa-cloud-upload-alt"></i> Upload Photo
                  </button>
                </div>
              </div>
              <button type="submit" className="auth-button" style={{ marginTop: '20px' }}>
                {editingMemberId ? 'Update Member' : 'Save Member'}
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  )
}

export default MembersSection
